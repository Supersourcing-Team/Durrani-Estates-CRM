/**
 * Module 4 — Convertible Notes API methods.
 */
import { api } from "./axios";
import { apiEndpoints } from "./apiEndpoint";
import type { ApiResponse } from "./types";
import type {
  ApplicationListParams,
  BouncePayoutPayload,
  CnApplicationDetail,
  CnApplicationListItem,
  CnCalculatorResult,
  CnCommissionBatch,
  CnCommissionListParams,
  CnDocDecisionPayload,
  CnDocument,
  CnNoteDetail,
  CnNoteListItem,
  CnPayout,
  CommitCnPayload,
  CreateCnApplicationPayload,
  FixPayoutPayload,
  NoteListParams,
  PayPayoutPayload,
  PdcRegisterPayload,
  RenewNotePayload,
  SendBackPayload,
  UploadCnDocumentPayload,
} from "./convertibleNotes.types";

function cleanParams(params?: Record<string, unknown>): Record<string, string | number> {
  const out: Record<string, string | number> = {};
  if (!params) return out;
  for (const [k, v] of Object.entries(params)) {
    if (v == null || v === "" || v === "all") continue;
    out[k] = v as string | number;
  }
  return out;
}

export async function getCnCalculator(principal: string | number, start?: string) {
  const { data } = await api.get<ApiResponse<CnCalculatorResult>>(
    apiEndpoints.convertibleNotes.calculator,
    { params: cleanParams({ principal, start }) },
  );
  return data;
}

export async function listCnApplications(params?: ApplicationListParams) {
  const { data } = await api.get<ApiResponse<CnApplicationListItem[]>>(
    apiEndpoints.convertibleNotes.applications,
    { params: cleanParams(params as Record<string, unknown>) },
  );
  return {
    data: data.data || [],
    meta: data.meta || {},
    message: data.message || "",
  };
}

export async function createCnApplication(payload: CreateCnApplicationPayload) {
  const { data } = await api.post<ApiResponse<CnApplicationDetail>>(
    apiEndpoints.convertibleNotes.applications,
    payload,
  );
  return data;
}

export async function getCnApplication(id: string | number) {
  const { data } = await api.get<ApiResponse<CnApplicationDetail>>(
    apiEndpoints.convertibleNotes.applicationById(id),
  );
  return data;
}

export async function shareCnApplication(id: string | number) {
  const { data } = await api.post<ApiResponse<CnApplicationDetail>>(
    apiEndpoints.convertibleNotes.share(id),
    {},
  );
  return data;
}

export async function commitCnApplication(id: string | number, payload: CommitCnPayload) {
  const { data } = await api.post<ApiResponse<CnApplicationDetail>>(
    apiEndpoints.convertibleNotes.commit(id),
    payload,
  );
  return data;
}

export async function startCnDocuments(id: string | number) {
  const { data } = await api.post<ApiResponse<CnApplicationDetail>>(
    apiEndpoints.convertibleNotes.startDocuments(id),
    {},
  );
  return data;
}

export async function uploadCnDocument(
  id: string | number,
  category: string,
  payload: UploadCnDocumentPayload,
) {
  const { data } = await api.post<ApiResponse<CnDocument>>(
    apiEndpoints.convertibleNotes.document(id, category),
    payload,
  );
  return data;
}

export async function decideCnDocument(
  id: string | number,
  category: string,
  payload: CnDocDecisionPayload,
) {
  const { data } = await api.post<ApiResponse<CnDocument>>(
    apiEndpoints.convertibleNotes.documentDecision(id, category),
    payload,
  );
  return data;
}

export async function registerCnPdc(id: string | number, payload: PdcRegisterPayload) {
  const { data } = await api.post<ApiResponse<CnApplicationDetail>>(
    apiEndpoints.convertibleNotes.pdcRegister(id),
    payload,
  );
  return data;
}

export async function submitCnApplication(id: string | number) {
  const { data } = await api.post<ApiResponse<CnApplicationDetail>>(
    apiEndpoints.convertibleNotes.submit(id),
    {},
  );
  return data;
}

export async function sendBackCnApplication(id: string | number, payload: SendBackPayload) {
  const { data } = await api.post<ApiResponse<CnApplicationDetail>>(
    apiEndpoints.convertibleNotes.sendBack(id),
    payload,
  );
  return data;
}

export async function approveCnApplication(id: string | number) {
  const { data } = await api.post<ApiResponse<CnNoteDetail>>(
    apiEndpoints.convertibleNotes.approve(id),
    {},
  );
  return data;
}

export async function listCnNotes(params?: NoteListParams) {
  const { data } = await api.get<ApiResponse<CnNoteListItem[]>>(
    apiEndpoints.convertibleNotes.notes,
    { params: cleanParams(params as Record<string, unknown>) },
  );
  return {
    data: data.data || [],
    meta: data.meta || {},
    message: data.message || "",
  };
}

export async function getCnNote(id: string | number) {
  const { data } = await api.get<ApiResponse<CnNoteDetail>>(
    apiEndpoints.convertibleNotes.noteById(id),
  );
  return data;
}

export async function payCnPayout(
  noteId: string | number,
  installmentNo: string | number,
  payload: PayPayoutPayload,
) {
  const { data } = await api.post<ApiResponse<CnPayout>>(
    apiEndpoints.convertibleNotes.payoutPay(noteId, installmentNo),
    payload,
  );
  return data;
}

export async function bounceCnPayout(
  noteId: string | number,
  installmentNo: string | number,
  payload?: BouncePayoutPayload,
) {
  const { data } = await api.post<ApiResponse<CnPayout>>(
    apiEndpoints.convertibleNotes.payoutBounce(noteId, installmentNo),
    payload || {},
  );
  return data;
}

export async function fixCnPayout(
  noteId: string | number,
  installmentNo: string | number,
  payload: FixPayoutPayload,
) {
  const { data } = await api.post<ApiResponse<CnPayout>>(
    apiEndpoints.convertibleNotes.payoutFix(noteId, installmentNo),
    payload,
  );
  return data;
}

export async function repayCnPrincipal(noteId: string | number) {
  const { data } = await api.post<ApiResponse<CnNoteDetail>>(
    apiEndpoints.convertibleNotes.repayPrincipal(noteId),
    {},
  );
  return data;
}

export async function renewCnNote(noteId: string | number, payload?: RenewNotePayload) {
  const { data } = await api.post<ApiResponse<CnNoteDetail>>(
    apiEndpoints.convertibleNotes.renew(noteId),
    payload || {},
  );
  return data;
}

export async function listCnCommissions(params?: CnCommissionListParams) {
  const { data } = await api.get<ApiResponse<CnCommissionBatch[]>>(
    apiEndpoints.convertibleNotes.commissions,
    { params: cleanParams(params as Record<string, unknown>) },
  );
  return {
    data: data.data || [],
    meta: data.meta || {},
    message: data.message || "",
  };
}

export async function releaseCnCommission(id: string | number) {
  const { data } = await api.post<ApiResponse<CnCommissionBatch>>(
    apiEndpoints.convertibleNotes.commissionRelease(id),
    {},
  );
  return data;
}
