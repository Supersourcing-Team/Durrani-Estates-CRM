/**
 * Override prototype lead actions to call Module M04 Lead Pipeline APIs.
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
  confirmM,
} from "../../engine";
import {
  archiveLead,
  createLead,
  getLead,
  markLeadDnd,
  removeLeadDnd,
  updateLeadProfile,
  updateLeadQualification,
} from "../../http/leads";
import { ApiError } from "../../http/types";
import { loadLeadSources, resolveLeadSourceId } from "../../http/leadSources";
import { splitFullName, upsertUiLead } from "./leadMapper";
import { syncLeadCnApplication } from "../notes/cnBootstrap";
import { diffFields, logLeadEdit } from "./leadEditLog";
import { mapPayment, mapPtype, mapPurpose, mapTimeline } from "./qualMaps";

function toE164ish(cc: string, ph: string): string {
  const digits = String(ph || "").replace(/\D/g, "");
  const code = String(cc || "+971").replace(/\s/g, "");
  return `${code}${digits}`;
}

function syncLocalDndList(lead: any, on: boolean, reason?: string) {
  const S = eng.S as any;
  const phone = String(lead?.phone || "");
  if (!phone) return;
  const norm = eng.norm(phone);
  if (on) {
    if (!S.dnd.some((d: any) => eng.norm(d.no) === norm)) {
      S.dnd.unshift({
        no: phone,
        name: lead.name || "",
        by: eng.me()?.id,
        at: eng.NOW(),
        reason: reason || lead.dndReason || "Client requested no calls",
        leadId: String(lead.id),
      });
    }
  } else {
    S.dnd = S.dnd.filter((d: any) => eng.norm(d.no) !== norm);
  }
}

function fieldErrors(err: unknown): Record<string, string> {
  if (!(err instanceof ApiError)) return {};
  if (typeof err.details === "string") return {};
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(err.details || {})) {
    out[k] = Array.isArray(v) ? v[0] : String(v);
  }
  return out;
}

async function refreshLead(id: string) {
  try {
    const res = await getLead(id);
    if (res.success && res.data) {
      upsertUiLead(res.data);
      bump();
    }
  } catch {
    /* keep local */
  }
}

async function addLeadFromForm() {
  const f = eng.UI.mf;
  if (f._busy) return;

  const e: Record<string, string> = {};
  const name = String(f.name || "").trim();
  const cc = String(f.cc || "+971");
  const ph = String(f.ph || "").replace(/\D/g, "");
  const email = String(f.email || "").trim();

  if (!name) e.name = "Enter the client name.";
  if (!f.src) e.src = "Choose a source.";
  if (ph.length < 7 || ph.length > 12) e.ph = "Enter a valid phone number.";
  if (email && !/^\S+@\S+\.\S+$/.test(email)) e.email = "This does not look like an email address.";
  if (Object.keys(e).length) {
    f._e = e;
    renderOverlay();
    return;
  }

  const sourceId = resolveLeadSourceId(f.src);
  if (sourceId == null) {
    f._e = { src: "This source is not set up on the server. Pick another source." };
    renderOverlay();
    return;
  }

  const { first_name, last_name } = splitFullName(name);
  const phone = toE164ish(cc, String(f.ph || ""));

  f._busy = true;
  f._e = {};
  renderOverlay();

  try {
    const res = await createLead({
      first_name,
      last_name,
      phone,
      email: email || undefined,
      lead_source_id: sourceId,
      country:
        cc === "+971"
          ? "United Arab Emirates"
          : cc === "+91"
            ? "India"
            : cc === "+65"
              ? "Singapore"
              : cc === "+966"
                ? "Saudi Arabia"
                : undefined,
      requirement_summary: String(f.txt || "").trim() || undefined,
      temperature: "warm",
      track: "property",
    });
    f._busy = false;
    if (!res.success || !res.data) {
      f._e = { name: res.message || "Could not create lead." };
      renderOverlay();
      return;
    }
    const mapped = upsertUiLead(res.data);
    f._res = {
      title: "Lead added",
      kind: "ok",
      text: `${mapped.lead_code || "LEAD-" + mapped.id} is on your list.`,
      lead: mapped.id,
    };
    renderOverlay();
    bump();
  } catch (err) {
    f._busy = false;
    const fe = fieldErrors(err);
    f._e = {
      ...(fe.first_name || fe.last_name ? { name: fe.first_name || fe.last_name } : {}),
      ...(fe.phone ? { ph: fe.phone } : {}),
      ...(fe.email ? { email: fe.email } : {}),
      ...(fe.lead_source_id ? { src: fe.lead_source_id } : {}),
    };
    if (!Object.keys(f._e).length) {
      f._e = {
        name: err instanceof ApiError ? err.message : "Could not create lead.",
      };
    }
    renderOverlay();
  }
}

