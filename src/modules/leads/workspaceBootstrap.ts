/**
 * Override prototype workspace + inactivity / hold actions to hit Lead Pipeline APIs.
 */
import {
  actions,
  eng,
  closeM,
  openM,
  toast,
  renderOverlay,
  go,
  bump,
  render,
} from "../../engine";
import { ApiError } from "../../http/types";
import {
  createEscalation,
  createNextAction,
  createNote,
  getTimeline,
  listCalls,
  logCall,
  sendNudge,
  startCallAttempt,
} from "../../http/workspace";
import { createHold, getLeadRuleStatus, releaseHold } from "../../http/rulesEngine";
import {
  listInactivityPolicies,
  pickPrimaryPolicy,
  upsertInactivityPolicies,
} from "../../http/inactivityRules";
import { getLead } from "../../http/leads";
import { upsertUiLead } from "./leadMapper";

function fieldErrors(err: unknown): Record<string, string> {
  if (!(err instanceof ApiError)) return {};
  if (typeof err.details === "string") return {};
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(err.details || {})) {
    out[k] = Array.isArray(v) ? v[0] : String(v);
  }
  return out;
}

function errMsg(err: unknown, fallback: string) {
  return err instanceof ApiError ? err.message : fallback;
}

function cycleOf(lead: any): string | null {
  return lead?.ownershipCycle || lead?.ownership_cycle || null;
}

async function ensureCycle(lead: any): Promise<string | null> {
  let c = cycleOf(lead);
  if (c) return c;
  try {
    const status = await getLeadRuleStatus(lead.id);
    if (status?.ownership_cycle) {
      lead.ownershipCycle = status.ownership_cycle;
      return status.ownership_cycle;
    }
  } catch {
    /* ignore */
  }
  try {
    const res = await getLead(lead.id);
    if (res.success && res.data) {
      const mapped = upsertUiLead(res.data);
      return cycleOf(mapped);
    }
  } catch {
    /* ignore */
  }
  return null;
}

async function refreshLead(id: string) {
  try {
    const res = await getLead(id);
    if (res.success && res.data) upsertUiLead(res.data);
  } catch {
    /* keep local */
  }
  try {
    const status = await getLeadRuleStatus(id);
    const l = eng.leadById(id);
    if (l && status) applyRuleStatus(l, status);
  } catch {
    /* optional */
  }
  bump();
}

export function applyRuleStatus(lead: any, status: Awaited<ReturnType<typeof getLeadRuleStatus>>) {
  if (!status) return;
  if (status.ownership_cycle) lead.ownershipCycle = status.ownership_cycle;
  if (status.hold) {
    lead.hold = {
      id: status.hold.id,
      by: status.hold.placed_by,
      reason: status.hold.reason || "",
      at: status.hold.created_at ? Date.parse(status.hold.created_at) : eng.NOW(),
    };
  } else if (status.state !== "hold") {
    lead.hold = null;
  }
  if (status.last_commitment_at) {
    const t = Date.parse(status.last_commitment_at);
    if (Number.isFinite(t)) lead.lastCommit = t;
  }
  lead._ruleState = status.state;
  lead._riskAt = status.risk_at;
  lead._returnAt = status.return_at;
}

/** Map an API activity `kind` to the timeline icon/filter kind the UI uses. */
function evKind(kind?: string): string {
  const k = String(kind || "").toLowerCase();
  if (/call/.test(k)) return "call";
  if (/whatsapp|^wa/.test(k)) return "wa";
  if (/meet/.test(k)) return "meet";
  if (/note/.test(k)) return "note";
  if (/doc/.test(k)) return "doc";
  if (/stage|qualif|status|booking|disposition/.test(k)) return "stage";
  if (/owner|assign|hold|reassign|claim/.test(k)) return "owner";
  if (/escal|warn|risk|inactiv|dnd|archiv/.test(k)) return "warn";
  return "sys";
}

/** Timeline event shape used by the engine: { t: ms, k, txt, by, x }. */
export function mapTimelineToEv(items: Array<{ kind?: string; description?: string; created_at?: string; id?: number; actor?: number }>) {
  return items.map((a) => ({
    id: a.id != null ? `api-ev-${a.id}` : undefined,
    k: evKind(a.kind),
    txt: a.description || "",
    t: a.created_at ? Date.parse(a.created_at) : eng.NOW(),
    by: a.actor != null ? String(a.actor) : null,
    x: {},
    _api: true,
  }));
}

/** Local timeline entry that the next server timeline load replaces (avoids duplicates). */
function addEvLocal(l: any, k: string, txt: string) {
  eng.addEv(l, k, txt);
  const ev = l.ev?.[l.ev.length - 1];
  if (ev) ev._pending = true;
}

