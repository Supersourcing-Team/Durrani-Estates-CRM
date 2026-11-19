/**
 * Override prototype Convertible Notes + org settings actions to call Module 4 APIs.
 */
import {
  actions,
  eng,
  closeM,
  toast,
  renderOverlay,
  go,
  bump,
  render,
} from "../../engine";
import { getSettings, patchCnCommission, patchCnTerms, patchFx } from "../../http/settings";
import {
  approveCnApplication,
  bounceCnPayout,
  commitCnApplication,
  createCnApplication,
  decideCnDocument,
  fixCnPayout,
  getCnApplication,
  getCnCalculator,
  getCnNote,
  listCnApplications,
  listCnCommissions,
  listCnNotes,
  payCnPayout,
  registerCnPdc,
  releaseCnCommission,
  renewCnNote,
  repayCnPrincipal,
  sendBackCnApplication,
  shareCnApplication,
  startCnDocuments,
  submitCnApplication,
  uploadCnDocument,
} from "../../http/convertibleNotes";
import { ApiError } from "../../http/types";
import {
  applyOrgSettings,
  mapCalculatorResult,
  resolveCnAppApiId,
  resolveCnNoteApiId,
  upsertCnApplication,
  upsertCnApplications,
  upsertCnNote,
  upsertCnNotes,
} from "./cnMappers";

function numId(v: string | number) {
  const n = Number(v);
  return Number.isFinite(n) ? n : v;
}

async function ensureApplication(leadId: string) {
  const l = eng.leadById(leadId);
  if (!l) throw new ApiError("Lead not found", "NOT_FOUND", {}, 404);
  if (l.cn?.apiId) {
    const res = await getCnApplication(l.cn.apiId);
    if (res.success && res.data) {
      upsertCnApplication(res.data);
      return l.cn.apiId;
    }
  }
  // Try list by lead
  try {
    const listed = await listCnApplications({ lead_id: numId(leadId) });
    const open = (listed.data || []).find((a) => a.stage !== "Active");
    if (open) {
      const detail = await getCnApplication(open.id);
      if (detail.success && detail.data) upsertCnApplication(detail.data);
      else upsertCnApplication(open);
      return open.id;
    }
  } catch {
    /* create below */
  }
  const res = await createCnApplication({
    lead_id: Number(leadId),
    amount: l.cn?.amount || l.budget?.[1] || undefined,
    currency: l.cn?.cur || l.cur || "AED",
  });
  if (!res.success || !res.data) {
    throw new ApiError(res.message || "Could not create application", "BAD_REQUEST", {}, 400);
  }
  upsertCnApplication(res.data);
  return res.data.id;
}

async function refreshApp(leadId: string) {
  const apiId = resolveCnAppApiId(leadId);
  if (!apiId) return;
  const res = await getCnApplication(apiId);
  if (res.success && res.data) {
    upsertCnApplication(res.data);
    bump();
  }
}

async function refreshNote(noteId: string) {
  const apiId = resolveCnNoteApiId(noteId);
  const res = await getCnNote(apiId);
  if (res.success && res.data) {
    upsertCnNote(res.data);
    bump();
  }
}

export async function loadOrgSettings() {
  const res = await getSettings();
  if (res.success && res.data) {
    applyOrgSettings(res.data);
    bump();
  }
  return res.data;
}

export async function loadCnApplications(params?: { stage?: string; lead_id?: string | number }) {
  const res = await listCnApplications(params);
  upsertCnApplications(res.data);
  bump();
  return res.data;
}

export async function loadCnNotes(params?: { status?: string; lead_id?: string | number }) {
  const res = await listCnNotes(params);
  upsertCnNotes(res.data);
  bump();
  return res.data;
}