async function saveQualification(id: string) {
  const UI = eng.UI;
  const l = eng.leadById(id);
  if (!l || UI.pf._busy) return;

  const g = (k: string, d: any = "") => {
    const v = UI.pf[k];
    return v == null || v === "" ? d : v;
  };

  const e: Record<string, string> = {};
  const trk = String(g("trk", l.track || ""));
  const b0 = +g("bmin", l.budget ? l.budget[0] : "");
  const b1 = +g("bmax", l.budget ? l.budget[1] : "");
  if (!trk) e.trk = "Choose a track.";
  if (!(b0 > 0)) e.bmin = "Enter a minimum budget.";
  if (!(b1 > 0)) e.bmax = "Enter a maximum budget.";
  else if (b1 < b0) e.bmax = "Maximum must be at least the minimum.";
  if (Object.keys(e).length) {
    UI.pf._e = e;
    render();
    return;
  }

  const timeline = String(g("tline", l.timeline || ""));
  const payment = String(g("pay", l.payment || ""));
  const purpose = String(g("purp", l.purpose || ""));
  const ptype = String(g("ptype", l.ptype || ""));
  const visa = String(g("visa", l.visa || ""));
  const cur = String(g("cur", l.cur || "AED"));
  const notes = String(g("qnotes", l.qualNotes || "")).trim();


  const qualDiff = diffFields([
    ["Track", l.track ? eng.TRACKS[l.track] : "", trk ? eng.TRACKS[trk] : ""],
    ["Budget from", l.budget?.[0], b0],
    ["Budget to", l.budget?.[1], b1],
    ["Currency", l.cur || "AED", cur],
    ["Property type", l.ptype, ptype],
    ["Timeline", l.timeline, timeline],
    ["Payment", l.payment, payment],
    ["Purpose", l.purpose, purpose],
    ["Visa interest", l.visa, visa],
    ["Notes", l.qualNotes, notes],
  ]);

  UI.pf._busy = true;
  UI.pf._e = {};
  bump();

  try {
    // PUT /v1/leads/{id}/qualification/ saves the track, budget, requirements and notes in one call.
    await updateLeadQualification(id, {
      track: trk,
      budget_min: b0,
      budget_max: b1,
      budget_currency: cur,
      property_type: mapPtype(ptype),
      timeline: mapTimeline(timeline),
      payment_method: mapPayment(payment),
      purchase_purpose: mapPurpose(purpose),
      visa_required: /interest/i.test(visa),
      notes,
    });

    await refreshLead(id);
    // CN track: make sure the Convertible Note application exists so the CN card shows.
    if (trk === "cn") {
      try {
        await syncLeadCnApplication(id, { create: true });
      } catch {
        /* optional */
      }
    }
    if (qualDiff.count) {
      logLeadEdit(
        id,
        `Qualification edited by ${eng.me().name}: ${qualDiff.text}`,
        qualDiff.before,
        qualDiff.after,
        "Lead qualification edited",
      );
    }
    UI.pf._busy = false;
    toast("Qualification saved", "ok");
    render();
  } catch (err) {
    UI.pf._busy = false;
    const fe = fieldErrors(err);
    UI.pf._e = {
      ...(fe.track ? { trk: fe.track } : {}),
      ...(fe.budget_min ? { bmin: fe.budget_min } : {}),
      ...(fe.budget_max ? { bmax: fe.budget_max } : {}),
    };
    if (!Object.keys(UI.pf._e).length) {
      toast(err instanceof ApiError ? err.message : "Could not save qualification", "err");
    }
    render();
  }
}

async function archiveFromForm(id: string) {
  const f = eng.UI.mf;
  if (f._busy) return;
  if (!f.why) {
    f._e = { why: "Choose a reason." };
    renderOverlay();
    return;
  }
  const reason = String(f.why) + (f.txt ? ": " + String(f.txt).trim() : "");
  f._busy = true;
  renderOverlay();
  try {
    await archiveLead(id, reason);
    f._busy = false;
    closeM();
    toast("Lead archived", "ok");
    await refreshLead(id);
    go("agent-leads");
  } catch (err) {
    f._busy = false;
    const fe = fieldErrors(err);
    f._e = fe.reason ? { why: fe.reason } : {};
    if (!Object.keys(f._e).length) {
      f._e = { why: err instanceof ApiError ? err.message : "Could not archive lead." };
    }
    renderOverlay();
  }
}

