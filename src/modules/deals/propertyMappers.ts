/**
 * Map Module 3 Property Sales API → prototype eng.S shapes
 * (projects/units/bookings) used by existing catalogue & deal screens.
 */
import { eng } from "../../engine";
import type { CatalogueProject, CatalogueUnit, ShortlistItem } from "../../http/catalogue.types";
import type { BookingDetail, BookingDocument, BookingListItem, BookingMilestone } from "../../http/deals.types";
import type { CommissionDetail, CommissionListItem } from "../../http/commission.types";

function parseMoney(v: string | number | null | undefined): number {
  if (v == null || v === "") return 0;
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : 0;
}

function parseTs(iso: string | null | undefined): number | null {
  if (!iso) return null;
  const t = Date.parse(iso);
  return Number.isFinite(t) ? t : null;
}

function developerName(p: CatalogueProject): string {
  if (typeof p.developer === "string") return p.developer;
  if (p.developer && typeof p.developer === "object" && (p.developer as any).name) {
    return String((p.developer as any).name);
  }
  return p.developer_name || "Developer";
}

function developerCommission(p: CatalogueProject): number {
  const nested =
    p.developer && typeof p.developer === "object"
      ? parseMoney((p.developer as any).default_commission_percent)
      : 0;
  return parseMoney(p.commission_percent) || nested || 0;
}

function mapHandover(api: CatalogueProject, prev?: any): string {
  if (api.handover) return String(api.handover);
  if (api.handover_date) return String(api.handover_date);
  const q = String(api.handover_quarter || "").trim();
  const y = api.handover_year != null && api.handover_year !== "" ? String(api.handover_year) : "";
  if (q && y) return `${q} ${y}`;
  if (q) return q;
  if (y) return y;
  return prev?.ho || "";
}

function mapPaymentPlan(api: CatalogueProject, prev?: any): string {
  if (api.payment_plan) return String(api.payment_plan);
  const plans = api.payment_plans || api.plans || [];
  if (plans.length) {
    const first: any = plans[0];
    if (typeof first === "string") return first;
    return String(first.name || first.label || first.summary || first.title || "");
  }
  return prev?.plan || "";
}

function mapAmenities(api: CatalogueProject, prev?: any): string[] {
  const raw = api.amenities;
  if (Array.isArray(raw) && raw.length) {
    return raw
      .map((x) => (typeof x === "string" ? x : String((x as any)?.name || "").trim()))
      .filter(Boolean);
  }
  return Array.isArray(prev?.amen) ? prev.amen : [];
}

function cleanDesc(v: string | undefined | null, fallback = ""): string {
  const s = String(v || "").trim();
  if (!s || /^nan$/i.test(s)) return fallback;
  return s;
}

function unitNumber(u: CatalogueUnit): string {
  return String(u.unit_number || u.number || u.id);
}

export function mapApiUnitToUi(u: CatalogueUnit, prev?: any): any {
  const id = unitNumber(u);
  return {
    ...(prev || {}),
    id,
    apiId: u.id,
    type: u.type || u.unit_type || prev?.type || "Apartment",
    size: parseMoney(u.size_sqft ?? u.size) || prev?.size || 0,
    price: parseMoney(u.price) || prev?.price || 0,
    status: u.status || prev?.status || "Available",
    holdUntil: parseTs(u.hold_until as string) || prev?.holdUntil || null,
    holdBy: u.hold_by != null ? `apiu${u.hold_by}` : prev?.holdBy || null,
    bk: u.booking_id != null ? String(u.booking_id) : prev?.bk || null,
    _api: true,
  };
}