export function mapCallsToUi(
  items: Array<{
    id?: number;
    result?: string;
    duration_seconds?: number;
    disposition?: string;
    temperature?: string;
    notes?: string;
    called_at?: string;
    created_at?: string;
  }>,
) {
  return items.map((c) => ({
    id: c.id != null ? `api-c-${c.id}` : `c${eng.uid?.() || Date.now()}`,
    t: c.called_at ? Date.parse(c.called_at) : c.created_at ? Date.parse(c.created_at) : eng.NOW(),
    by: null,
    live: true,
    res: c.result || "",
    dur: c.duration_seconds != null ? Math.round(Number(c.duration_seconds) / 60) : 0,
    note: c.notes || "",
    disp: c.disposition || null,
    temp: c.temperature || null,
    _api: true,
  }));
}

function toIso(ms: number) {
  return new Date(ms).toISOString();
}

function mapActionType(uiType: string): "follow_up" | "meeting" {
  return /meet/i.test(uiType) ? "meeting" : "follow_up";
}

function mapMeetingType(mkind: string): "in_person" | "online" {
  return mkind === "virtual" || mkind === "online" ? "online" : "in_person";
}

function buildNextActionPayload(f: any) {
  const t = eng.dtp(f.nat);
  const type = mapActionType(f.ntype || f.type || "Follow-up");
  const payload: any = {
    type,
    due_at: toIso(t),
    notes: String(f.note || f.natNote || "").trim() || undefined,
  };
  if (type === "meeting") {
    payload.meeting_type = mapMeetingType(f.mkind || "in-person");
    payload.location = String(f.mplace || "").trim();
  }
  return payload;
}

async function saveNote(id: string) {
  const f = eng.UI.mf;
  const l = eng.leadById(id);
  if (!l || f._busy) return;
  const text = String(f.txt || "").trim();
  if (!text) {
    f._e = { txt: "Write a note first." };
    renderOverlay();
    return;
  }
  f._busy = true;
  f._e = {};
  renderOverlay();
  try {
    const cycle = await ensureCycle(l);
    await createNote(id, text, cycle);
    addEvLocal(l, "note", "Note: " + text);
    f._busy = false;
    closeM();
    toast("Note saved", "ok");
    await refreshLead(id);
    render();
  } catch (err) {
    f._busy = false;
    const fe = fieldErrors(err);
    f._e = fe.text ? { txt: fe.text } : { txt: errMsg(err, "Could not save note.") };
    renderOverlay();
  }
}

async function saveCall(id: string) {
  const l = eng.leadById(id);
  const f = eng.UI.mf;
  const u = eng.me();
  if (!l || f._busy) return;

  const e: Record<string, string> = {};
  const conn = f.res === "Connected";
  const need = ["Interested", "Follow up", "Meeting fixed"].includes(f.disp);
  if (!f.res) e.res = "Choose what happened on the call.";
  if (conn) {
    if (!(+f.dur >= 1)) e.dur = "Enter the call length in minutes.";
    if (!f.disp) e.disp = "Choose the outcome.";
    if (f.disp === "Not interested" && !(f.note || "").trim()) e.note = "Add a short reason.";
  }
  const needsWhen = (conn && need) || (f.nat && f.res && !conn);
  if (conn && need && !f.nat) e.nat = "A next action with a date is required. It keeps the lead active.";
  if (f.nat) {
    const t = eng.dtp(f.nat);
    if (isNaN(t)) e.nat = "Enter a valid date and time.";
    else if (t <= eng.NOW()) e.nat = "Choose a time in the future.";
  }
  if (f.ntype === "Meeting" && needsWhen && !(f.mplace || "").trim()) e.mplace = "Add the place or link.";
  if (f.disp === "Meeting fixed" && f.ntype !== "Meeting") {
    e.nat = e.nat || "Meeting fixed needs a Meeting as the next action.";
  }
  if (Object.keys(e).length) {
    f._e = e;
    renderOverlay();
    return;
  }

  f._busy = true;
  f._e = {};
  renderOverlay();

  try {
    const cycle = await ensureCycle(l);
    const S = eng.S as any;
    const un = S.unlogged[u.id];
    const attemptId = un && un.lead === l.id ? un.attemptId : null;
    const bad = f.res === "Wrong number" || f.res === "DND requested";
    const payload: any = {
      result: f.res,
      duration_seconds: conn ? Math.round(+f.dur * 60) : 0,
      notes: String(f.note || "").trim() || undefined,
    };
    if (attemptId) payload.attempt_id = Number(attemptId);
    if (conn) {
      payload.disposition = f.disp;
      if (f.temp) payload.temperature = String(f.temp).toLowerCase();
    }
    if (!bad && f.nat) {
      const next = buildNextActionPayload({
        ...f,
        type: need && conn ? f.ntype : f.ntype || "Follow-up",
        note: f.note || "",
      });
      // For non-connected "try again", force follow_up
      if (!conn) {
        payload.next_action = {
          type: "follow_up",
          due_at: next.due_at,
          notes: next.notes,
        };
      } else {
        payload.next_action = next;
      }
    }

    await logCall(id, payload, cycle);

    if (un && un.lead === l.id) delete S.unlogged[u.id];

    f._busy = false;
    closeM();
    const archived =
      f.res === "Wrong number"
        ? "Wrong number"
        : f.res === "DND requested"
          ? "DND"
          : conn && f.disp === "Not interested"
            ? "Not interested"
            : null;
    toast(archived ? `Call saved. Lead archived (${archived})` : "Call saved", "ok");
    await refreshLead(id);
    if (archived) go("agent-leads");
    else render();
  } catch (err) {
    f._busy = false;
    const fe = fieldErrors(err);
    f._e = {
      ...(fe.result ? { res: fe.result } : {}),
      ...(fe.disposition ? { disp: fe.disposition } : {}),
      ...(fe.duration_seconds ? { dur: fe.duration_seconds } : {}),
      ...(fe.notes ? { note: fe.notes } : {}),
      ...(fe.next_action || fe.due_at ? { nat: fe.next_action || fe.due_at } : {}),
      ...(fe.location || fe.meeting_type ? { mplace: fe.location || fe.meeting_type } : {}),
    };
    if (!Object.keys(f._e).length) {
      f._e = { res: errMsg(err, "Could not save call.") };
    }
    renderOverlay();
  }
}

