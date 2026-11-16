/** Module 3 — Catalogue API types */

export type UnitStatus = "Available" | "Held" | "Booked" | "Sold";
export type AvailRequestStatus = "pending" | "confirmed" | "rejected";

export interface Developer {
  id: number;
  name: string;
  [key: string]: unknown;
}

export interface CatalogueUnit {
  id: number;
  unit_number?: string;
  number?: string;
  type?: string;
  unit_type?: string;
  size?: number | string;
  size_sqft?: number | string;
  price?: string | number;
  status: UnitStatus | string;
  hold_until?: string | null;
  hold_by?: number | null;
  booking_id?: number | null;
  [key: string]: unknown;
}

export interface CataloguePlanMilestone {
  id?: number;
  name?: string;
  title?: string;
  percent?: string | number;
  percentage?: string | number;
  amount?: string | number;
  [key: string]: unknown;
}

export interface CataloguePaymentPlan {
  id?: number;
  name?: string;
  label?: string;
  summary?: string;
  title?: string;
  milestones?: CataloguePlanMilestone[];
  installments?: CataloguePlanMilestone[];
  rows?: CataloguePlanMilestone[];
  [key: string]: unknown;
}

export interface UpdateUnitPayload {
  unit_number?: string;
  unit_type?: string;
  size_sqft?: number;
  price?: number;
  status?: string;
  [key: string]: unknown;
}

export interface CatalogueProject {
  id: number;
  name: string;
  developer?: Developer | string | null;
  developer_id?: number | null;
  developer_name?: string;
  city?: string;
  country?: string;
  /** API field — maps to UI `area` */
  community?: string;
  area?: string;
  sub_location?: string;
  /** API field — maps to UI `type` */
  property_type?: string;
  type?: string;
  status?: string;
  construction_progress?: string | number;
  handover_quarter?: string;
  handover_year?: number | string | null;
  handover?: string;
  handover_date?: string;
  marketing_status?: string;
  payment_plan?: string;
  payment_plan_id?: number | null;
  payment_plans?: CataloguePaymentPlan[];
  commission_percent?: number | string;
  release_threshold_percent?: number | string;
  booking_deposit_percent?: string | number;
  base_currency?: string;
  starting_price?: string | number;
  maximum_price?: string | number;
  price_from?: string | number;
  price_to?: string | number;
  rera_project_number?: string;
  rera?: string;
  escrow_bank?: string;
  oqood_eligible?: boolean;
  advertising_permit?: string;
  dld_fee_treatment?: string;
  post_handover_available?: boolean;
  description?: string;
  amenities?: string[] | Array<{ name?: string }>;
  priority?: boolean;
  is_priority?: boolean;
  active?: boolean;
  is_active?: boolean;
  units?: CatalogueUnit[];
  plans?: CataloguePaymentPlan[];
  media?: unknown[];
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
}

export interface ProjectListParams {
  q?: string;
  city?: string;
  type?: string;
  priority?: boolean | string;
  page?: number;
  page_size?: number;
}

export interface CreateDeveloperPayload {
  name: string;
  [key: string]: unknown;
}

export interface CreateProjectPayload {
  name: string;
  /** Developer PK — required by API */
  developer: number;
  /** Community / area name — required by API */
  community: string;
  city?: string;
  area?: string;
  type?: string;
  status?: string;
  handover?: string;
  payment_plan?: string;
  commission_percent?: number;
  release_threshold_percent?: number;
  rera?: string;
  description?: string;
  amenities?: string[];
  priority?: boolean;
  active?: boolean;
  [key: string]: unknown;
}

export interface CreateUnitPayload {
  unit_number: string;
  /** Required by API */
  unit_type: string;
  /** Required by API */
  size_sqft: number;
  price?: number;
  status?: string;
  [key: string]: unknown;
}

export interface ShortlistItem {
  id: number;
  lead_id: number;
  project_id: number;
  unit_id?: number | null;
  is_primary?: boolean;
  notes?: string;
  project?: CatalogueProject;
  [key: string]: unknown;
}

export interface CreateShortlistPayload {
  lead_id: number;
  project_id: number;
  unit_id?: number | null;
  is_primary?: boolean;
  notes?: string;
}

export interface AvailabilityRequest {
  id: number;
  lead_id?: number | null;
  project_id: number;
  unit_id: number;
  status: AvailRequestStatus | string;
  notes?: string;
  decision_notes?: string;
  created_at?: string;
  [key: string]: unknown;
}

export interface CreateAvailabilityPayload {
  lead_id?: number | null;
  project_id: number;
  unit_id: number;
  notes?: string;
}

export interface AvailabilityDecisionPayload {
  status: "confirmed" | "rejected";
  notes?: string;
}
