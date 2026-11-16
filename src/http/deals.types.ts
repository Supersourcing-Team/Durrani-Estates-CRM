/** Module 3 — Deals / Bookings API types */

export type BookingStatus =
  | "pending"
  | "changes"
  | "approved"
  | "rejected"
  | "expired"
  | "closed";

export type DocCategory = "form" | "receipt" | "spa" | "dld" | "oqood";
export type DocStatus = "uploaded" | "approved" | "rejected" | string;

export interface BookingDocument {
  category: DocCategory | string;
  status: DocStatus;
  file_name?: string;
  storage_key?: string;
  mime_type?: string;
  file_size?: number;
  rejection_note?: string;
  uploaded_at?: string;
  [key: string]: unknown;
}

export interface BookingMilestone {
  id: number;
  name?: string;
  percent?: string | number;
  amount?: string | number;
  paid_amount?: string | number;
  is_paid?: boolean;
  paid_at?: string | null;
  [key: string]: unknown;
}

export interface BookingSpa {
  status?: string;
  spa_number?: string;
  spa_issued_date?: string | null;
  [key: string]: unknown;
}

export interface BookingListItem {
  id: number;
  booking_code: string;
  lead_id: number;
  project_id: number;
  unit_id: number;
  unit_number?: string;
  status: BookingStatus | string;
  final_price?: string | number;
  base_price?: string | number;
  currency?: string;
  paid_percentage?: string | number;
  hold_until?: string | null;
  agent_id?: number | null;
  agent_name?: string;
  client_name?: string;
  project_name?: string;
  created_at?: string;
  submitted_at?: string;
  [key: string]: unknown;
}

export interface BookingDetail extends BookingListItem {
  payment_plan_id?: number | null;
  discount_amount?: string | number;
  deposit_amount?: string | number;
  deposit_mode?: string;
  special_terms?: string;
  reason?: string;
  documents?: BookingDocument[];
  milestones?: BookingMilestone[];
  spa?: BookingSpa | null;
  [key: string]: unknown;
}

export interface BookingListParams {
  status?: string;
  project_id?: string | number;
  page?: number;
  page_size?: number;
}

export interface CreateBookingPayload {
  lead_id: number;
  project_id: number;
  unit_id: number;
  payment_plan_id?: number | null;
  base_price?: string | number;
  discount_amount?: string | number;
  final_price?: string | number;
  currency?: string;
  deposit_amount?: string | number;
  deposit_mode?: string;
  special_terms?: string;
}

export interface UploadDocumentPayload {
  file_name: string;
  storage_key: string;
  mime_type?: string;
  file_size?: number;
}

export interface DocumentDecisionPayload {
  decision: "approved" | "rejected";
  rejection_note?: string;
}

export interface ReasonPayload {
  reason: string;
}

export interface SpaIssuedPayload {
  spa_issued_date: string;
  spa_number?: string;
}

export interface PaymentUpdatePayload {
  milestone_id: number;
  paid_amount?: string | number;
  is_paid?: boolean;
}
