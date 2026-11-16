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
  qualifyLead,
  removeLeadDnd,
  updateLead,
} from "../../http/leads";
import { ApiError } from "../../http/types";
import { splitFullName, upsertUiLead } from "./leadMapper";

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

  const mapTimeline = (t: string) => {
    if (/0 to 3|immediate/i.test(t)) return "immediate";
    if (/3 to 6/i.test(t)) return "3_months";
    if (/6 to 12/i.test(t)) return "6_months";
    return t || "";
  };
  const mapPayment = (t: string) => {
    const x = t.toLowerCase();
    if (x.includes("cash")) return "cash";
    if (x.includes("mortgage")) return "mortgage";
    if (x.includes("plan")) return "payment_plan";
    return t || "";
  };
  const mapPurpose = (t: string) => {
    const x = t.toLowerCase();
    if (x.includes("invest")) return "investment";
    if (x.includes("own") || x.includes("end")) return "end_use";
    return t || "";
  };
  const mapPtype = (t: string) => {
    const x = t.toLowerCase();
    if (x.includes("off-plan") || x.includes("off plan")) return "off_plan";
    if (x.includes("villa")) return "villa";
    if (x.includes("town")) return "townhouse";
    if (x.includes("commercial")) return "commercial";
    if (x.includes("apartment") || x.includes("ready")) return "apartment";
    return t || "";
  };

  UI.pf._busy = true;
  UI.pf._e = {};
  bump();

  try {
    await updateLead(id, {
      budget_min: b0,
      budget_max: b1,
      budget_currency: cur,
      property_type: mapPtype(ptype),
      timeline: mapTimeline(timeline),
      payment_method: mapPayment(payment),
      purchase_purpose: mapPurpose(purpose),
      visa_required: /interest/i.test(visa),
      arabic_speaking: !!l.arabic,
      temperature: l.temp || undefined,
      requirement_summary: l.requirement || undefined,
    });

    // Qualify from primary track (existing Qual UI is single-track).
    await qualifyLead(id, {
      track: trk,
      property_sales: trk === "property",
      convertible_notes: trk === "cn",
      secondary_market: trk === "secondary",
      notes,
    });

    await refreshLead(id);
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
    await updateLead(id, { temperature: temp });
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

/** Confirm then call POST …/remove-dnd/ (Admin). */
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