async function saveSchedule(id: string) {
  const l = eng.leadById(id);
  const f = eng.UI.mf;
  if (!l || f._busy) return;
  const e: Record<string, string> = {};
  const t = eng.dtp(f.nat);
  if (!f.nat || isNaN(t)) e.nat = "Choose a date and time.";
  else if (t <= eng.NOW()) e.nat = "Choose a time in the future.";
  if (f.type === "Meeting" && !(f.mplace || "").trim()) e.mplace = "Add the place or link.";
  if (Object.keys(e).length) {
    f._e = e;
    renderOverlay();
    return;
  }
  f._busy = true;
  f._e = {};
  renderOverlay();
  try {
    const cycle = await ensureCycle(l);
    await createNextAction(
      id,
      buildNextActionPayload({ ...f, ntype: f.type, note: f.note }),
      cycle,
    );
    f._busy = false;
    closeM();
    toast((f.type || "Follow-up") + " saved. Inactivity clock restarted", "ok");
    await refreshLead(id);
    render();
  } catch (err) {
    f._busy = false;
    const fe = fieldErrors(err);
    f._e = {
      ...(fe.due_at ? { nat: fe.due_at } : {}),
      ...(fe.location ? { mplace: fe.location } : {}),
      ...(fe.type ? { type: fe.type } : {}),
    };
    if (!Object.keys(f._e).length) f._e = { nat: errMsg(err, "Could not save schedule.") };
    renderOverlay();
  }
}

async function saveEscalation(id: string) {
  const l = eng.leadById(id);
  const f = eng.UI.mf;
  if (!l || f._busy) return;
  const e: Record<string, string> = {};
  if (!f.kind) e.kind = "Choose a reason.";
  if (!(f.txt || "").trim()) e.txt = "Add some detail.";
  if (Object.keys(e).length) {
    f._e = e;
    renderOverlay();
    return;
  }
  f._busy = true;
  f._e = {};
  renderOverlay();
  try {
    const cycle = await ensureCycle(l);
    await createEscalation(
      id,
      { category: String(f.kind), explanation: String(f.txt).trim() },
      cycle,
    );
    f._busy = false;
    closeM();
    toast("Sent to your manager", "ok");
    await refreshLead(id);
    render();
  } catch (err) {
    f._busy = false;
    const fe = fieldErrors(err);
    f._e = {
      ...(fe.category ? { kind: fe.category } : {}),
      ...(fe.explanation ? { txt: fe.explanation } : {}),
    };
    if (!Object.keys(f._e).length) f._e = { txt: errMsg(err, "Could not escalate.") };
    renderOverlay();
  }
}

