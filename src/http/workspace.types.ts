/** Lead Pipeline — Workspace API types */

export type CallResult =
  | "Connected"
  | "Not answering"
  | "Not connected"
  | "Wrong number"
  | "DND requested";

export interface WorkspaceOptions {
  call_results?: unknown[];
  action_types?: unknown[];
  options?: unknown[];
  duration_source?: string;
  [key: string]: unknown;
}

export interface CallAttempt {
  id: number;
  lead?: number;
  agent?: number;
  ownership_cycle?: string;
  status?: string;
  created_at?: string;
  resolved_at?: string | null;
  reason?: string;
  phone?: string;
  [key: string]: unknown;
}

export interface LogCallPayload {
  attempt_id?: number;
  result: CallResult | string;
  duration_seconds?: number;
  disposition?: string;
  temperature?: string;
  notes?: string;
  called_at?: string;
  next_action?: {
    type: "follow_up" | "meeting" | string;
    due_at: string;
    notes?: string;
    meeting_type?: "in_person" | "online" | string;
    location?: string;
  };
}

export interface WorkspaceCall {
  id: number;
  lead?: number;
  result?: string;
  duration_seconds?: number;
  disposition?: string;
  temperature?: string;
  notes?: string;
  called_at?: string;
  created_at?: string;
  [key: string]: unknown;
}

export interface NextActionPayload {
  type: "follow_up" | "meeting" | string;
  due_at: string;
  notes?: string;
  meeting_type?: "in_person" | "online" | string;
  location?: string;
}

export interface WorkspaceAction {
  id: number;
  lead?: number;
  type?: string;
  due_at?: string;
  notes?: string;
  status?: string;
  outcome?: string;
  meeting?: { meeting_type?: string; location?: string } | null;
  is_overdue?: boolean;
  [key: string]: unknown;
}

export interface WorkspaceNote {
  id: number;
  lead?: number;
  author?: number;
  text?: string;
  created_at?: string;
  [key: string]: unknown;
}

export interface WorkspaceActivity {
  id: number;
  lead?: number;
  actor?: number;
  kind?: string;
  description?: string;
  details?: unknown;
  created_at?: string;
  [key: string]: unknown;
}

export interface WorkspaceEscalation {
  id: number;
  lead?: number;
  category?: string;
  explanation?: string;
  status?: string;
  created_at?: string;
  responses?: unknown[];
  [key: string]: unknown;
}

export interface PaginatedMeta {
  offset?: number;
  limit?: number;
  total?: number;
  search?: string;
  counts?: Record<string, number>;
}