export function mapApiProjectToUi(api: CatalogueProject, prev?: any): any {
  const id = String(api.id);
  const unitsSrc = Array.isArray(api.units) ? api.units : prev?.units || [];
  const units = unitsSrc.map((u: any) => {
    if (u && typeof u === "object" && u._api === true) return u;
    if (u && typeof u === "object" && (u.unit_number != null || u.id != null)) {
      const prevU = (prev?.units || []).find(
        (x: any) => x.apiId === u.id || x.id === unitNumber(u),
      );
      return mapApiUnitToUi(u as CatalogueUnit, prevU);
    }
    return u;
  });

  const prices = units.map((u: any) => u.price).filter((n: number) => n > 0);
  const from =
    parseMoney(api.starting_price) ||
    parseMoney(api.price_from) ||
    (prices.length ? Math.min(...prices) : prev?.from || 0);
  const to =
    parseMoney(api.maximum_price) ||
    parseMoney(api.price_to) ||
    (prices.length ? Math.max(...prices) : prev?.to || from);

  const updatedAt = parseTs(api.updated_at) || parseTs(api.created_at) || eng.NOW();
  const amen = mapAmenities(api, prev);

  return {
    ...(prev || {}),
    id,
    apiId: api.id,
    name: api.name || prev?.name || "Project",
    dev: developerName(api),
    developerId:
      api.developer_id ||
      (typeof api.developer === "object" ? (api.developer as any)?.id : null) ||
      prev?.developerId ||
      null,
    city: api.city || prev?.city || "Dubai",
    country: api.country || prev?.country || "UAE",
    // UI cards/detail use `area` — API sends `community`
    area: api.community || api.area || prev?.area || "",
    subLocation: api.sub_location || prev?.subLocation || "",
    // UI uses `type` — API sends `property_type`
    type: api.property_type || api.type || prev?.type || "Apartment",
    status: api.status || prev?.status || "Active",
    ho: mapHandover(api, prev),
    plan: mapPaymentPlan(api, prev),
    paymentPlanId:
      api.payment_plan_id ||
      (api.payment_plans && (api.payment_plans[0] as any)?.id) ||
      prev?.paymentPlanId ||
      null,
    paymentPlans: api.payment_plans || api.plans || prev?.paymentPlans || [],
    comm: developerCommission(api) || prev?.comm || 4,
    relPct: parseMoney(api.release_threshold_percent) || prev?.relPct || 30,
    depositPct: parseMoney(api.booking_deposit_percent) || prev?.depositPct || 10,
    from,
    to,
    cur: api.base_currency || prev?.cur || "AED",
    rera: api.rera_project_number || api.rera || prev?.rera || "",
    desc: cleanDesc(api.description, prev?.desc || ""),
    amen,
    img: prev?.img || ((Number(api.id) % 5) + 1),
    pri: !!(api.priority ?? api.is_priority ?? prev?.pri),
    active: api.is_active ?? api.active ?? prev?.active ?? true,
    media: api.media || prev?.media || [],
    units,
    upd: ["system", updatedAt],
    _api: true,
  };
}

export function upsertUiProject(api: CatalogueProject): any {
  const S = eng.S as any;
  const id = String(api.id);
  const idx = S.projects.findIndex((p: any) => String(p.id) === id || p.apiId === api.id);
  const prev = idx >= 0 ? S.projects[idx] : null;
  const mapped = mapApiProjectToUi(api, prev);
  if (idx >= 0) S.projects[idx] = mapped;
  else S.projects.unshift(mapped);
  return mapped;
}

export function upsertUiProjects(items: CatalogueProject[]): any[] {
  return items.map(upsertUiProject);
}

function emptyDocs(): Record<string, any> {
  return {
    form: { s: "missing" },
    receipt: { s: "missing" },
    spa: { s: "missing" },
    dld: { s: "missing" },
    oqood: { s: "missing" },
  };
}

function mapDocs(docs: BookingDocument[] | undefined, prev?: any): Record<string, any> {
  const out = { ...emptyDocs(), ...(prev?.docs || {}) };
  for (const d of docs || []) {
    const cat = String(d.category || "");
    if (!cat) continue;
    out[cat] = {
      s: d.status === "uploaded" ? "uploaded" : d.status === "approved" ? "approved" : d.status === "rejected" ? "rejected" : d.status || "uploaded",
      name: d.file_name || out[cat]?.name || "",
      at: parseTs(d.uploaded_at) || out[cat]?.at || eng.NOW(),
      note: d.rejection_note || out[cat]?.note || "",
    };
  }
  return out;
}

function mapMiles(miles: BookingMilestone[] | undefined, prev?: any): any[] {
  if (!miles?.length) return prev?.miles || [];
  return miles.map((m) => ({
    id: m.id,
    name: m.name || "Milestone",
    pct: parseMoney(m.percent),
    amt: parseMoney(m.amount),
    paid: !!m.is_paid,
    paidAt: parseTs(m.paid_at as string) || null,
    paidAmt: parseMoney(m.paid_amount),
  }));
}