async function saveHold(id: string) {
  const l = eng.leadById(id);
  const f = eng.UI.mf;
  if (!l || f._busy) return;
  if (!(f.why || "").trim()) {
    f._e = { why: "A reason is required." };
    renderOverlay();
    return;
  }
  f._busy = true;
  f._e = {};
  renderOverlay();
  try {
    const cycle = await ensureCycle(l);
    const hold = await createHold(id, String(f.why).trim(), cycle);
    l.hold = {
      id: hold.id,
      by: eng.me().id,
      reason: String(f.why).trim(),
      at: eng.NOW(),
    };
    addEvLocal(l, "owner", "Manager hold placed: " + String(f.why).trim());
    f._busy = false;
    closeM();
    toast("Lead on hold. Clock paused", "ok");
    await refreshLead(id);
    render();
  } catch (err) {
    f._busy = false;
    const fe = fieldErrors(err);
    f._e = fe.reason ? { why: fe.reason } : { why: errMsg(err, "Could not place hold.") };
    renderOverlay();
  }
}

async function releaseHoldAction(id: string) {
  const l = eng.leadById(id);
  if (!l) return;
  const holdId = l.hold?.id;
  if (!holdId) {
    // Local-only hold � clear
    l.hold = null;
    l.lastCommit = eng.NOW();
    toast("Hold released", "ok");
    render();
    return;
  }
  try {
    const cycle = await ensureCycle(l);
    await releaseHold(id, holdId, "Hold released from CRM", cycle);
    l.hold = null;
    l.lastCommit = eng.NOW();
    addEvLocal(l, "owner", "Manager hold released. Inactivity clock restarted.");
    toast("Hold released", "ok");
    await refreshLead(id);
    render();
  } catch (err) {
    toast(errMsg(err, "Could not release hold"), "err");
  }
}

async function saveNudge(id: string) {
  const l = eng.leadById(id);
  const f = eng.UI.mf;
  if (!l || f._busy) return;
  const text = String(f.msg || "") + (f.txt ? " " + String(f.txt).trim() : "");
  if (!String(f.msg || "").trim() && !String(f.txt || "").trim()) {
    f._e = { msg: "Choose or write a message." };
    renderOverlay();
    return;
  }
  f._busy = true;
  f._e = {};
  renderOverlay();
  try {
    const cycle = await ensureCycle(l);
    await sendNudge(id, cycle, text.trim());
    addEvLocal(l, "note", "Manager nudge: " + text.trim());
    // Agent notification + nudge record (shown on the lead and in the agent's notifications)
    (eng.S as any).nudges.push({ lead: l.id, by: eng.me().id, at: eng.NOW(), t: text.trim() });
    if (l.owner) eng.notify(l.owner, { t: "Nudge from " + eng.me().name, d: text.trim(), go: "agent-lead-" + l.id, ic: "bell" });
    f._busy = false;
    closeM();
    toast("Nudge sent", "ok");
    await refreshLead(id);
    render();
  } catch (err) {
    f._busy = false;
    f._e = { msg: errMsg(err, "Could not send nudge.") };
    renderOverlay();
  }
}

async function dialLead(id: string) {
  const l = eng.leadById(id);
  const u = eng.me();
  if (!l) return;
  if (l.dnd || eng.isDnd(l.phone)) {
    openM("blocked", [l.id, "dnd"]);
    return;
  }
  const S = eng.S as any;
  const p = S.unlogged[u.id];
  if (p && p.lead !== l.id) {
    openM("blocked", [l.id, "unlogged"]);
    return;
  }
  if (p && p.lead === l.id) {
    const phone = (p.phone || l.phone || "").replace(/\s/g, "");
    if (phone) location.href = "tel:" + phone;
    toast("Opening the phone dialer for " + (p.phone || l.phone));
    return;
  }
  try {
    const cycle = await ensureCycle(l);
    const attempt = await startCallAttempt(id, cycle);
    const phone = String(attempt?.phone || l.phone || "");
    S.unlogged[u.id] = {
      lead: l.id,
      t: eng.NOW(),
      est: eng.estFor(l),
      attemptId: attempt?.id,
      phone,
    };
    if (attempt?.ownership_cycle) l.ownershipCycle = attempt.ownership_cycle;
    addEvLocal(l, "call", "Call started from the app (dialer opened)");
    if (phone) location.href = "tel:" + phone.replace(/\s/g, "");
    toast("Opening the phone dialer for " + phone);
    render();
  } catch (err) {
    toast(errMsg(err, "Could not start call"), "err");
  }
}

