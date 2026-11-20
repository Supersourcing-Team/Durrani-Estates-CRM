/**
 * Map Module M04 Lead Pipeline API payloads → prototype UI lead shape
 * used by LeadTable / LeadScreen / engine helpers (leadById, leadRisk, nextOf).
 */
import { eng } from "../../engine";
import type { LeadDetail, LeadListItem, LeadQualification } from "../../http/leads.types";
import { rememberLeadSource } from "../../http/leadSources";

function parseMoney(v: string | number | null | undefined): number | "" {
  if (v == null || v === "") return "";
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : "";
}

function parseTs(iso: string | null | undefined): number | null {
  if (!iso) return null;
  const t = Date.parse(iso);
  return Number.isFinite(t) ? t : null;
}

function splitName(full: string): { first: string; last: string } {
  const parts = String(full || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (!parts.length) return { first: "", last: "" };
  if (parts.length === 1) return { first: parts[0], last: "" };
  return { first: parts[0], last: parts.slice(1).join(" ") };
}

function ensureApiOwner(owner: { id: number; name: string; email: string } | null | undefined): string | null {
  if (!owner) return null;
  const S = eng.S as any;
  const id = `apiu${owner.id}`;
  let u = S.users.find((x: any) => x.id === id || String(x.email || "").toLowerCase() === String(owner.email || "").toLowerCase());
  if (!u) {
    u = {
      id,
      name: owner.name,
      email: owner.email,
      role: "agent",
      emp: `USR-${owner.id}`,
      phone: "",
      status: "active",
      team: S.teams?.[0]?.id,
      cap: 30,
      slab: null,
    };
    S.users.push(u);
  }
  return u.id;
}

function mapQualification(q: LeadQualification | null | undefined, track: string | null) {
  if (!q) {
    return {
      qualified: false,
      property_sales: track === "property",
      convertible_notes: track === "cn",
      secondary_market: track === "secondary",
      qualNotes: "",
    };
  }
  return {
    qualified: true,
    property_sales: !!q.property_sales,
    convertible_notes: !!q.convertible_notes,
    secondary_market: !!q.secondary_market,
    qualNotes: q.qualification_notes || "",
    qualifiedAt: parseTs(q.qualified_at),
    qualifiedBy: q.qualified_by_name || "",
  };
}

function mapNext(iso: string | null | undefined) {
  const at = parseTs(iso);
  if (!at) return null;
  return { type: "Follow-up", at, done: false };
}

/** Build / merge a UI lead object from list or detail API payload. */
export function mapApiLeadToUi(api: LeadListItem | LeadDetail, prev?: any): any {
  const id = String(api.id);
  const customer = api.customer;
  const name = customer?.full_name || `${customer?.first_name || ""} ${customer?.last_name || ""}`.trim() || "Unknown";
  const sourceName =
    "source_name" in api && api.source_name
      ? api.source_name
      : (api as LeadDetail).lead_source?.name || prev?.src || "Direct";

  const detail = api as LeadDetail;
  rememberLeadSource(detail.lead_source);
  const qual = mapQualification(detail.qualification ?? null, api.track);
  const ownerId = ensureApiOwner(api.owner);
  const lastAct = parseTs(api.last_activity_at) || parseTs(api.created_at) || eng.NOW();
  const created = parseTs(api.created_at) || lastAct;

  // Make engine leadRisk reflect API status=risk without rewriting leadRisk itself.
  const S = eng.S as any;
  const X = S.set?.inactX ?? 7;
  const lastCommit =
    api.status === "risk" ? eng.NOW() - (X + 1) * 24 * 60 * 60 * 1000 : lastAct;

  const budgetMin = parseMoney(api.budget_min);
  const budgetMax = parseMoney(api.budget_max);
  const hasBudget = budgetMin !== "" || budgetMax !== "";

  const linked =
    Array.isArray(detail.linked_leads) && detail.linked_leads.length
      ? String(detail.linked_leads[0].related_lead_id)
      : prev?.linked || null;

  const base = {
    ...(prev || {}),
    id,
    lead_code: api.lead_code,
    name,
    phone: customer?.phone || prev?.phone || "",
    email: customer?.email || prev?.email || "",
    city: customer?.city || prev?.city || "",
    nationality: customer?.nationality || prev?.nationality || "",
    country: customer?.country || prev?.country || "United Arab Emirates",
    src: sourceName,
    camp: detail.campaign != null ? String(detail.campaign) : prev?.camp || sourceName,
    track: api.track || prev?.track || null,
    temp: api.temperature || prev?.temp || null,
    stage: api.stage || prev?.stage || "New",
    status: api.status,
    owner: ownerId,
    ownershipCycle: (api as any).ownership_cycle || prev?.ownershipCycle || null,
    assigned: parseTs((api as any).assigned_at) || prev?.assigned || created,
    lastCommit,
    created,
    budget: hasBudget ? [budgetMin || 0, budgetMax || budgetMin || 0] : prev?.budget || null,
    cur: api.budget_currency || prev?.cur || "AED",
    ptype: detail.property_type || prev?.ptype || null,
    timeline: detail.timeline || prev?.timeline || null,
    payment: detail.payment_method || prev?.payment || null,
    purpose: detail.purchase_purpose || prev?.purpose || null,
    visa: detail.visa_required == null ? prev?.visa ?? null : detail.visa_required ? "Interested" : "Not needed",
    arabic: detail.arabic_speaking ?? prev?.arabic ?? false,
    requirement: detail.requirement_summary || prev?.requirement || "",
    archived: !!api.is_archived,
    dnd: !!api.is_dnd,
    archReason: detail.archive_reason || prev?.archReason || "",
    dndReason: detail.dnd_reason || prev?.dndReason || "",
    next: mapNext(api.next_follow_up_at),
    linked,
    qualified: qual.qualified || !!prev?.qualified,
    property_sales: qual.property_sales,
    convertible_notes: qual.convertible_notes,
    secondary_market: qual.secondary_market,
    qualNotes: qual.qualNotes,
    // Keep activity collections if we already have them from prototype/local work.
    calls: prev?.calls || [],
    meets: prev?.meets || [],
    docs: prev?.docs || [],
    shortlist: prev?.shortlist || [],
    own: prev?.own || [],
    ev: prev?.ev || [],
    hold: prev?.hold || null,
    esc: prev?.esc || null,
    disp: api.is_dnd ? "DND" : api.is_archived ? "Archived" : prev?.disp || null,
    _api: true,
  };

  return base;
}

/** Insert or replace lead in eng.S.leads so leadById / detail screens work. */
export function upsertUiLead(api: LeadListItem | LeadDetail): any {
  const S = eng.S as any;
  const id = String(api.id);
  const idx = S.leads.findIndex((l: any) => String(l.id) === id || l.lead_code === (api as any).lead_code);
  const prev = idx >= 0 ? S.leads[idx] : null;
  const mapped = mapApiLeadToUi(api, prev);
  if (idx >= 0) S.leads[idx] = mapped;
  else S.leads.unshift(mapped);
  return mapped;
}

export function upsertUiLeads(items: Array<LeadListItem | LeadDetail>): any[] {
  return items.map((item) => upsertUiLead(item));
}

/** Split "Full Name" from Add Lead modal into first/last for create payload. */
export function splitFullName(full: string): { first_name: string; last_name: string } {
  const { first, last } = splitName(full);
  return { first_name: first || full.trim(), last_name: last };
}