async function setcn() {
  const UI = eng.UI;
  const pf = UI.pf;
  if (pf._busy) return;
  const e: Record<string, string> = {};
  const tenure = pf.c_ten !== undefined && pf.c_ten !== "" ? +pf.c_ten : null;
  const rate = pf.c_rate !== undefined && pf.c_rate !== "" ? +pf.c_rate : null;
  const fx = pf.fx !== undefined && pf.fx !== "" ? +pf.fx : null;
  const agentPct = pf.cn_agent !== undefined && pf.cn_agent !== "" ? +pf.cn_agent : null;
  const tlPct = pf.cn_tl !== undefined && pf.cn_tl !== "" ? +pf.cn_tl : null;
  const bhPct = pf.cn_bh !== undefined && pf.cn_bh !== "" ? +pf.cn_bh : null;

  if (tenure != null && (!(tenure >= 1 && tenure <= 120))) e.c_ten = "Enter 1 to 120.";
  if (rate != null && (!(rate >= 0.1 && rate <= 10))) e.c_rate = "Enter a rate from 0.1 to 10.";
  if (fx != null && (!(fx >= 1 && fx <= 1000))) e.fx = "Enter a rate.";
  if (Object.keys(e).length) {
    pf._e = e;
    render();
    return;
  }

  pf._busy = true;
  bump();
  try {
    const patches: Promise<unknown>[] = [];
    if (tenure != null || rate != null) {
      patches.push(
        patchCnTerms({
          ...(tenure != null ? { tenure } : {}),
          ...(rate != null ? { rate: String(rate) } : {}),
        }),
      );
    }
    if (fx != null) patches.push(patchFx({ aed_to_inr: String(fx) }));
    if (agentPct != null || tlPct != null || bhPct != null) {
      patches.push(
        patchCnCommission({
          ...(agentPct != null ? { agent_percent: String(agentPct) } : {}),
          ...(tlPct != null ? { team_lead_percent_default: String(tlPct) } : {}),
          ...(bhPct != null ? { business_head_percent: String(bhPct) } : {}),
        }),
      );
    }
    if (!patches.length) {
      // Save current displayed values if form empty (no change fields typed)
      const c = eng.S.set.cn;
      await patchCnTerms({ tenure: c.tenure, rate: String(c.rate), currencies: c.cur });
      await patchFx({ aed_to_inr: String(eng.S.set.fx) });
    } else {
      await Promise.all(patches);
    }
    await loadOrgSettings();
    pf._busy = false;
    UI.pf = {};
    toast("Saved. Applies to new notes only", "ok");
    render();
  } catch (err) {
    pf._busy = false;
    toast(err instanceof ApiError ? err.message : "Could not save settings", "err");
    bump();
  }
}

async function cnshare(leadId: string) {
  const f = eng.UI.mf;
  if (f._busy) return;
  f._busy = true;
  renderOverlay();
  try {
    const apiId = await ensureApplication(leadId);
    const res = await shareCnApplication(apiId);
    if (res.success && res.data) upsertCnApplication(res.data);
    else await refreshApp(leadId);
    f._busy = false;
    closeM();
    toast("Sent and logged", "ok");
    render();
  } catch (err) {
    f._busy = false;
    toast(err instanceof ApiError ? err.message : "Could not share", "err");
    renderOverlay();
  }
}

async function cncommit(leadId: string) {
  const f = eng.UI.mf;
  if (f._busy) return;
  const e: Record<string, string> = {};
  if (!(+f.amt > 0)) e.amt = "Enter the amount.";
  if (!f.ok) e.ok = "Confirm the client understands the terms.";
  if (Object.keys(e).length) {
    f._e = e;
    renderOverlay();
    return;
  }
  f._busy = true;
  f._e = {};
  renderOverlay();
  try {
    const apiId = await ensureApplication(leadId);
    const res = await commitCnApplication(apiId, {
      amount: f.amt,
      currency: f.cur || "AED",
    });
    if (res.success && res.data) upsertCnApplication(res.data);
    else await refreshApp(leadId);
    const l = eng.leadById(leadId);
    if (l) l.cur = f.cur || l.cur;
    f._busy = false;
    closeM();
    toast("Saved. Start collecting documents", "ok");
    render();
  } catch (err) {
    f._busy = false;
    toast(err instanceof ApiError ? err.message : "Could not commit", "err");
    renderOverlay();
  }
}

