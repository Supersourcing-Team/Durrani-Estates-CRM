/** Module 4 — Convertible Notes API types */

export type CnAppStage =
  | "Qualified"
  | "Information shared"
  | "Interested"
  | "Documents"
  | "Admin review"
  | "Active";

export type CnDocCategory = "kyc" | "nominee" | "bank" | "agreement" | "pdc" | "receipt";
export type CnDocStatus = "uploaded" | "verified" | "rejected" | string;
export type CnNoteStatus = "active" | "closed" | string;
export type CnPayoutStatus = "upcoming" | "due" | "overdue" | "paid" | "bounced" | string;
export type CnPdcStatus = "held" | "cleared" | "bounced" | string;

export interface CnDocument {
  id?: number;
  category: CnDocCategory | string;
  file_name?: string;
  storage_key?: string;
  mime_type?: string;
  file_size?: number;
  status?: CnDocStatus;
  rejection_note?: string;
  uploaded_by?: number | null;
  decided_by?: number | null;
  decided_at?: string | null;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
}

export interface CnApplicationListItem {
  id: number;
  lead_id: number;
  agent?: number | null;
  team_id?: number | null;
  amount?: string | number | null;
  currency?: string;
  stage: CnAppStage | string;
  admin_state?: string;
  submitted_at?: string | null;
  note?: number | null;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
}

export interface CnApplicationDetail extends CnApplicationListItem {
  admin_note?: string;
  pdc_bank?: string;
  pdc_first_cheque?: string;
  pdc_count?: number | null;
  documents?: CnDocument[];
}

export interface CnPayout {
  id?: number;
  installment_no: number;
  due_date?: string;
  amount?: string | number;
  status?: CnPayoutStatus;
  payment_ref?: string;
  paid_at?: string | null;
  resolution_note?: string;
  [key: string]: unknown;
}

export interface CnPdcCheque {
  id?: number;
  installment_no: number;
  cheque_no?: string;
  bank?: string;
  due_date?: string;
  amount?: string | number;
  status?: CnPdcStatus;
  [key: string]: unknown;
}

export interface CnNoteListItem {
  id: number;
  note_code: string;
  client_code?: string;
  lead_id?: number;
  agent?: number | null;
  principal?: string | number;
  currency?: string;
  tenure?: number;
  rate?: string | number;
  start_date?: string;
  status?: CnNoteStatus;
  created_at?: string;
  [key: string]: unknown;
}

export interface CnNoteDetail extends CnNoteListItem {
  investor_name?: string;
  team_id?: number | null;
  frequency?: string;
  closed_at?: string | null;
  close_reason?: string;
  renewed_from_note?: number | null;
  admin_note?: string;
  monthly_payout?: string | number;
  payouts?: CnPayout[];
  pdc_cheques?: CnPdcCheque[];
  updated_at?: string;
}

export interface CnCommissionLine {
  id?: number;
  role?: string;
  beneficiary?: number;
  percent?: string | number;
  amount?: string | number;
  currency?: string;
  created_at?: string;
  [key: string]: unknown;
}

export interface CnCommissionBatch {
  id: number;
  note?: number;
  note_code?: string;
  principal?: string | number;
  currency?: string;
  status?: string;
  hierarchy_gap?: string;
  released_at?: string | null;
  released_by?: number | null;
  lines?: CnCommissionLine[];
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
}

export interface CnCalculatorResult {
  principal?: string | number;
  rate?: string | number;
  tenure?: number;
  monthly?: string | number;
  total_interest?: string | number;
  total_return?: string | number;
  rows?: Array<{ n: number; due?: string; amt?: string | number; cum?: string | number }>;
  currencies?: string[];
  org_terms?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface CreateCnApplicationPayload {
  lead_id: number;
  amount?: string | number;
  currency?: string;
}

export interface CommitCnPayload {
  amount: string | number;
  currency: string;
}

export interface UploadCnDocumentPayload {
  file_name: string;
  storage_key: string;
  mime_type?: string;
  file_size?: number;
}

export interface CnDocDecisionPayload {
  decision: "verify" | "reject";
  rejection_note?: string;
}

export interface PdcRegisterPayload {
  bank: string;
  first_cheque: string;
  count: number;
}

export interface SendBackPayload {
  note: string;
}

export interface PayPayoutPayload {
  payment_ref: string;
}

export interface BouncePayoutPayload {
  note?: string;
}

export interface FixPayoutPayload {
  payment_ref: string;
  how: string;
}

export interface RenewNotePayload {
  principal?: string | number;
  currency?: string;
}

export interface ApplicationListParams {
  stage?: string;
  lead_id?: string | number;
}

export interface NoteListParams {
  status?: string;
  lead_id?: string | number;
}

export interface CnCommissionListParams {
  note_id?: string | number;
}
