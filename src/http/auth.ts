/**
 * Auth API methods: named functions + apiEndpoints + axios client.
 */
import { api } from "./axios";
import { apiEndpoints } from "./apiEndpoint";
import type {
  ApiResponse,
  InviteCreateData,
  InviteValidateData,
  LoginPayload,
  LoginResponseData,
  ResetValidateData,
  UserProfile,
} from "./types";

export type InviteStaffPayload = {
  email: string;
  role: string;
  first_name: string;
  last_name: string;
  employee_code?: string;
  team_id?: number;
};

export type AcceptInvitePayload = {
  token: string;
  password: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
};

export async function login(payload: LoginPayload) {
  const { data } = await api.post<ApiResponse<LoginResponseData>>(
    apiEndpoints.auth.login,
    payload,
  );
  return data;
}

export async function logout(refresh: string) {
  const { data } = await api.post<ApiResponse<null>>(apiEndpoints.auth.logout, { refresh });
  return data;
}

export async function refresh(refreshToken: string) {
  const { data } = await api.post<ApiResponse<{ access: string }>>(apiEndpoints.auth.refresh, {
    refresh: refreshToken,
  });
  return data;
}

export async function getCurrentUser() {
  const { data } = await api.get<ApiResponse<UserProfile>>(apiEndpoints.auth.me);
  return data;
}

export async function forgotPassword(email: string) {
  const { data } = await api.post<ApiResponse<{ token?: string }>>(
    apiEndpoints.auth.forgotPassword,
    { email },
  );
  return data;
}

export async function validateResetToken(token: string) {
  const { data } = await api.get<ApiResponse<ResetValidateData>>(
    apiEndpoints.auth.resetPasswordByToken(token),
  );
  return data;
}

export async function resetPassword(token: string, new_password: string) {
  const { data } = await api.post<ApiResponse<null>>(apiEndpoints.auth.resetPassword, {
    token,
    new_password,
  });
  return data;
}

export async function changePassword(current_password: string, new_password: string) {
  const { data } = await api.post<ApiResponse<null>>(apiEndpoints.auth.changePassword, {
    current_password,
    new_password,
  });
  return data;
}

export async function inviteStaff(body: InviteStaffPayload) {
  const { data } = await api.post<ApiResponse<InviteCreateData>>(apiEndpoints.auth.invite, body);
  return data;
}

export async function validateInvite(token: string) {
  const { data } = await api.get<ApiResponse<InviteValidateData>>(
    apiEndpoints.auth.inviteByToken(token),
  );
  return data;
}

export async function acceptInvite(body: AcceptInvitePayload) {
  const { data } = await api.post<ApiResponse<null>>(apiEndpoints.auth.acceptInvite, body);
  return data;
}
