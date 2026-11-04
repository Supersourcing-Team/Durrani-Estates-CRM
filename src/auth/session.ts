import { eng, closeM, render } from "../engine";
import {
  acceptInvite as apiAcceptInvite,
  changePassword as apiChangePassword,
  forgotPassword as apiForgotPassword,
  getCurrentUser,
  inviteStaff as apiInviteStaff,
  login as apiLogin,
  logout as apiLogout,
  resetPassword as apiResetPassword,
  validateInvite as apiValidateInvite,
  validateResetToken as apiValidateResetToken,
} from "../http/auth";
import { clearTokens, getAccessToken, getRefreshToken, setTokens } from "../http/tokens";
import {
  ApiError,
  type InviteCreateData,
  type InviteValidateData,
  type ResetValidateData,
  type UserProfile,
} from "../http/types";
import { passwordHint, passwordOk } from "./password";

export type AppRole = "agent" | "mgmt" | "admin";

const ROLE_NAME: Record<AppRole, string> = {
  agent: "Agent",
  mgmt: "Management",
  admin: "Admin",
};

/** Map API role.code → prototype shell role key */
export function mapApiRole(code?: string | null): AppRole | null {
  const c = String(code || "")
    .trim()
    .toLowerCase();
  if (!c) return null;
  if (c === "agent" || c === "property_agent" || c === "property-agent") return "agent";
  if (c === "admin" || c === "administrator" || c === "superadmin") return "admin";
  if (
    c === "mgmt" ||
    c === "manager" ||
    c === "management" ||
    c === "team_manager" ||
    c === "team-manager"
  ) {
    return "mgmt";
  }
  return null;
}

export function roleLabel(role: AppRole): string {
  return ROLE_NAME[role];
}

function fieldErrors(err: unknown): Record<string, string> {
  if (!(err instanceof ApiError)) return {};
  if (typeof err.details === "string") return {};
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(err.details || {})) {
    out[k] = Array.isArray(v) ? v[0] : String(v);
  }
  return out;
}

/** Ensure prototype engine has a user row so screens using eng.me() keep working. */
export function applyUserToEngine(user: UserProfile, preferredRole?: AppRole): AppRole {
  const role = preferredRole || mapApiRole(user.role?.code);
  if (!role) {
    throw new ApiError(
      "This account role is not supported in the app.",
      "UNSUPPORTED_ROLE",
      "Unsupported role",
      403,
    );
  }

  const S = eng.S as any;
  const email = String(user.email || "").toLowerCase();
  let u = S.users.find((x: any) => String(x.email || "").toLowerCase() === email);

  if (!u) {
    const id = `apiu${user.id}`;
    const teamName = user.team?.name;
    const team =
      (teamName && S.teams?.find((t: any) => t.name === teamName)?.id) ||
      S.teams?.[0]?.id ||
      null;

    u = {
      id,
      name: user.name || `${user.first_name || ""} ${user.last_name || ""}`.trim() || email,
      role,
      emp: user.employee_code || `USR-${user.id}`,
      email: user.email,
      phone: user.phone || "",
      team: role === "admin" ? undefined : team,
      office: user.office?.name || user.office?.city || undefined,
      status: "active",
      slab: role === "agent" ? null : undefined,
      cap: role === "agent" ? 30 : undefined,
    };
    S.users.push(u);
  } else {
    u.name = user.name || u.name;
    u.role = role;
    u.emp = user.employee_code || u.emp;
    u.phone = user.phone || u.phone;
    u.status = "active";
  }

  S.session = { role, userId: u.id };
  S.fails = 0;
  (eng.UI as any).f = {};
  (eng.UI as any).pg = {};
  return role;
}

export function clearEngineSession(): void {
  (eng.S as any).session = null;
  closeM();
}

export async function loginWithApi(opts: {
  email: string;
  password: string;
  tabRole: AppRole;
  rememberMe?: boolean;
}): Promise<{ role: AppRole; user: UserProfile }> {
  const data = await apiLogin({
    email: opts.email,
    password: opts.password,
    remember_me: !!opts.rememberMe,
  });

  if (!data.success || !data.data) {
    throw new ApiError(data.message || "Sign in failed", "LOGIN_FAILED", data.message || "", 400);
  }

  const { access, refresh: refreshToken, user } = data.data;
  const apiRole = mapApiRole(user.role?.code);

  if (!apiRole) {
    throw new ApiError(
      "This account role is not supported in the app.",
      "UNSUPPORTED_ROLE",
      "Unsupported role",
      403,
    );
  }

  if (apiRole !== opts.tabRole) {
    const n = ROLE_NAME[apiRole];
    throw new ApiError(
      `This is ${/^[AEIOU]/i.test(n) ? "an" : "a"} ${n} account. Choose ${n} above to sign in.`,
      "ROLE_MISMATCH",
      { email: `This is ${/^[AEIOU]/i.test(n) ? "an" : "a"} ${n} account. Choose ${n} above to sign in.` },
      403,
    );
  }

  setTokens(access, refreshToken);
  const role = applyUserToEngine(user, apiRole);
  return { role, user };
}