async function dndFromForm(id: string) {
  const f = eng.UI.mf;
  if (f._busy) return;
  let reason = String(f.txt || "").trim() || "Client requested no calls";
  if (reason.length < 2) reason = "Client requested no calls";
  f._busy = true;
  renderOverlay();
  try {
    await markLeadDnd(id, reason);
    const mapped = await (async () => {
      try {
        const res = await getLead(id);
        if (res.success && res.data) return upsertUiLead(res.data);
      } catch {
        /* ignore */
      }
      const l = eng.leadById(id);
      if (l) {
        l.dnd = true;
        l.archived = true;
        l.disp = "DND";
        l.dndReason = reason;
      }
      return l;
    })();
    if (mapped) syncLocalDndList(mapped, true, reason);
    f._busy = false;
    closeM();
    toast("Added to the Do Not Call list", "ok");
    bump();
    go("agent-leads");
  } catch (err) {
    f._busy = false;
    toast(err instanceof ApiError ? err.message : "Could not mark DND", "err");
    renderOverlay();
  }
}

async function setTemperature(id: string, temp: string) {
  const l = eng.leadById(id);
  if (!l) return;
  const prev = l.temp;
  l.temp = temp;
  bump();
  try {
    const { first_name, last_name } = splitFullName(l.name);
    await updateLeadProfile(id, {
      first_name,
      last_name,
      phone: l.phone,
      email: l.email || null,
      city: l.city,
      country: l.country,
      temperature: temp,
    });
    toast("Marked " + temp, "ok");
    await refreshLead(id);
  } catch (err) {
    l.temp = prev;
    bump();
    toast(err instanceof ApiError ? err.message : "Could not update temperature", "err");
  }
}

export async function removeDndFromLead(id: string) {
  const l = eng.leadById(id);
  try {
    await removeLeadDnd(id);
    await refreshLead(id);
    if (l) syncLocalDndList(l, false);
    toast("Do Not Disturb removed", "ok");
    render();
  } catch (err) {
    toast(err instanceof ApiError ? err.message : "Could not remove DND", "err");
  }
}

function escHtml(s: string) {
  return String(s || "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );
}

/** Confirm then call POST �/remove-dnd/ (Admin). */
function askRemoveDnd(id: string) {
  const l = eng.leadById(id);
  const label = l ? `<b>${escHtml(l.phone)}</b>` : "this number";
  confirmM({
    title: "Remove from Do Not Call?",
    text: `${label} can be called and imported again. Do this only if the client asked you in writing.`,
    act: `removedndok|${id}`,
    ok: "Remove number",
    danger: true,
  });
}

async function removeDndFromSettingsIndex(index: number) {
  const S = eng.S as any;
  const d = S.dnd[index];
  if (!d) return;
  const norm = eng.norm(d.no);
  const lead =
    (d.leadId && eng.leadById(String(d.leadId))) ||
    S.leads.find((x: any) => x.dnd && eng.norm(x.phone) === norm);
  if (lead?._api || lead?.id) {
    try {
      await removeLeadDnd(lead.id);
      await refreshLead(String(lead.id));
      syncLocalDndList(lead, false);
      toast("Removed", "ok");
      render();
      return;
    } catch (err) {
      toast(err instanceof ApiError ? err.message : "Could not remove DND", "err");
      return;
    }
  }
  // Prototype-only entry with no API lead
  S.dnd.splice(index, 1);
  toast("Removed", "ok");
  render();
}

export function installLeadsApiOverrides(): void {
  const addLeadDef = eng.MD["add-lead"];
  if (addLeadDef) {
    const init0 = addLeadDef.init;
    addLeadDef.init = (...args: any[]) => {
      void loadLeadSources().then(() => {
        if (eng.UI.m === "add-lead") renderOverlay();
      });
      return init0 ? init0(...args) : {};
    };
  }
  const A = actions();
  A.addlead = () => {
    void addLeadFromForm();
  };
  A.qualsave = (a) => {
    void saveQualification(a[0]);
  };
  A.archsave = (a) => {
    void archiveFromForm(a[0]);
  };
  A.dndsave = (a) => {
    void dndFromForm(a[0]);
  };
  A.settemp = (a) => {
    void setTemperature(a[0], a[1]);
  };
  A.removednd = (a) => {
    askRemoveDnd(a[0]);
  };
  A.removedndok = (a) => {
    void removeDndFromLead(a[0]);
  };
  A.dndremoveok = (a) => {
    void removeDndFromSettingsIndex(+a[0]);
  };
}
