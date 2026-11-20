/**
 * Admin lead editing: Profile details (PUT /v1/leads/{id}/profile/) and shortlisted properties
 * (POST /v1/catalogue/shortlist/). Admin qualification edits (lead-qual-edit drawer) call
 * PUT /v1/leads/{id}/qualification/. All edits are logged in the lead timeline + audit log
 * through logLeadEdit.
 */
import {
  actions,
  eng,
  mdef,
  closeM,
  openM,
  toast,
  renderOverlay,
  bump,
  render,
} from "../../engine";
import { getLead, updateLeadProfile, updateLeadQualification } from "../../http/leads";
import { createShortlist, listProjects } from "../../http/catalogue";
import { ApiError } from "../../http/types";
import { splitFullName, upsertUiLead } from "./leadMapper";
import { diffFields, logLeadEdit } from "./leadEditLog";
import { mapPayment, mapPtype, mapPurpose, mapTimeline, qualLabel } from "./qualMaps";
import { syncLeadCnApplication } from "../notes/cnBootstrap";
import { loadLeadShortlist } from "../deals/propertySalesBootstrap";
import { resolveProjectApiId, upsertUiProjects } from "../deals/propertyMappers";

const numId = (v: any) => (Number.isFinite(Number(v)) ? Number(v) : v);

function fieldErrors(err: unknown): Record<string, string> {
  if (!(err instanceof ApiError) || typeof err.details === "string") return {};
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(err.details || {})) out[k] = Array.isArray(v) ? v[0] : String(v);
  return out;
}

async function refresh(id: string) {
  try {
    const res = await getLead(id);
    if (res.success && res.data) upsertUiLead(res.data);
  } catch {
    /* keep local */
  }
}

async function saveLeadEdit(id: string) {
  const f = eng.UI.mf;
  const l = eng.leadById(id);
  if (!l || f._busy) return;

  const first = String(f.first ?? "").trim();
  const last = String(f.last ?? "").trim();
  const phone = String(f.phone ?? "").trim();
  const email = String(f.email ?? "").trim();
  const city = String(f.city ?? "").trim();
  const country = String(f.country ?? "").trim();
  const nationality = String(f.nat ?? "").trim();

  const e: Record<string, string> = {};
  if (!first) e.first = "Enter the first name.";
  if (phone.replace(/\D/g, "").length < 7) e.phone = "Enter a valid phone number.";
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Enter a valid email address.";
  if (Object.keys(e).length) {
    f._e = e;
    renderOverlay();
    return;
  }

  const was = splitFullName(l.name);
  const diff = diffFields([
    ["First name", was.first_name, first],
    ["Last name", was.last_name, last],
    ["Phone", l.phone, phone],
    ["Email", l.email, email],
    ["City", l.city, city],
    ["Country", l.country, country],
    ["Nationality", l.nationality, nationality],
  ]);
  if (!diff.count) {
    closeM();
    toast("Nothing changed");
    return;
  }

  f._busy = true;
  f._e = {};
  renderOverlay();
  try {
    await updateLeadProfile(id, {
      first_name: first,
      last_name: last,
      phone,
      email: email || null,
      city,
      country,
      nationality,
    });
    await refresh(id);
    logLeadEdit(
      id,
      `Profile edited by ${eng.me().name}: ${diff.text}`,
      diff.before,
      diff.after,
      "Lead profile edited",
    );
    f._busy = false;
    closeM();
    toast("Profile saved", "ok");
    bump();
  } catch (err) {
    f._busy = false;
    const fe = fieldErrors(err);
    f._e = {
      ...(fe.first_name ? { first: fe.first_name } : {}),
      ...(fe.phone ? { phone: fe.phone } : {}),
      ...(fe.email ? { email: fe.email } : {}),
    };
    if (!Object.keys(f._e).length) {
      f._e = { phone: err instanceof ApiError ? err.message : "Could not save the profile." };
    }
    renderOverlay();
  }
}