async function cnstart(leadId: string) {
  const pf = eng.UI.pf;
  if (pf._busy) return;
  pf._busy = true;
  bump();
  try {
    const apiId = await ensureApplication(leadId);
    const res = await startCnDocuments(apiId);
    if (res.success && res.data) upsertCnApplication(res.data);
    else await refreshApp(leadId);
    pf._busy = false;
    toast("Document collection started", "ok");
    render();
  } catch (err) {
    pf._busy = false;
    toast(err instanceof ApiError ? err.message : "Could not start documents", "err");
    bump();
  }
}

async function cndoc(leadId: string, category: string) {
  const f = eng.UI.mf;
  if (f._busy) return;
  if (!f.name) {
    f._e = { name: "Choose a file." };
    renderOverlay();
    return;
  }
  f._busy = true;
  f._e = {};
  renderOverlay();
  try {
    const apiId = await ensureApplication(leadId);
    const name = String(f.name);
    await uploadCnDocument(apiId, category, {
      file_name: name,
      storage_key: `cn/${apiId}/${category}/${name}`,
      mime_type: name.toLowerCase().endsWith(".pdf") ? "application/pdf" : "image/jpeg",
      file_size: 1,
    });
    await refreshApp(leadId);
    f._busy = false;
    closeM();
    toast("Received", "ok");
    render();
  } catch (err) {
    f._busy = false;
    toast(err instanceof ApiError ? err.message : "Upload failed", "err");
    renderOverlay();
  }
}

async function cnpdc(leadId: string) {
  const f = eng.UI.mf;
  if (f._busy) return;
  const e: Record<string, string> = {};
  const tenure = eng.S.set.cn.tenure;
  if (!(f.bank || "").trim()) e.bank = "Enter the bank.";
  if (!(f.first || "").trim()) e.first = "Enter the first cheque number.";
  if (+f.n !== tenure) e.n = "You need exactly " + tenure + " cheques.";
  if (Object.keys(e).length) {
    f._e = e;
    renderOverlay();
    return;
  }
  f._busy = true;
  f._e = {};
  renderOverlay();
  try {
    const apiId = await ensureApplication(leadId);
    const res = await registerCnPdc(apiId, {
      bank: String(f.bank).trim(),
      first_cheque: String(f.first).trim(),
      count: +f.n,
    });
    if (res.success && res.data) upsertCnApplication(res.data);
    else await refreshApp(leadId);
    f._busy = false;
    closeM();
    toast("PDC register saved", "ok");
    render();
  } catch (err) {
    f._busy = false;
    toast(err instanceof ApiError ? err.message : "Could not save PDC", "err");
    renderOverlay();
  }
}

async function cnsubmit(leadId: string) {
  const pf = eng.UI.pf;
  if (pf._busy) return;
  pf._busy = true;
  bump();
  try {
    const apiId = await ensureApplication(leadId);
    const res = await submitCnApplication(apiId);
    if (res.success && res.data) upsertCnApplication(res.data);
    else await refreshApp(leadId);
    pf._busy = false;
    toast("Submitted to Admin", "ok");
    render();
  } catch (err) {
    pf._busy = false;
    toast(err instanceof ApiError ? err.message : "Could not submit", "err");
    bump();
  }
}

async function cnv(leadId: string, category: string) {
  try {
    const apiId = await ensureApplication(leadId);
    await decideCnDocument(apiId, category, { decision: "verify" });
    await refreshApp(leadId);
    if (eng.UI.m === "cn-docview") closeM();
    toast("Verified", "ok");
    render();
  } catch (err) {
    toast(err instanceof ApiError ? err.message : "Could not verify", "err");
  }
}

async function cnrej(leadId: string, category: string) {
  const f = eng.UI.mf;
  if (f._busy) return;
  const why = String(f.why || "").trim();
  if (!why) {
    f._e = { why: "Say what is wrong." };
    renderOverlay();
    return;
  }
  f._busy = true;
  renderOverlay();
  try {
    const apiId = await ensureApplication(leadId);
    await decideCnDocument(apiId, category, { decision: "reject", rejection_note: why });
    await refreshApp(leadId);
    f._busy = false;
    closeM();
    toast("Rejected. The agent is told.", "ok");
    render();
  } catch (err) {
    f._busy = false;
    toast(err instanceof ApiError ? err.message : "Could not reject", "err");
    renderOverlay();
  }
}

