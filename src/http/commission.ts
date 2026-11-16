/**
 * Module 3 — Commission API methods.
 */
import { api } from "./axios";
import { apiEndpoints } from "./apiEndpoint";
import type { ApiResponse } from "./types";
import type {
  AdjustCommissionPayload,
  CommissionDetail,
  CommissionListItem,
  CommissionListParams,
  CommissionSlabPlan,
  UpsertSlabsPayload,
} from "./commission.types";

function cleanParams(params?: CommissionListParams): Record<string, string | number> {
  const out: Record<string, string | number> = {};
  if (!params) return out;
  for (const [k, v] of Object.entries(params)) {
    if (v == null || v === "" || v === "all") continue;
    out[k] = v as string | number;
  }
  return out;
}

export async function listCommissions(params?: CommissionListParams) {
  const { data } = await api.get<ApiResponse<CommissionListItem[]>>(apiEndpoints.commission.list, {
    params: cleanParams(params),
  });
  return {
    data: data.data || [],
    meta: data.meta || {},
    message: data.message || "",
  };
}

export async function getCommission(id: string | number) {
  const { data } = await api.get<ApiResponse<CommissionDetail>>(apiEndpoints.commission.byId(id));
  return data;
}

export async function markDeveloperInvoiced(id: string | number) {
  const { data } = await api.post<ApiResponse<CommissionDetail>>(
    apiEndpoints.commission.developerInvoiced(id),
    {},
  );
  return data;
}

export async function markDeveloperReceived(id: string | number) {
  const { data } = await api.post<ApiResponse<CommissionDetail>>(
    apiEndpoints.commission.developerReceived(id),
    {},
  );
  return data;
}

export async function releaseCommission(id: string | number) {
  const { data } = await api.post<ApiResponse<CommissionDetail>>(
    apiEndpoints.commission.release(id),
    {},
  );
  return data;
}

export async function adjustCommission(id: string | number, payload: AdjustCommissionPayload) {
  const { data } = await api.post<ApiResponse<CommissionDetail>>(
    apiEndpoints.commission.adjust(id),
    payload,
  );
  return data;
}

export async function listSlabs(agentId?: string | number) {
  const { data } = await api.get<ApiResponse<CommissionSlabPlan[]>>(apiEndpoints.commission.slabs, {
    params: agentId != null ? { agent_id: agentId } : undefined,
  });
  return data;
}

export async function upsertSlabs(payload: UpsertSlabsPayload) {
  const { data } = await api.post<ApiResponse<CommissionSlabPlan>>(
    apiEndpoints.commission.slabs,
    payload,
  );
  return data;
}
