import { api } from "./axios";
import { apiEndpoints } from "./apiEndpoint";
import { workspaceMutationHeaders } from "./mutationHeaders";
import type { ApiResponse } from "./types";

export interface RuleHold {
  id: number;
  lead?: number;
  reason?: string;
  placed_by?: number;
  created_at?: string;
  released_at?: string | null;
  released_by?: number | null;
  release_reason?: string | null;
  ownership_cycle?: string;
  [key: string]: unknown;
}

export interface LeadRuleStatus {
  lead_id?: number;
  ownership_cycle?: string;
  state?: string;
  recorded_state?: string;
  anchor_at?: string | null;
  last_commitment_at?: string | null;
  risk_at?: string | null;
  return_at?: string | null;
  rule?: unknown;
  evaluated_at?: string | null;
  hold?: RuleHold | null;
  [key: string]: unknown;
}

export interface RuleHistoryItem {
  id?: number;
  kind?: string;
  details?: unknown;
  created_at?: string;
  [key: string]: unknown;
}

function asList<T>(data: unknown): T[] {
  if (Array.isArray(data)) return data as T[];
  if (data && typeof data === "object") {
    const o = data as Record<string, unknown>;
    if (Array.isArray(o.results)) return o.results as T[];
    if (Array.isArray(o.items)) return o.items as T[];
  }
  return [];
}

export async function getLeadRuleStatus(leadId: string | number) {
  const { data } = await api.get<ApiResponse<LeadRuleStatus>>(
    apiEndpoints.rulesEngine.status(leadId),
  );
  return data.data;
}

export async function getLeadRuleHistory(
  leadId: string | number,
  params?: { limit?: number; offset?: number },
) {
  const { data } = await api.get<ApiResponse<RuleHistoryItem[]>>(
    apiEndpoints.rulesEngine.history(leadId),
    { params },
  );
  return { items: asList<RuleHistoryItem>(data.data), raw: data };
}

export async function createHold(
  leadId: string | number,
  reason: string,
  ownershipCycle: string | null | undefined,
) {
  const { data } = await api.post<ApiResponse<RuleHold>>(
    apiEndpoints.rulesEngine.holds(leadId),
    { reason },
    { headers: workspaceMutationHeaders(ownershipCycle) },
  );
  return data.data;
}

export async function releaseHold(
  leadId: string | number,
  holdId: string | number,
  reason: string,
  ownershipCycle: string | null | undefined,
) {
  const { data } = await api.post<ApiResponse<RuleHold>>(
    apiEndpoints.rulesEngine.releaseHold(leadId, holdId),
    { reason },
    { headers: workspaceMutationHeaders(ownershipCycle) },
  );
  return data.data;
}