async function cndecide(leadId: string) {
  const f = eng.UI.mf;
  if (f._busy) return;
  const e: Record<string, string> = {};
  if (!f.dec) e.dec = "Choose a decision.";
  if (f.dec === "back" && !(f.txt || "").trim()) e.txt = "Tell the agent what to fix.";
  if (Object.keys(e).length) {
    f._e = e;
    renderOverlay();
    return;
  }
  f._busy = true;
  f._e = {};
  renderOverlay();
  try {
    const apiId = await ensureApplication(leadId);
    if (f.dec === "back") {
      const res = await sendBackCnApplication(apiId, { note: String(f.txt).trim() });
      if (res.success && res.data) upsertCnApplication(res.data);
      else await refreshApp(leadId);
      f._busy = false;
      closeM();
      toast("Sent back to agent", "ok");
      render();
      return;
    }
    const res = await approveCnApplication(apiId);
    f._busy = false;
    if (res.success && res.data) {
      const note = upsertCnNote(res.data);
      await refreshApp(leadId);
      closeM();
      toast((note.id || "Note") + " is now active", "ok");
      go("admin-cnnote-" + eng.noteP(note.id));
    } else {
      toast(res.message || "Could not approve", "err");
      renderOverlay();
    }
  } catch (err) {
    f._busy = false;
    toast(err instanceof ApiError ? err.message : "Could not decide", "err");
    renderOverlay();
  }
}

async function paypaid(noteId: string, installmentNo: string) {
  const f = eng.UI.mf;
  if (f._busy) return;
  if (!(f.ref || "").trim()) {
    f._e = { ref: "Enter the reference." };
    renderOverlay();
    return;
  }
  f._busy = true;
  renderOverlay();
  try {
    const apiId = resolveCnNoteApiId(noteId);
    await payCnPayout(apiId, installmentNo, { payment_ref: String(f.ref).trim() });
    await refreshNote(noteId);
    f._busy = false;
    closeM();
    toast("Payout " + installmentNo + " marked as paid", "ok");
    render();
  } catch (err) {
    f._busy = false;
    toast(err instanceof ApiError ? err.message : "Could not mark paid", "err");
    renderOverlay();
  }
}

async function payfixed(noteId: string, installmentNo: string) {
  const f = eng.UI.mf;
  if (f._busy) return;
  const e: Record<string, string> = {};
  if (!f.how) e.how = "Choose one.";
  if (!(f.ref || "").trim()) e.ref = "Enter the reference.";
  if (Object.keys(e).length) {
    f._e = e;
    renderOverlay();
    return;
  }
  f._busy = true;
  renderOverlay();
  try {
    const apiId = resolveCnNoteApiId(noteId);
    await fixCnPayout(apiId, installmentNo, {
      payment_ref: String(f.ref).trim(),
      how: String(f.how),
    });
    await refreshNote(noteId);
    f._busy = false;
    closeM();
    toast("Resolved", "ok");
    render();
  } catch (err) {
    f._busy = false;
    toast(err instanceof ApiError ? err.message : "Could not resolve", "err");
    renderOverlay();
  }
}

async function paybounce(noteId: string, installmentNo: string) {
  try {
    const apiId = resolveCnNoteApiId(noteId);
    await bounceCnPayout(apiId, installmentNo, { note: String(eng.UI.mf?.txt || "").trim() || undefined });
    await refreshNote(noteId);
    toast("Payout marked bounced", "ok");
    render();
  } catch (err) {
    toast(err instanceof ApiError ? err.message : "Could not mark bounced", "err");
  }
}

async function cnrepay(noteId: string) {
  try {
    const apiId = resolveCnNoteApiId(noteId);
    const res = await repayCnPrincipal(apiId);
    if (res.success && res.data) upsertCnNote(res.data);
    else await refreshNote(noteId);
    toast("Principal repaid; note closed", "ok");
    render();
  } catch (err) {
    toast(err instanceof ApiError ? err.message : "Could not repay", "err");
  }
}

