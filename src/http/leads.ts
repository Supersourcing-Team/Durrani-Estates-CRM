/**
 * Lead Pipeline API methods (Module M04).
 */
import { api } from "./axios";
import { apiEndpoints } from "./apiEndpoint";
import type { ApiResponse } from "./types";
import type {
  CreateLeadPayload,
  LeadDetail,
  LeadListItem,
  LeadListMeta,
  LeadListParams,
  QualifyLeadPayload,
  UpdateLeadPayload,
} from "./leads.types";

export type LeadListResult = {
  data: LeadListItem[];
  meta: LeadListMeta;
  message: string;
};

function cleanParams(params?: LeadListParams): Record<string, string | number> {
  const out: Record<string, string | number> = {};
  if (!params) return out;
  for (const [k, v] of Object.entries(params)) {
    if (v == null || v === "" || v === "all") continue;
    out[k] = v as string | number;
  }
  return out;
}

export async function listLeads(params?: LeadListParams): Promise<LeadListResult> {
  const { data } = await api.get<ApiResponse<LeadListItem[]>>(apiEndpoints.leads.list, {
    params: cleanParams(params),
  });
  return {
    data: data.data || [],
    meta: (data.meta as LeadListMeta) || {
      page: 1,
      per_page: 25,
      total: 0,
      total_pages: 0,
      counts: { all: 0, today: 0, overdue: 0, risk: 0, hot: 0, fresh: 0, archived: 0 },
    },
    message: data.message || "",
  };
}

export async function getLead(id: string | number) {
  const { data } = await api.get<ApiResponse<LeadDetail>>(apiEndpoints.leads.byId(id));
  return data;
}

export async function createLead(payload: CreateLeadPayload) {
  const { data } = await api.post<ApiResponse<LeadDetail>>(apiEndpoints.leads.list, payload);
  return data;
}

export async function updateLead(id: string | number, payload: UpdateLeadPayload) {
  const { data } = await api.patch<ApiResponse<Partial<LeadDetail>>>(
    apiEndpoints.leads.byId(id),
    payload,
  );
  return data;
}

export async function qualifyLead(id: string | number, payload: QualifyLeadPayload) {
  const { data } = await api.post<ApiResponse<Partial<LeadDetail>>>(
    apiEndpoints.leads.qualify(id),
    payload,
  );
  return data;
}

export async function archiveLead(id: string | number, reason: string) {
  const { data } = await api.post<ApiResponse<Partial<LeadDetail>>>(
    apiEndpoints.leads.archive(id),
    { reason },
  );
  return data;
}

export async function markLeadDnd(id: string | number, reason: string) {
  const { data } = await api.post<ApiResponse<Partial<LeadDetail>>>(
    apiEndpoints.leads.dnd(id),
    { reason },
  );
  return data;
}

export async function removeLeadDnd(id: string | number) {
  const { data } = await api.post<ApiResponse<Partial<LeadDetail>>>(
    apiEndpoints.leads.removeDnd(id),
    {},
  );
  return data;
}
