/**
 * Map Module 4 Convertible Notes + settings API → prototype eng.S shapes.
 */
import { eng } from "../../engine";
import type {
  CnApplicationDetail,
  CnApplicationListItem,
  CnCalculatorResult,
  CnDocument,
  CnNoteDetail,
  CnNoteListItem,
  CnPayout,
  CnPdcCheque,
} from "../../http/convertibleNotes.types";
import type { OrgSettings } from "../../http/settings.types";

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

/** Apply GET /v1/settings/ into eng.S.set */
export function applyOrgSettings(api: OrgSettings) {
  const S = eng.S as any;
  const set = S.set || (S.set = {});
  const lr = api.lead_rules || {};
  if (lr.inact_x_days != null) set.inactX = lr.inact_x_days;
  if (lr.inact_y_days != null) set.inactY = lr.inact_y_days;
  if (lr.cap_default != null) set.capDefault = lr.cap_default;
  if (lr.hold_hours != null) set.holdHours = lr.hold_hours;
  if (lr.hold_cap != null) set.holdCap = lr.hold_cap;

  const cn = api.cn_terms || {};
  set.cn = {
    ...(set.cn || {}),
    tenure: cn.tenure != null ? Number(cn.tenure) : set.cn?.tenure || 36,
    rate: cn.rate != null ? Number(cn.rate) : set.cn?.rate || 1.5,
    cur: Array.isArray(cn.currencies) && cn.currencies.length ? cn.currencies : set.cn?.cur || ["INR", "AED"],
    min: cn.min_amount != null ? parseMoney(cn.min_amount) : set.cn?.min ?? null,
    freq: cn.payout_frequency || set.cn?.freq || "monthly",
  };

  const cc = api.cn_commission || {};
  set.cnCommission = {
    agent: cc.agent_percent != null ? Number(cc.agent_percent) : set.cnCommission?.agent || 5,
    teamLead:
      cc.team_lead_percent_default != null
        ? Number(cc.team_lead_percent_default)
        : set.cnCommission?.teamLead || 1,
    businessHead:
      cc.business_head_percent != null
        ? Number(cc.business_head_percent)
        : set.cnCommission?.businessHead || 1,
  };

  if (api.fx?.aed_to_inr != null) set.fx = Number(api.fx.aed_to_inr);
}

function mapDocStatus(apiStatus?: string): "verified" | "rejected" | "pending" {
  if (apiStatus === "verified") return "verified";
  if (apiStatus === "rejected") return "rejected";
  return "pending";
}

/** Merge application documents into lead.cn doc keys + dv. */
function applyDocuments(cn: any, docs: CnDocument[] | undefined) {
  const dv = { ...(cn.dv || {}) };
  for (const d of docs || []) {
    const cat = String(d.category || "");
    if (!cat) continue;
    cn[cat] = d.file_name || cn[cat] || true;
    const st = mapDocStatus(d.status);
    if (st === "verified" || st === "rejected") {
      dv[cat] = {
        s: st,
        by: d.decided_by != null ? `apiu${d.decided_by}` : dv[cat]?.by,
        at: parseTs(d.decided_at as string) || dv[cat]?.at || eng.NOW(),
        why: d.rejection_note || dv[cat]?.why || "",
      };
    } else if (dv[cat]?.s === "rejected" || dv[cat]?.s === "verified") {
      // keep prior decision until API says otherwise
    } else {
      delete dv[cat];
    }
  }
  cn.dv = Object.keys(dv).length ? dv : cn.dv;
  if (cn.pdc_bank || cn.pdcBank) {
    cn.pdc = `${cn.pdc_bank || cn.pdcBank}${cn.pdc_first_cheque || cn.pdcFirst ? " from " + (cn.pdc_first_cheque || cn.pdcFirst) : ""}`;
  }
}

export function mapApiApplicationToLeadCn(
  api: CnApplicationListItem | CnApplicationDetail,
  prev?: any,
): any {
  const detail = api as CnApplicationDetail;
  const adminState =
    api.admin_state ||
    (api.stage === "Admin review" ? "pending" : api.stage === "Documents" && detail.admin_note ? "changes" : "") ||
    prev?.adminState ||
    "";

  const cn: any = {
    ...(prev || {}),
    apiId: api.id,
    stage: api.stage || prev?.stage || "Qualified",
    amount: parseMoney(api.amount) || prev?.amount || 0,
    cur: api.currency || prev?.cur || "AED",
    tenure: prev?.tenure || eng.S.set?.cn?.tenure || 36,
    freq: prev?.freq || "Monthly",
    adminState,
    adminNote: detail.admin_note || prev?.adminNote || "",
    submitted: parseTs(api.submitted_at) || prev?.submitted || null,
    noteId: api.note != null ? String(api.note) : prev?.noteId || null,
    noteApiId: api.note ?? prev?.noteApiId ?? null,
    pdcBank: detail.pdc_bank || prev?.pdcBank || "",
    pdcFirst: detail.pdc_first_cheque || prev?.pdcFirst || "",
    pdcCount: detail.pdc_count ?? prev?.pdcCount ?? null,
    _api: true,
  };

  if (detail.pdc_bank) {
    cn.pdc = `${detail.pdc_bank} from ${detail.pdc_first_cheque || ""}`.trim();
  }

  applyDocuments(cn, detail.documents);
  return cn;
}

/** Attach / update application on the matching lead. */
export function upsertCnApplication(api: CnApplicationListItem | CnApplicationDetail) {
  const S = eng.S as any;
  const leadId = String(api.lead_id);
  let l = eng.leadById(leadId);
  if (!l) {
    l = {
      id: leadId,
      name: (api as any).client_name || (api as any).lead_name || `Lead ${leadId}`,
      phone: "",
      email: "",
      track: "cn",
      stage: "Qualified",
      owner: api.agent != null ? `apiu${api.agent}` : null,
      shortlist: [],
      archived: false,
      cn: null,
      _api: true,
    };
    S.leads.unshift(l);
  }
  l.track = l.track || "cn";
  l.cn = mapApiApplicationToLeadCn(api, l.cn);
  return l;
}