export function mapApiBookingToUi(api: BookingListItem | BookingDetail, prev?: any): any {
  const detail = api as BookingDetail;
  const code = api.booking_code || prev?.id || `BKG-${api.id}`;
  const docs = mapDocs(detail.documents, prev);
  const miles = mapMiles(detail.milestones, prev);
  const spaAt = detail.spa?.spa_issued_date ? parseTs(detail.spa.spa_issued_date) : prev?.spaIssued || null;

  return {
    ...(prev || {}),
    id: code,
    apiId: api.id,
    lead: String(api.lead_id),
    project: String(api.project_id),
    unit: api.unit_number || prev?.unit || String(api.unit_id),
    unitApiId: api.unit_id,
    status: api.status,
    price: parseMoney(api.final_price ?? api.base_price) || prev?.price || 0,
    listPrice: parseMoney(api.base_price) || prev?.listPrice || 0,
    cur: api.currency || prev?.cur || "AED",
    dep: parseMoney(detail.deposit_amount) || prev?.dep || 0,
    depAmt: parseMoney(detail.deposit_amount) || prev?.depAmt || prev?.dep || 0,
    mode: detail.deposit_mode || prev?.mode || "Bank transfer",
    depMode: detail.deposit_mode || prev?.depMode || prev?.mode || "Bank transfer",
    plan: prev?.plan || "",
    type: prev?.type || "",
    offer: detail.special_terms || prev?.offer || "",
    paidPct: parseMoney(api.paid_percentage) || prev?.paidPct || 0,
    holdUntil: parseTs(api.hold_until as string) || prev?.holdUntil || null,
    agent: api.agent_id != null ? `apiu${api.agent_id}` : prev?.agent || eng.me()?.id,
    agentName: api.agent_name || prev?.agentName || "",
    clientName: api.client_name || prev?.clientName || "",
    projectName: api.project_name || prev?.projectName || "",
    reason: detail.reason || prev?.reason || "",
    submitted: parseTs(api.submitted_at || api.created_at) || prev?.submitted || eng.NOW(),
    docs,
    miles: miles.map((m: any) => ({ ...m, n: m.name || m.n || "Milestone" })),
    spaIssued: spaAt,
    spaNumber: detail.spa?.spa_number || prev?.spaNumber || "",
    hist: prev?.hist || [],
    adj: prev?.adj || 0,
    adjNote: prev?.adjNote || "",
    devInv: prev?.devInv || null,
    devRec: prev?.devRec || null,
    incRel: prev?.incRel || null,
    commissionId: prev?.commissionId || null,
    _api: true,
  };
}

export function upsertUiBooking(api: BookingListItem | BookingDetail): any {
  const S = eng.S as any;
  const code = api.booking_code || `BKG-${api.id}`;
  const idx = S.bookings.findIndex(
    (b: any) => b.apiId === api.id || b.id === code || String(b.id) === String(api.id),
  );
  const prev = idx >= 0 ? S.bookings[idx] : null;
  const mapped = mapApiBookingToUi(api, prev);
  if (idx >= 0) S.bookings[idx] = mapped;
  else S.bookings.unshift(mapped);
  return mapped;
}

export function upsertUiBookings(items: Array<BookingListItem | BookingDetail>): any[] {
  return items.map(upsertUiBooking);
}

/** Apply shortlist rows onto a lead's shortlist array. */
export function applyShortlistToLead(leadId: string | number, items: ShortlistItem[]) {
  const l = eng.leadById(String(leadId));
  if (!l) return;
  l.shortlist = items.map((s) => ({
    p: String(s.project_id),
    unit: s.unit_id != null ? String(s.unit_id) : null,
    primary: !!s.is_primary,
    notes: s.notes || "",
    apiId: s.id,
  }));
  for (const s of items) {
    if (s.project) upsertUiProject(s.project as CatalogueProject);
  }
}

/**
 * Merge project-scoped shortlist rows into eng.S.leads so ProjPipeline can show them.
 * Creates a lightweight stub lead when the lead is not loaded yet.
 */
export function applyShortlistForProject(projectId: string | number, items: ShortlistItem[]) {
  const S = eng.S as any;
  const pid = String(projectId);
  for (const s of items || []) {
    if (String(s.project_id) !== pid && s.project_id != null) continue;
    const lid = String(s.lead_id);
    let l = eng.leadById(lid);
    if (!l) {
      const name =
        (s as any).lead_name ||
        (s as any).client_name ||
        (s as any).customer_name ||
        `Lead ${lid}`;
      l = {
        id: lid,
        name,
        phone: "",
        email: "",
        stage: "Shortlisted",
        owner: (s as any).agent_id != null ? `apiu${(s as any).agent_id}` : null,
        shortlist: [],
        archived: false,
        _api: true,
      };
      S.leads.unshift(l);
    }
    const entry = {
      p: pid,
      unit: s.unit_id != null ? String(s.unit_id) : null,
      primary: !!s.is_primary,
      notes: s.notes || "",
      apiId: s.id,
    };
    const idx = (l.shortlist || []).findIndex((x: any) => String(x.p) === pid);
    if (idx >= 0) l.shortlist[idx] = { ...l.shortlist[idx], ...entry };
    else {
      if (!l.shortlist) l.shortlist = [];
      l.shortlist.push(entry);
    }
    if (s.project) upsertUiProject(s.project as CatalogueProject);
  }
}

