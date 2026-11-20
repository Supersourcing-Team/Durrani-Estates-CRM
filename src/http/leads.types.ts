/** Module M04 — Lead Pipeline API types */

export type LeadStage =
  | "New"
  | "Contacted"
  | "Qualified"
  | "Meeting Fixed"
  | "Viewing"
  | "Negotiation"
  | "Booked"
  | "Archived";

export type LeadStatus = "active" | "risk" | "hold" | "archived" | "converted";
export type LeadTemperature = "hot" | "warm" | "cold";
export type LeadTrack = "property" | "cn" | "secondary";

export type LeadViewPill = "all" | "today" | "overdue" | "risk" | "hot" | "fresh" | "archived";
export type LeadSort = "prio" | "newest" | "oldest";

export interface LeadCustomer {
  id: number;
  customer_code: string;
  first_name: string;
  last_name: string;
  full_name: string;
  phone: string;
  phone_normalized: string;
  email: string;
  nationality: string;
  country: string;
  city: string;
  address: string;
  created_at: string;
}

export interface LeadOwner {
  id: number;
  name: string;
  email: string;
}

export interface LeadSourceRef {
  id: number;
  name: string;
  source_type: string;
}

export interface LeadQualification {
  property_sales: boolean;
  convertible_notes: boolean;
  secondary_market: boolean;
  qualification_notes: string;
  qualified_at: string | null;
  qualified_by_name: string | null;
}

export interface LinkedLead {
  related_lead_id: number;
  related_lead_code: string;
  customer_name: string;
  relationship_type: string;
  created_at: string;
}

export interface LeadListItem {
  id: number;
  lead_code: string;
  customer: LeadCustomer;
  source_name: string;
  track: LeadTrack | null;
  stage: LeadStage;
  status: LeadStatus;
  temperature: LeadTemperature | null;
  budget_min: string | null;
  budget_max: string | null;
  budget_currency: string;
  next_follow_up_at: string | null;
  last_activity_at: string | null;
  is_archived: boolean;
  is_dnd: boolean;
  owner: LeadOwner | null;
  ownership_cycle?: string | null;
  assigned_at?: string | null;
  disposition?: string | null;
  created_at: string;
}

export interface LeadDetail extends Omit<LeadListItem, "source_name"> {
  lead_source: LeadSourceRef | null;
  campaign: number | null;
  requirement_summary: string;
  property_type: string;
  timeline: string;
  payment_method: string;
  purchase_purpose: string;
  visa_required: boolean;
  arabic_speaking: boolean;
  archive_reason: string;
  dnd_reason: string;
  qualification: LeadQualification | null;
  linked_leads: LinkedLead[];
  updated_at: string;
}

export interface LeadListCounts {
  all: number;
  today: number;
  overdue: number;
  risk: number;
  hot: number;
  fresh: number;
  archived: number;
}

export interface LeadListMeta {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  counts: LeadListCounts;
}

export interface LeadListParams {
  lv?: LeadViewPill | string;
  lq?: string;
  lt?: LeadTrack | string;
  lk?: LeadTemperature | string;
  ls?: LeadSort | string;
  page?: number;
  page_size?: number;
}

export interface CreateLeadPayload {
  first_name: string;
  last_name?: string;
  phone: string;
  email?: string | null;
  city?: string;
  country?: string;
  lead_source_id?: number | null;
  track?: LeadTrack | string;
  temperature?: LeadTemperature | string;
  budget_min?: number | null;
  budget_max?: number | null;
  budget_currency?: string;
  requirement_summary?: string;
  property_type?: string;
  timeline?: string;
  payment_method?: string;
  purchase_purpose?: string;
}

/** PUT /v1/leads/{id}/profile/ : customer details (and the lead temperature). */
export interface UpdateLeadProfilePayload {
  first_name?: string;
  last_name?: string;
  phone?: string;
  email?: string | null;
  city?: string;
  country?: string;
  nationality?: string;
  temperature?: LeadTemperature | string;
}

/** PUT /v1/leads/{id}/qualification/ */
export interface UpdateLeadQualificationPayload {
  track: LeadTrack | string;
  budget_min?: number | null;
  budget_max?: number | null;
  budget_currency?: string;
  property_type?: string;
  timeline?: string;
  payment_method?: string;
  purchase_purpose?: string;
  visa_required?: boolean;
  notes?: string;
}