export function upsertCnApplications(items: Array<CnApplicationListItem | CnApplicationDetail>) {
  return items.map(upsertCnApplication);
}

function mapPayouts(payouts: CnPayout[] | undefined, prev?: any[]): any[] {
  if (!payouts?.length) return prev || [];
  return payouts.map((p) => ({
    id: p.id,
    n: p.installment_no,
    due: parseTs(p.due_date) || eng.NOW(),
    amt: parseMoney(p.amount),
    status: p.status || "upcoming",
    ref: p.payment_ref || null,
    at: parseTs(p.paid_at as string) || null,
    resolutionNote: p.resolution_note || "",
  }));
}

function mapPdc(cheques: CnPdcCheque[] | undefined, prev?: any[]): any[] {
  if (!cheques?.length) return prev || [];
  return cheques.map((c) => ({
    id: c.id,
    n: c.installment_no,
    no: c.cheque_no || `PDC-${c.installment_no}`,
    bank: c.bank || "",
    due: parseTs(c.due_date) || eng.NOW(),
    amt: parseMoney(c.amount),
    status: c.status || "held",
  }));
}

export function mapApiNoteToUi(api: CnNoteListItem | CnNoteDetail, prev?: any): any {
  const detail = api as CnNoteDetail;
  const code = api.note_code || prev?.id || `CN-${api.id}`;
  return {
    ...(prev || {}),
    id: code,
    apiId: api.id,
    client: api.client_code || prev?.client || "",
    lead: api.lead_id != null ? String(api.lead_id) : prev?.lead || null,
    name: detail.investor_name || prev?.name || "",
    agent: api.agent != null ? `apiu${api.agent}` : prev?.agent || null,
    principal: parseMoney(api.principal) || prev?.principal || 0,
    cur: api.currency || prev?.cur || "AED",
    tenure: api.tenure ?? prev?.tenure ?? eng.S.set?.cn?.tenure ?? 36,
    rate: parseMoney(api.rate) || prev?.rate || eng.S.set?.cn?.rate || 1.5,
    freq: detail.frequency || prev?.freq || "Monthly",
    start: parseTs(api.start_date) || prev?.start || eng.NOW(),
    status: api.status || prev?.status || "active",
    closedAt: parseTs(detail.closed_at as string) || prev?.closedAt || null,
    closeReason: detail.close_reason || prev?.closeReason || "",
    adminNote: detail.admin_note || prev?.adminNote || "",
    monthly: parseMoney(detail.monthly_payout) || prev?.monthly || 0,
    payouts: mapPayouts(detail.payouts, prev?.payouts),
    pdc: mapPdc(detail.pdc_cheques, prev?.pdc),
    renewedFrom: detail.renewed_from_note ?? prev?.renewedFrom ?? null,
    _api: true,
  };
}

export function upsertCnNote(api: CnNoteListItem | CnNoteDetail) {
  const S = eng.S as any;
  const code = api.note_code || `CN-${api.id}`;
  const idx = S.notes.findIndex(
    (n: any) => n.apiId === api.id || n.id === code || String(n.id) === String(api.id),
  );
  const prev = idx >= 0 ? S.notes[idx] : null;
  const mapped = mapApiNoteToUi(api, prev);
  if (idx >= 0) S.notes[idx] = mapped;
  else S.notes.unshift(mapped);

  // Keep lead.cn linked when note activates
  if (mapped.lead) {
    const l = eng.leadById(mapped.lead);
    if (l?.cn) {
      l.cn.stage = "Active";
      l.cn.adminState = "approved";
      l.cn.noteId = mapped.id;
      l.cn.noteApiId = mapped.apiId;
    }
  }
  return mapped;
}

export function upsertCnNotes(items: Array<CnNoteListItem | CnNoteDetail>) {
  return items.map(upsertCnNote);
}

export function resolveCnAppApiId(leadOrId: any): string | number | null {
  if (leadOrId == null) return null;
  if (typeof leadOrId === "object") return leadOrId.cn?.apiId || null;
  const l = eng.leadById(String(leadOrId));
  return l?.cn?.apiId || null;
}

export function resolveCnNoteApiId(noteOrId: any): string | number {
  if (noteOrId == null) return noteOrId;
  if (typeof noteOrId === "object") return noteOrId.apiId || noteOrId.id;
  const n = eng.noteById?.(String(noteOrId)) || (eng.S as any).notes?.find(
    (x: any) => x.id === noteOrId || String(x.apiId) === String(noteOrId),
  );
  return n?.apiId || noteOrId;
}

/** Map calculator API → shape used by CnCalc (m, rows, total, ret, n). */
export function mapCalculatorResult(api: CnCalculatorResult, fallbackPrincipal: number) {
  const principal = parseMoney(api.principal) || fallbackPrincipal;
  const monthly = parseMoney(api.monthly);
  const total = parseMoney(api.total_interest) || monthly * (api.tenure || 0);
  const ret = parseMoney(api.total_return) || principal + total;
  const rows = (api.rows || []).map((r) => ({
    n: r.n,
    due: parseTs(r.due) || eng.NOW(),
    amt: parseMoney(r.amt),
    cum: parseMoney(r.cum),
  }));
  return {
    m: monthly,
    rows,
    total,
    ret,
    n: api.tenure || rows.length || eng.S.set?.cn?.tenure || 36,
    rate: parseMoney(api.rate) || eng.S.set?.cn?.rate,
  };
}