async function saveQualEdit(id: string) {
  const f = eng.UI.mf;
  const l = eng.leadById(id);
  if (!l || f._busy) return;

  const trk = String(f.trk || "");
  const bminRaw = String(f.bmin ?? "").trim();
  const bmaxRaw = String(f.bmax ?? "").trim();
  const b0 = bminRaw === "" ? null : Number(bminRaw);
  const b1 = bmaxRaw === "" ? null : Number(bmaxRaw);
  const e: Record<string, string> = {};
  if (!trk) e.trk = "Choose a track.";
  if (b0 != null && !(b0 >= 0)) e.bmin = "Enter 0 or more.";
  if (b1 != null && !(b1 >= 0)) e.bmax = "Enter 0 or more.";
  if (b0 != null && b1 != null && b1 < b0) e.bmax = "Maximum must be at least the minimum.";
  if (Object.keys(e).length) {
    f._e = e;
    renderOverlay();
    return;
  }

  const cur = String(f.cur || "AED");
  const ptype = String(f.ptype || "");
  const timeline = String(f.tline || "");
  const payment = String(f.pay || "");
  const purpose = String(f.purp || "");
  const visa = String(f.visa || "");
  const notes = String(f.qnotes || "").trim();

  const diff = diffFields([
    ["Track", l.track ? eng.TRACKS[l.track] : "", trk ? eng.TRACKS[trk] : ""],
    ["Budget from", l.budget?.[0], b0],
    ["Budget to", l.budget?.[1], b1],
    ["Currency", l.cur || "AED", cur],
    ["Property type", qualLabel(l.ptype), ptype],
    ["Timeline", qualLabel(l.timeline), timeline],
    ["Payment", qualLabel(l.payment), payment],
    ["Purpose", qualLabel(l.purpose), purpose],
    ["Visa interest", l.visa, visa],
    ["Notes", l.qualNotes, notes],
  ]);
  if (!diff.count) {
    closeM();
    toast("Nothing changed");
    return;
  }

  f._busy = true;
  f._e = {};
  renderOverlay();
  try {
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
    await refresh(id);
    if (trk === "cn") {
      try {
        await syncLeadCnApplication(id, { create: true });
      } catch {
        /* optional */
      }
    }
    logLeadEdit(
      id,
      `Qualification edited by ${eng.me().name}: ${diff.text}`,
      diff.before,
      diff.after,
      "Lead qualification edited",
    );
    f._busy = false;
    closeM();
    toast("Qualification saved", "ok");
    bump();
  } catch (err) {
    f._busy = false;
    const fe = fieldErrors(err);
    f._e = {
      ...(fe.track ? { trk: fe.track } : {}),
      ...(fe.budget_min ? { bmin: fe.budget_min } : {}),
      ...(fe.budget_max ? { bmax: fe.budget_max } : {}),
    };
    if (!Object.keys(f._e).length) {
      f._e = { trk: err instanceof ApiError ? err.message : "Could not save the qualification." };
    }
    renderOverlay();
  }
}
/** Load the project catalogue (if not loaded yet) then open the picker. */
async function openShortlistAdd(leadId: string) {
  try {
    const res = await listProjects({});
    upsertUiProjects(res.data);
  } catch {
    /* use whatever is loaded */
  }
  openM("lead-shortlist-add", [leadId]);
}

async function saveShortlistAdd(leadId: string) {
  const f = eng.UI.mf;
  const l = eng.leadById(leadId);
  if (!l || f._busy) return;
  if (!f.proj) {
    f._e = { proj: "Choose a property." };
    renderOverlay();
    return;
  }
  const p = eng.projById(f.proj);
  f._busy = true;
  f._e = {};
  renderOverlay();
  try {
    const res = await createShortlist({
      lead_id: numId(leadId),
      project_id: numId(resolveProjectApiId(f.proj)),
      is_primary: !(l.shortlist || []).length,
      notes: String(f.txt || "").trim() || undefined,
    });
    if (!res.success) throw new ApiError(res.message || "Could not shortlist.", "BAD_REQUEST", {}, 400);
    await loadLeadShortlist(leadId);
    logLeadEdit(
      leadId,
      `Property shortlisted by ${eng.me().name}: ${p?.name || f.proj}`,
      "",
      p?.name || String(f.proj),
      "Lead shortlist added",
    );
    f._busy = false;
    closeM();
    toast("Property added to shortlist", "ok");
    render();
  } catch (err) {
    f._busy = false;
    f._e = { proj: err instanceof ApiError ? err.message : "Could not shortlist." };
    renderOverlay();
  }
}

export function installAdminLeadEditOverrides(): void {
  mdef("lead-edit", {
    role: "admin",
    title: "Edit profile",
    init: (a: string[]) => {
      const l = eng.leadById(a[0]);
      const n = splitFullName(l?.name || "");
      return {
        first: n.first_name,
        last: n.last_name,
        phone: l?.phone || "",
        email: l?.email || "",
        city: l?.city || "",
        country: l?.country || "",
        nat: l?.nationality || "",
      };
    },
    render: () => ({ title: "Edit profile", body: "", foot: "" }),
  });  mdef("lead-qual-edit", {
    role: "admin",
    title: "Edit qualification",
    init: (a: string[]) => {
      const l = eng.leadById(a[0]);
      return {
        trk: l?.track || "",
        cur: l?.cur || "AED",
        bmin: l?.budget ? String(l.budget[0]) : "",
        bmax: l?.budget ? String(l.budget[1]) : "",
        ptype: qualLabel(l?.ptype),
        tline: qualLabel(l?.timeline),
        pay: qualLabel(l?.payment),
        purp: qualLabel(l?.purpose),
        visa: l?.visa || "",
        qnotes: l?.qualNotes || "",
      };
    },
    render: () => ({ title: "Edit qualification", body: "", foot: "" }),
  });  mdef("lead-shortlist-add", {
    role: "admin",
    title: "Add property",
    init: () => ({ proj: "", txt: "" }),
    render: () => ({ title: "Add property", body: "", foot: "" }),
  });

  const A = actions();
  A.leadeditsave = (a) => {
    void saveLeadEdit(a[0]);
  };
  A.leadqualsave = (a) => {
    void saveQualEdit(a[0]);
  };
  A.leadshortopen = (a) => {
    void openShortlistAdd(a[0]);
  };
  A.leadshortsave = (a) => {
    void saveShortlistAdd(a[0]);
  };

  // Removing a shortlisted property: keep the existing behaviour, but log it.
  const origDel = A.shortdel;
  A.shortdel = (a, el) => {
    const l = eng.leadById(a[0]);
    const p = eng.projById(a[1]);
    origDel?.(a, el);
    if (l && p) {
      logLeadEdit(
        l.id,
        `Property removed from shortlist by ${eng.me().name}: ${p.name}`,
        p.name,
        "",
        "Lead shortlist removed",
      );
      bump();
    }
  };
}
