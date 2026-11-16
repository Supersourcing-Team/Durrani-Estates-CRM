/** Module 3 — Commission API types */

export type CommissionStatus = "pending" | "eligible" | "released" | "blocked" | string;

export interface CommissionChecklistItem {
  code: string;
  passed: boolean;
  detail?: string;
}

export interface CommissionListItem {
  id: number;
  booking_id?: number;
  booking_code?: string;
  status: CommissionStatus;
  agent_id?: number;
  agent_name?: string;
  project_name?: string;
  unit_number?: string;
  sale_price?: string | number;
  incentive_amount?: string | number;
  developer_invoiced_at?: string | null;
  developer_received_at?: string | null;
  released_at?: string | null;
  adjustment_amount?: string | number;
  adjustment_note?: string;
  paid_percentage?: string | number;
  [key: string]: unknown;
}

export interface CommissionDetail extends CommissionListItem {
  checklist?: CommissionChecklistItem[];
  release_threshold_percent?: number | string;
  [key: string]: unknown;
}

export interface CommissionListParams {
  status?: string;
  page?: number;
  page_size?: number;
}

export interface AdjustCommissionPayload {
  adjustment_amount: string | number;
  adjustment_note: string;
}

export interface CommissionSlabTier {
  tier_order: number;
  min_target: string | number;
  max_target?: string | number | null;
  incentive_percent: string | number;
}

export interface CommissionSlabPlan {
  id?: number;
  agent_id: number;
  plan_name: string;
  tiers: CommissionSlabTier[];
  [key: string]: unknown;
}

export interface UpsertSlabsPayload {
  agent_id: number;
  plan_name: string;
  tiers: CommissionSlabTier[];
}