async function saveRules() {
  const pf = eng.UI.pf;
  if (pf._busy) return;
  const e: Record<string, string> = {};
  const st = eng.S.set as any;
  const intIn = (k: string, lo: number, hi: number) => {
    const v = eng.pfv(k);
    if (v === "" || v == null) return null;
    const n = +v;
    if (!Number.isFinite(n) || n < lo || n > hi || !Number.isInteger(n)) {
      e[k] = `Enter a number from ${lo} to ${hi}.`;
      return null;
    }
    return n;
  };
  const x = intIn("inactX", 1, 60);
  const y = intIn("inactY", 1, 30);
  const na = intIn("noActDays", 1, 60);
  const c = intIn("capDefault", 1, 500);
  const sp = intIn("speed", 1, 240);
  const h = intIn("holdHours", 1, 168);
  const hc = intIn("holdCap", 1, 20);
  if (Object.keys(e).length) {
    pf._e = e;
    render();
    return;
  }

  pf._busy = true;
  pf._e = {};
  bump();

  try {
    const daysX = x != null ? x : st.inactX;
    const daysY = y != null ? y : st.inactY;
    await upsertInactivityPolicies({
      inactivity_days: daysX,
      grace_days: daysY,
      enabled: true,
    });

    const ch: string[] = [];
    const applyLocal = (k: string, v: number | null, label: string) => {
      if (v != null && v !== st[k]) {
        eng.audit("Setting changed", label, String(st[k]), String(v));
        st[k] = v;
        ch.push(label);
      }
    };
    applyLocal("inactX", daysX, "At-risk days");
    applyLocal("inactY", daysY, "Return days");
    applyLocal("noActDays", na, "No-action days");
    applyLocal("capDefault", c, "Default ceiling");
    applyLocal("speed", sp, "Speed to lead");
    applyLocal("holdHours", h, "Hold hours");
    applyLocal("holdCap", hc, "Hold cap");

    eng.UI.pf = {};
    toast(ch.length ? `${ch.length} setting${ch.length > 1 ? "s" : ""} saved` : "Inactivity policies saved", "ok");
    render();
  } catch (err) {
    pf._busy = false;
    toast(errMsg(err, "Could not save inactivity policies"), "err");
    render();
  }
}

/** Load inactivity policies into S.set.inactX / inactY (Admin Settings). */
export async function hydrateInactivityPolicies() {
  try {
    const { items } = await listInactivityPolicies();
    const primary = pickPrimaryPolicy(items);
    if (primary) {
      const set = eng.S.set as any;
      if (primary.inactivity_days != null) set.inactX = primary.inactivity_days;
      if (primary.grace_days != null) set.inactY = primary.grace_days;
      set._inactivityPolicies = items;
    }
  } catch {
    /* optional until admin grants settings.inactivity */
  }
}

/** Load workspace timeline + calls + rule status onto a lead detail. */
export async function hydrateLeadWorkspace(leadId: string) {
  const l = eng.leadById(leadId);
  if (!l) return;
  try {
    const status = await getLeadRuleStatus(leadId);
    applyRuleStatus(l, status);
  } catch {
    /* optional */
  }
  try {
    const tl = await getTimeline(leadId, { limit: 50, offset: 0 });
    if (tl.items.length) {
      const mapped = mapTimelineToEv(tl.items);
      const local = (l.ev || []).filter((x: any) => !x._api && !x._pending);
      l.ev = [...mapped, ...local].sort((a: any, b: any) => (b.t || 0) - (a.t || 0));
    }
  } catch {
    /* optional */
  }
  try {
    const calls = await listCalls(leadId, { limit: 50, offset: 0 });
    if (calls.items.length) {
      const mapped = mapCallsToUi(calls.items);
      const local = (l.calls || []).filter((x: any) => !x._api);
      l.calls = [...mapped, ...local].sort((a: any, b: any) => (b.t || 0) - (a.t || 0));
    }
  } catch {
    /* optional */
  }
}

export function installWorkspaceApiOverrides(): void {
  const A = actions();
  A.notesave = (a) => {
    void saveNote(a[0]);
  };
  A.callsave = (a) => {
    void saveCall(a[0]);
  };
  A.schedsave = (a) => {
    void saveSchedule(a[0]);
  };
  A.escsave = (a) => {
    void saveEscalation(a[0]);
  };
  A.holdsave = (a) => {
    void saveHold(a[0]);
  };
  A.holdoff = (a) => {
    void releaseHoldAction(a[0]);
  };
  A.nudgesave = (a) => {
    void saveNudge(a[0]);
  };
  A.dial = (a) => {
    void dialLead(a[0]);
  };
  A.dialnext = (a) => {
    location.hash = "agent-lead-" + a[0];
    setTimeout(() => void dialLead(a[0]), 30);
  };
  A.setrules = () => {
    void saveRules();
  };
}
