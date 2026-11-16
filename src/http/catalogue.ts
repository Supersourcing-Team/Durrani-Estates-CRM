/**
 * Module 3 — Catalogue API methods.
 */
import { api } from "./axios";
import { apiEndpoints } from "./apiEndpoint";
import type { ApiResponse } from "./types";
import type {
  AvailabilityDecisionPayload,
  AvailabilityRequest,
  CatalogueProject,
  CatalogueUnit,
  CreateAvailabilityPayload,
  CreateDeveloperPayload,
  CreateProjectPayload,
  CreateShortlistPayload,
  CreateUnitPayload,
  Developer,
  ProjectListParams,
  ShortlistItem,
  UpdateUnitPayload,
} from "./catalogue.types";

function cleanParams(params?: Record<string, unknown>): Record<string, string | number | boolean> {
  const out: Record<string, string | number | boolean> = {};
  if (!params) return out;
  for (const [k, v] of Object.entries(params)) {
    if (v == null || v === "" || v === "all") continue;
    out[k] = v as string | number | boolean;
  }
  return out;
}

export async function listDevelopers() {
  const { data } = await api.get<ApiResponse<Developer[]>>(apiEndpoints.catalogue.developers);
  return data;
}

export async function createDeveloper(payload: CreateDeveloperPayload) {
  const { data } = await api.post<ApiResponse<Developer>>(apiEndpoints.catalogue.developers, payload);
  return data;
}

export async function listProjects(params?: ProjectListParams) {
  const { data } = await api.get<ApiResponse<CatalogueProject[]>>(apiEndpoints.catalogue.projects, {
    params: cleanParams(params as Record<string, unknown>),
  });
  return {
    data: data.data || [],
    meta: data.meta || {},
    message: data.message || "",
  };
}

export async function getProject(id: string | number) {
  const { data } = await api.get<ApiResponse<CatalogueProject>>(apiEndpoints.catalogue.projectById(id));
  return data;
}

export async function createProject(payload: CreateProjectPayload) {
  const { data } = await api.post<ApiResponse<CatalogueProject>>(
    apiEndpoints.catalogue.projects,
    payload,
  );
  return data;
}

export async function updateProject(id: string | number, payload: Partial<CreateProjectPayload>) {
  const { data } = await api.patch<ApiResponse<CatalogueProject>>(
    apiEndpoints.catalogue.projectById(id),
    payload,
  );
  return data;
}

export async function listProjectUnits(
  projectId: string | number,
  params?: { status?: string; type?: string },
) {
  const { data } = await api.get<ApiResponse<CatalogueUnit[]>>(
    apiEndpoints.catalogue.projectUnits(projectId),
    { params: cleanParams(params) },
  );
  return data;
}

export async function createUnit(projectId: string | number, payload: CreateUnitPayload) {
  const { data } = await api.post<ApiResponse<CatalogueUnit>>(
    apiEndpoints.catalogue.projectUnits(projectId),
    payload,
  );
  return data;
}

export async function updateUnit(unitId: string | number, payload: UpdateUnitPayload) {
  const { data } = await api.patch<ApiResponse<CatalogueUnit>>(
    apiEndpoints.catalogue.unitById(unitId),
    payload,
  );
  return data;
}

export async function releaseUnitHold(unitId: string | number) {
  const { data } = await api.post<ApiResponse<CatalogueUnit>>(
    apiEndpoints.catalogue.releaseHold(unitId),
    {},
  );
  return data;
}

/** Module 3: `lead_id` is required — no project-scoped shortlist filter. */
export async function listShortlist(params: { lead_id: string | number }) {
  const { data } = await api.get<ApiResponse<ShortlistItem[]>>(apiEndpoints.catalogue.shortlist, {
    params: { lead_id: params.lead_id },
  });
  return data;
}

export async function createShortlist(payload: CreateShortlistPayload) {
  const { data } = await api.post<ApiResponse<ShortlistItem>>(
    apiEndpoints.catalogue.shortlist,
    payload,
  );
  return data;
}

export async function listAvailabilityRequests(params?: { status?: string }) {
  const { data } = await api.get<ApiResponse<AvailabilityRequest[]>>(
    apiEndpoints.catalogue.availabilityRequests,
    { params: cleanParams(params) },
  );
  return data;
}

export async function createAvailabilityRequest(payload: CreateAvailabilityPayload) {
  const { data } = await api.post<ApiResponse<AvailabilityRequest>>(
    apiEndpoints.catalogue.availabilityRequests,
    payload,
  );
  return data;
}

export async function decideAvailabilityRequest(
  id: string | number,
  payload: AvailabilityDecisionPayload,
) {
  const { data } = await api.post<ApiResponse<AvailabilityRequest>>(
    apiEndpoints.catalogue.availabilityDecision(id),
    payload,
  );
  return data;
}
