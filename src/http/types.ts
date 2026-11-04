/** Module 1 — Identity & Authentication API types */

export interface RoleSummary {
  id: number;
  code: string;
  name: string;
}

export interface TeamSummary {
  id: number;
  name: string;
}

export interface OfficeSummary {
  id: number;
  name: string;
  city: string;
}

export interface PermissionItem {
  code: string;
  scope: "own" | "team" | "office" | "all";
}

export interface UserProfile {
  id: number;
  email: string;
  name: string;
  first_name: string;
  last_name: string;
  phone: string;
  employee_code: string | null;
  role: RoleSummary | null;
  team: TeamSummary | null;
  office: OfficeSummary | null;
  permissions: PermissionItem[];
  is_superuser: boolean;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  meta?: Record<string, unknown> | null;
}

export interface ApiErrorBody {
  success: false;
  message: string;
  error: {
    code: string;
    details: string | Record<string, string[]>;
  };
}

export interface LoginResponseData {
  access: string;
  refresh: string;
  user: UserProfile;
}

export interface LoginPayload {
  email: string;
  password: string;
  remember_me?: boolean;
}

export interface InviteValidateData {
  token: string;
  email: string;
  first_name: string;
  last_name: string;
  employee_code: string | null;
  role: RoleSummary | null;
  team: TeamSummary | null;
  expires_at: string;
}

export interface InviteCreateData {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  employee_code: string | null;
  token: string;
  role: string;
  expires_at: string;
}

export interface ResetValidateData {
  token: string;
  email: string;
  expires_at: string;
}

export class ApiError extends Error {
  code: string;
  details: string | Record<string, string[]>;
  status: number;

  constructor(message: string, code: string, details: string | Record<string, string[]>, status: number) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.details = details;
    this.status = status;
  }
}
