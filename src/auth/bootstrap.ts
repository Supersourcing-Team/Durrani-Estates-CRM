import { actions, def, eng, closeM, toast, renderOverlay } from "../engine";
import {
  apiErrorToForm,
  inviteStaffWithApi,
  logoutWithApi,
  mapApiRole,
  restoreSessionFromTokens,
  splitName,
} from "./session";

/** Register Module 1 auth routes not present in the prototype engine. */
function registerAuthRoutes(): void {
  def("login-reset", {
    role: "login",
    level: "L2",
    title: "Choose a new password",
    sample: [["token"]],
  });
}

async function createInviteFromForm(): Promise<void> {
  const UI = eng.UI;
  const S = eng.S;
  const f = UI.mf;
  if (f._busy) return;

  const e: Record<string, string> = {};
  const name = String(f.name || "").trim();
  const email = String(f.email || "").trim().toLowerCase();
  const role = String(f.role || "agent");
  const { first_name, last_name } = splitName(name);

  if (!name) e.name = "Enter a name.";
  if (!/^\S+@\S+\.\S+$/.test(email)) e.email = "Enter a valid email.";
  if (role !== "admin" && !f.team) e.team = "Choose a team.";
  if (Object.keys(e).length) {
    f._e = e;
    renderOverlay();
    return;
  }

  const appRole = mapApiRole(role) || (role as "agent" | "mgmt" | "admin");
  let team_id: number | undefined;
  if (appRole !== "admin" && f.team) {
    const n = Number(String(f.team).replace(/\D/g, ""));
    // Prefer numeric API ids when the prototype team id is like t1
    const team = S.teams?.find((t: any) => t.id === f.team);
    team_id = Number(team?.apiId || team?.id || n) || undefined;
    if (!Number.isFinite(team_id as number)) team_id = undefined;
  }

  f._busy = true;
  f._e = {};
  renderOverlay();

  try {
    const invited = await inviteStaffWithApi({
      email,
      role: appRole,
      first_name,
      last_name,
      team_id,
    });

    // Keep people list usable; avoid `-` in ids (hash router splits on them).
    const id = `apiinv${invited.id}`;
    const nu: any = {
      id,
      name: `${invited.first_name} ${invited.last_name}`.trim() || email,
      role: appRole,
      emp: invited.employee_code || `USR-${invited.id}`,
      email: invited.email,
      phone: String(f.phone || "").trim(),
      status: "invited",
    };
    if (appRole !== "admin") {
      nu.team = f.team;
      const tm = S.teams?.find((t: any) => t.id === f.team);
      if (tm?.office) nu.office = tm.office;
    }
    if (appRole === "agent") {
      nu.slab = f.slab || null;
      nu.cap = +(f.cap || 30);
      if (f.tag) nu.tag = f.tag;
    }
    S.users.push(nu);
    if (invited.token) {
      S.invites = S.invites || {};
      S.invites[invited.token] = { u: id, exp: Date.parse(invited.expires_at) || Date.now() + 86400000 };
    }

    f._busy = false;
    closeM();
    toast(`${nu.name} invited. Link expires in 24 hours`, "ok");
    if (invited.token) {
      // Dev convenience: copy path into toast context via console
      console.info(`[invite] #invite-${invited.token}`);
    }
    eng.go("admin-user-" + id);
  } catch (err) {
    const mapped = apiErrorToForm(err);
    f._busy = false;
    f._e = {
      ...(mapped.fields.email ? { email: mapped.fields.email } : {}),
      ...(mapped.fields.first_name || mapped.fields.last_name
        ? { name: mapped.fields.first_name || mapped.fields.last_name }
        : {}),
      ...(mapped.fields.role ? { role: mapped.fields.role } : {}),
      ...(mapped.fields.team_id ? { team: mapped.fields.team_id } : {}),
    };
    if (!Object.keys(f._e).length && mapped.message) {
      f._e = { email: mapped.message };
    }
    renderOverlay();
  }
}

/** Override prototype auth actions to call Module 1 APIs. */
export function installAuthOverrides(): void {
  registerAuthRoutes();

  const A = actions();
  const origUsersave = A.usersave;

  A.logout = () => {
    void logoutWithApi();
  };

  // Create path → API invite; edit path stays on prototype until people API exists.
  A.usersave = (a) => {
    if (a[0]) {
      origUsersave?.(a);
      return;
    }
    void createInviteFromForm();
  };

  // Screen forms call APIs directly; neutralize prototype handlers.
  A.forgot = () => {};
  A.setpw = () => {};
  A.pwsave = () => {};
}

/** Restore session from stored JWTs on app boot. */
export async function bootstrapAuthSession(): Promise<void> {
  await restoreSessionFromTokens();
}