/** Milestone rows for PaymentModal — prefer API plan milestones, else heuristic planRows. */
export function paymentPlanRows(project: any, price: number): Array<{ n: string; pct: number; amt: number }> {
  const plans: any[] = Array.isArray(project?.paymentPlans) ? project.paymentPlans : [];
  const plan =
    plans.find((p) => p && (p.id === project?.paymentPlanId || String(p.name || p.label) === project?.plan)) ||
    plans[0];
  const raw: any[] =
    (plan && (plan.milestones || plan.installments || plan.rows || plan.schedule)) || [];
  if (Array.isArray(raw) && raw.length) {
    return raw.map((m) => {
      const pct = Number(m.percent ?? m.percentage ?? m.pct ?? 0) || 0;
      const amt = Number(m.amount);
      return {
        n: String(m.name || m.title || m.label || "Milestone"),
        pct,
        amt: Number.isFinite(amt) && amt > 0 ? amt : Math.round((price * pct) / 100),
      };
    });
  }
  return eng.planRows(price, project?.plan);
}

/** Store commission on matching booking for admin commission screens. */
export function applyCommissionToBooking(c: CommissionListItem | CommissionDetail) {
  const S = eng.S as any;
  const bookingId = c.booking_id;
  const code = c.booking_code;
  const b =
    S.bookings.find((x: any) => x.apiId === bookingId || x.id === code || x.commissionId === c.id) ||
    null;
  if (!b) {
    // Keep a lightweight stub so commission list can still navigate.
    const stub = {
      id: code || `BKG-${bookingId || c.id}`,
      apiId: bookingId,
      commissionId: c.id,
      status: "closed",
      price: parseMoney(c.sale_price),
      paidPct: parseMoney(c.paid_percentage),
      unit: c.unit_number || "",
      project: "0",
      projectName: c.project_name || "",
      agent: c.agent_id != null ? `apiu${c.agent_id}` : null,
      agentName: c.agent_name || "",
      submitted: eng.NOW(),
      docs: emptyDocs(),
      miles: [],
      hist: [],
      adj: parseMoney(c.adjustment_amount),
      adjNote: c.adjustment_note || "",
      devInv: parseTs(c.developer_invoiced_at as string),
      devRec: parseTs(c.developer_received_at as string),
      incRel: parseTs(c.released_at as string),
      _commStatus: c.status,
      _commInc: parseMoney(c.incentive_amount),
      _commChecklist: (c as CommissionDetail).checklist || [],
      _api: true,
    };
    S.bookings.unshift(stub);
    return stub;
  }
  b.commissionId = c.id;
  b.adj = parseMoney(c.adjustment_amount) || b.adj || 0;
  b.adjNote = c.adjustment_note || b.adjNote || "";
  b.devInv = parseTs(c.developer_invoiced_at as string) || b.devInv;
  b.devRec = parseTs(c.developer_received_at as string) || b.devRec;
  b.incRel = parseTs(c.released_at as string) || b.incRel;
  b.paidPct = parseMoney(c.paid_percentage) || b.paidPct;
  b._commStatus = c.status;
  b._commInc = parseMoney(c.incentive_amount);
  b._commChecklist = (c as CommissionDetail).checklist || [];
  return b;
}

export function resolveBookingApiId(bOrId: any): string | number {
  if (bOrId == null) return bOrId;
  if (typeof bOrId === "object") return bOrId.apiId || bOrId.id;
  const b = eng.bkById(String(bOrId));
  return b?.apiId || bOrId;
}

export function resolveProjectApiId(pOrId: any): string | number {
  if (pOrId == null) return pOrId;
  if (typeof pOrId === "object") return pOrId.apiId || pOrId.id;
  const p = eng.projById(String(pOrId));
  return p?.apiId || pOrId;
}

export function resolveUnitApiId(projectId: string, unitNumber: string): string | number {
  const p = eng.projById(projectId);
  const u = p?.units?.find((x: any) => x.id === unitNumber);
  return u?.apiId || unitNumber;
}
