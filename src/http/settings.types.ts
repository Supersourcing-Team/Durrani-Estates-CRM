/** Module 4 — Org settings API types */

export interface LeadRulesSettings {
  inact_x_days?: number;
  inact_y_days?: number;
  cap_default?: number;
  hold_hours?: number;
  hold_cap?: number;
}

export interface CnTermsSettings {
  tenure?: number;
  rate?: string | number;
  currencies?: string[];
  min_amount?: string | number | null;
  payout_frequency?: string;
}

export interface CnCommissionSettings {
  agent_percent?: string | number;
  team_lead_percent_default?: string | number;
  business_head_percent?: string | number;
}

export interface FxSettings {
  aed_to_inr?: string | number;
}

export interface OrgSettings {
  id?: number;
  lead_rules?: LeadRulesSettings;
  cn_terms?: CnTermsSettings;
  cn_commission?: CnCommissionSettings;
  fx?: FxSettings;
  updated_at?: string;
  [key: string]: unknown;
}

export type PatchCnTermsPayload = Partial<CnTermsSettings>;
export type PatchCnCommissionPayload = Partial<CnCommissionSettings>;
export type PatchFxPayload = Partial<FxSettings>;