async function cnrenew(noteId: string) {
  try {
    const apiId = resolveCnNoteApiId(noteId);
    const res = await renewCnNote(apiId);
    if (res.success && res.data) {
      const note = upsertCnNote(res.data);
      toast("Note renewed", "ok");
      go("admin-cnnote-" + eng.noteP(note.id));
    } else {
      toast(res.message || "Could not renew", "err");
    }
  } catch (err) {
    toast(err instanceof ApiError ? err.message : "Could not renew", "err");
  }
}

async function cncommrel(commissionId: string) {
  try {
    await releaseCnCommission(commissionId);
    toast("Commission released", "ok");
    closeM();
    render();
  } catch (err) {
    toast(err instanceof ApiError ? err.message : "Could not release", "err");
  }
}

/** Optional: log illustration — keep local event but refresh calc from API if needed. */
async function cnlog(leadId: string, amount: string, currency: string) {
  try {
    const apiId = await ensureApplication(leadId);
    // Sharing terms moves Qualified → Information shared
    const l = eng.leadById(leadId);
    if (l?.cn?.stage === "Qualified") {
      const res = await shareCnApplication(apiId);
      if (res.success && res.data) upsertCnApplication(res.data);
    }
    if (l?.cn) {
      l.cn.amount = +amount;
      l.cn.cur = currency;
    }
    toast("Logged as sent", "ok");
    render();
  } catch (err) {
    toast(err instanceof ApiError ? err.message : "Could not log", "err");
  }
}

export function installConvertibleNotesApiOverrides(): void {
  const A = actions();

  A.setcn = () => {
    void setcn();
  };
  A.cnshare = (a) => {
    void cnshare(a[0]);
  };
  A.cncommit = (a) => {
    void cncommit(a[0]);
  };
  A.cnstart = (a) => {
    void cnstart(a[0]);
  };
  A.cndoc = (a) => {
    void cndoc(a[0], a[1]);
  };
  A.cnpdc = (a) => {
    void cnpdc(a[0]);
  };
  A.cnsubmit = (a) => {
    void cnsubmit(a[0]);
  };
  A.cnv = (a) => {
    void cnv(a[0], a[1]);
  };
  A.cnrej = (a) => {
    void cnrej(a[0], a[1]);
  };
  A.cnrejfrom = (a) => {
    void cnrej(a[0], a[1]);
  };
  A.cndecide = (a) => {
    void cndecide(a[0]);
  };
  A.paypaid = (a) => {
    void paypaid(a[0], a[1]);
  };
  A.payfixed = (a) => {
    void payfixed(a[0], a[1]);
  };
  A.paybounce = (a) => {
    void paybounce(a[0], a[1]);
  };
  A.cnrepay = (a) => {
    void cnrepay(a[0]);
  };
  A.cnrenew = (a) => {
    void cnrenew(a[0]);
  };
  A.cncommrel = (a) => {
    void cncommrel(a[0]);
  };
  A.cnlog = (a) => {
    void cnlog(a[0], a[1], a[2]);
  };
}

/**
 * Prefer GET /calculator/ when cached; otherwise local eng.cnCalc and prefetch API.
 * Do not assign onto eng.cnCalc — engine exports are read-only module bindings.
 */
export function resolveCnCalc(principal: number, start?: number) {
  const amt = +principal || 0;
  const cached = eng.UI.pf?._cnCalcApi;
  if (cached && cached.forPrincipal === amt) return cached.result;

  if (amt > 0) {
    const inflight = eng.UI.pf?._cnCalcInflight;
    if (inflight !== amt) {
      eng.UI.pf._cnCalcInflight = amt;
      void getCnCalculator(amt)
        .then((res) => {
          if (eng.UI.pf._cnCalcInflight !== amt) return;
          if (res.success && res.data) {
            const result = mapCalculatorResult(res.data, amt);
            eng.UI.pf._cnCalcApi = { forPrincipal: amt, result };
            if (res.data.org_terms) {
              applyOrgSettings({ cn_terms: res.data.org_terms as any });
            }
            bump();
          }
        })
        .catch(() => {
          /* keep local */
        })
        .finally(() => {
          if (eng.UI.pf._cnCalcInflight === amt) eng.UI.pf._cnCalcInflight = null;
        });
    }
  }

  return eng.cnCalc(amt, start ?? eng.NOW());
}

export { listCnCommissions, getCnCalculator };