export async function logoutWithApi(): Promise<void> {
  const refreshToken = getRefreshToken();
  try {
    if (refreshToken) await apiLogout(refreshToken);
  } catch {
    /* still clear local session */
  }
  clearTokens();
  clearEngineSession();
  location.hash = "#login";
  render();
}

export async function restoreSessionFromTokens(): Promise<boolean> {
  if (!getAccessToken()) return false;
  try {
    const data = await getCurrentUser();
    if (!data.success || !data.data) {
      clearTokens();
      return false;
    }
    applyUserToEngine(data.data);
    render();
    return true;
  } catch {
    clearTokens();
    clearEngineSession();
    return false;
  }
}

export function apiErrorToForm(err: unknown): {
  fields: Record<string, string>;
  message?: string;
  locked?: boolean;
} {
  if (!(err instanceof ApiError)) {
    return { fields: {}, message: "Something went wrong. Please try again." };
  }
  if (err.code === "ACCOUNT_LOCKED" || err.status === 423) {
    return { fields: {}, message: err.message, locked: true };
  }
  const fields = fieldErrors(err);
  if (err.code === "ROLE_MISMATCH") {
    return { fields: fields.email ? fields : { email: err.message }, message: undefined };
  }
  if (Object.keys(fields).length) return { fields, message: undefined };
  return { fields: {}, message: err.message };
}

/** Hash router splits on `-`; rejoin UUID / opaque tokens. */
export function routeToken(params: string[]): string {
  return params.filter(Boolean).join("-");
}

export async function requestForgotPassword(email: string): Promise<{ token?: string }> {
  const data = await apiForgotPassword(email);
  if (!data.success) {
    throw new ApiError(data.message || "Request failed", "FORGOT_FAILED", data.message || "", 400);
  }
  return data.data || {};
}

export async function loadResetToken(token: string): Promise<ResetValidateData> {
  const data = await apiValidateResetToken(token);
  if (!data.success || !data.data) {
    throw new ApiError(
      data.message || "This reset link is not valid.",
      "RESET_INVALID",
      data.message || "",
      400,
    );
  }
  return data.data;
}

export async function confirmResetPassword(token: string, newPassword: string): Promise<void> {
  const hint = passwordHint(newPassword);
  if (hint) {
    throw new ApiError(hint, "VALIDATION_ERROR", { new_password: hint }, 400);
  }
  const data = await apiResetPassword(token, newPassword);
  if (!data.success) {
    throw new ApiError(data.message || "Reset failed", "RESET_FAILED", data.message || "", 400);
  }
}

export async function loadInviteToken(token: string): Promise<InviteValidateData> {
  const data = await apiValidateInvite(token);
  if (!data.success || !data.data) {
    throw new ApiError(
      data.message || "This invite link is not valid.",
      "INVITE_INVALID",
      data.message || "",
      400,
    );
  }
  return data.data;
}

export async function acceptInviteWithApi(opts: {
  token: string;
  password: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
}): Promise<void> {
  const hint = passwordHint(opts.password);
  if (hint) {
    throw new ApiError(hint, "VALIDATION_ERROR", { password: hint }, 400);
  }
  const data = await apiAcceptInvite(opts);
  if (!data.success) {
    throw new ApiError(data.message || "Could not activate account", "ACCEPT_FAILED", data.message || "", 400);
  }
}

export async function changePasswordWithApi(current: string, next: string): Promise<void> {
  const hint = passwordHint(next);
  if (hint) {
    throw new ApiError(hint, "VALIDATION_ERROR", { new_password: hint }, 400);
  }
  if (!passwordOk(current)) {
    throw new ApiError("Enter your current password.", "VALIDATION_ERROR", { current_password: "Enter your current password." }, 400);
  }
  if (current === next) {
    throw new ApiError(
      "Choose a password you have not used before.",
      "VALIDATION_ERROR",
      { new_password: "Choose a password you have not used before." },
      400,
    );
  }
  const data = await apiChangePassword(current, next);
  if (!data.success) {
    throw new ApiError(data.message || "Could not update password", "CHANGE_FAILED", data.message || "", 400);
  }
}

export async function inviteStaffWithApi(body: {
  email: string;
  role: string;
  first_name: string;
  last_name: string;
  employee_code?: string;
  team_id?: number;
}): Promise<InviteCreateData> {
  const data = await apiInviteStaff(body);
  if (!data.success || !data.data) {
    throw new ApiError(data.message || "Invite failed", "INVITE_FAILED", data.message || "", 400);
  }
  return data.data;
}

export function splitName(full: string): { first_name: string; last_name: string } {
  const parts = String(full || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (!parts.length) return { first_name: "", last_name: "" };
  if (parts.length === 1) return { first_name: parts[0], last_name: parts[0] };
  return { first_name: parts[0], last_name: parts.slice(1).join(" ") };
}

