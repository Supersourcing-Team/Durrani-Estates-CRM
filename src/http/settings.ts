/**
 * Module 4 — Org settings API methods.
 */
import { api } from "./axios";
import { apiEndpoints } from "./apiEndpoint";
import type { ApiResponse } from "./types";
import type {
  OrgSettings,
  PatchCnCommissionPayload,
  PatchCnTermsPayload,
  PatchFxPayload,
  CnCommissionSettings,
  CnTermsSettings,
  FxSettings,
} from "./settings.types";

export async function getSettings() {
  const { data } = await api.get<ApiResponse<OrgSettings>>(apiEndpoints.settings.root);
  return data;
}

export async function patchCnTerms(payload: PatchCnTermsPayload) {
  const { data } = await api.patch<ApiResponse<CnTermsSettings>>(
    apiEndpoints.settings.cn,
    payload,
  );
  return data;
}

export async function patchCnCommission(payload: PatchCnCommissionPayload) {
  const { data } = await api.patch<ApiResponse<CnCommissionSettings>>(
    apiEndpoints.settings.cnCommission,
    payload,
  );
  return data;
}

export async function patchFx(payload: PatchFxPayload) {
  const { data } = await api.patch<ApiResponse<FxSettings>>(apiEndpoints.settings.fx, payload);
  return data;
}
