/**
 * Override prototype property-sales actions to call Module 3 APIs.
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
  parse,
  hashOf,
} from "../../engine";
import {
  createAvailabilityRequest,
  createDeveloper,
  createProject,
  createShortlist,
  createUnit,
  decideAvailabilityRequest,
  getProject,
  listAvailabilityRequests,
  listDevelopers,
  listProjects,
  listProjectUnits,
  listShortlist,
  releaseUnitHold,
  updateProject,
  updateUnit,
} from "../../http/catalogue";
import {
  approveBooking,
  closeBooking,
  createBooking,
  decideBookingDocument,
  getBooking,
  listBookings,
  markSpaIssued,
  rejectBooking,
  requestBookingChanges,
  resubmitBooking,
  updateBookingPayment,
  uploadBookingDocument,
} from "../../http/deals";
import {
  adjustCommission,
  getCommission,
  listCommissions,
  markDeveloperInvoiced,
  markDeveloperReceived,
  releaseCommission,
  upsertSlabs,
} from "../../http/commission";
import { ApiError } from "../../http/types";
import {
  applyCommissionToBooking,
  applyShortlistToLead,
  resolveBookingApiId,
  resolveProjectApiId,
  resolveUnitApiId,
  upsertUiBooking,
  upsertUiProject,
  upsertUiProjects,
} from "./propertyMappers";

function fieldErrors(err: unknown): Record<string, string> {
  if (!(err instanceof ApiError)) return {};
  if (typeof err.details === "string") return {};
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(err.details || {})) {
    out[k] = Array.isArray(v) ? v[0] : String(v);
  }
  return out;
}

function numId(v: any): number {
  const n = Number(String(v).replace(/\D/g, "") || v);
  return Number.isFinite(n) ? n : Number(v);
}

async function refreshBooking(id: string) {
  try {
    const apiId = resolveBookingApiId(id);
    const res = await getBooking(apiId);
    if (res.success && res.data) {
      upsertUiBooking(res.data);
      bump();
    }
  } catch {
    /* keep local */
  }
}

async function refreshProject(id: string) {
  try {
    const apiId = resolveProjectApiId(id);
    const res = await getProject(apiId);
    if (res.success && res.data) {
      upsertUiProject(res.data);
      // Prefer nested units; fall back to dedicated units list when detail omits them.
      if (!Array.isArray(res.data.units) || !res.data.units.length) {
        try {
          const units = await listProjectUnits(apiId);
          if (units.success && units.data?.length) {
            const mapped = upsertUiProject({ ...res.data, units: units.data });
            void mapped;
          }
        } catch {
          /* optional */
        }
      }
      bump();
    }
  } catch {
    /* keep local */
  }
}

export async function loadCatalogueProjects(filters?: {
  q?: string;
  city?: string;
  type?: string;
  priority?: boolean;
}) {
  const res = await listProjects({
    q: filters?.q || undefined,
    city: filters?.city && filters.city !== "all" ? filters.city : undefined,
    type: filters?.type && filters.type !== "all" ? filters.type : undefined,
    priority: filters?.priority ? true : undefined,
  });
  return upsertUiProjects(res.data);
}

export async function loadBookingsList(status?: string) {
  const res = await listBookings(status ? { status } : undefined);
  return res.data.map(upsertUiBooking);
}

export async function loadCommissionsList(status?: string) {
  const res = await listCommissions(status ? { status } : undefined);
  return res.data.map(applyCommissionToBooking);
}

export async function loadLeadShortlist(leadId: string) {
  const res = await listShortlist({ lead_id: numId(leadId) });
  if (res.success && res.data) applyShortlistToLead(leadId, res.data);
  bump();
  return res.data || [];
}

export async function loadAvailabilityQueue(status?: string) {
  const res = await listAvailabilityRequests(status ? { status } : undefined);
  return res.data || [];
}

async function shortsave(projectId: string) {
  const f = eng.UI.mf;
  if (f._busy) return;
  if (!f.lead) {
    f._e = { lead: "Choose a lead." };
    renderOverlay();
    return;
  }
  f._busy = true;
  renderOverlay();
  try {
    const res = await createShortlist({
      lead_id: numId(f.lead),
      project_id: numId(resolveProjectApiId(projectId)),
      is_primary: true,
      notes: String(f.txt || "").trim() || undefined,
    });
    f._busy = false;
    if (res.success) {
      await loadLeadShortlist(String(f.lead));
      closeM();
      toast("Added to shortlist", "ok");
      render();
    } else {
      f._e = { lead: res.message || "Could not shortlist." };
      renderOverlay();
    }
  } catch (err) {
    f._busy = false;
    f._e = { lead: err instanceof ApiError ? err.message : "Could not shortlist." };
    renderOverlay();
  }
}

async function availsave(projectId: string, unitId: string) {
  const f = eng.UI.mf;
  if (f._busy) return;
  f._busy = true;
  renderOverlay();
  try {
    await createAvailabilityRequest({
      project_id: numId(resolveProjectApiId(projectId)),
      unit_id: numId(resolveUnitApiId(projectId, unitId)),
      lead_id: f.lead ? numId(f.lead) : undefined,
      notes: String(f.txt || "").trim() || undefined,
    });
    f._busy = false;
    closeM();
    toast("Request sent to Admin", "ok");
  } catch (err) {
    f._busy = false;
    toast(err instanceof ApiError ? err.message : "Could not send request", "err");
    renderOverlay();
  }
}

async function booksave() {
  const UI = eng.UI;
  if (UI.pf._busy) return;
  const e: Record<string, string> = {};
  const p = (parse(hashOf()) || { params: [] }).params as string[];
  const lead = String(UI.pf.lead || p[0] || "");
  const proj = String(UI.pf.proj || p[1] || "");
  let unit = String(UI.pf.unit || p[2] || "");
  const pr = proj ? eng.projById(proj) : null;
  const un = pr?.units?.find((x: any) => x.id === unit);
  if (!lead) e.lead = "Choose a lead.";
  if (!proj) e.proj = "Choose a project.";
  if (!unit || !un) e.unit = "Choose an available unit.";
  const price = +(UI.pf.price ?? un?.price ?? 0);
  const dep = +(UI.pf.dep ?? (un ? Math.round(un.price * 0.1) : 0));
  if (!(price > 0)) e.price = "Enter the agreed price.";
  if (!(dep > 0)) e.dep = "Enter the deposit.";
  if (!UI.pf.f_form) e.f_form = "Upload the booking form.";
  if (!UI.pf.f_receipt) e.f_receipt = "Upload the deposit receipt.";
  if (Object.keys(e).length) {
    UI.pf._e = e;
    render();
    return;
  }

  UI.pf._busy = true;
  bump();
  try {
    const listPrice = un.price || price;
    const res = await createBooking({
      lead_id: numId(lead),
      project_id: numId(resolveProjectApiId(proj)),
      unit_id: numId(resolveUnitApiId(proj, unit)),
      payment_plan_id: pr?.paymentPlanId || undefined,
      base_price: listPrice,
      discount_amount: Math.max(0, listPrice - price),
      final_price: price,
      currency: "AED",
      deposit_amount: dep,
      deposit_mode: String(UI.pf.mode || "Bank transfer"),
      special_terms: String(UI.pf.offer || "").trim() || "",
    });
    if (!res.success || !res.data) {
      UI.pf._busy = false;
      toast(res.message || "Could not create booking", "err");
      render();
      return;
    }
    const mapped = upsertUiBooking(res.data);
    const apiId = mapped.apiId;

    // Metadata uploads for form + receipt (binary upload not in Module 3 yet).
    for (const [slot, cat] of [
      ["f_form", "form"],
      ["f_receipt", "receipt"],
    ] as const) {
      const name = String(UI.pf[slot] || "");
      if (!name) continue;
      try {
        await uploadBookingDocument(apiId, cat, {
          file_name: name,
          storage_key: `bookings/${apiId}/${cat}/${name}`,
          mime_type: name.toLowerCase().endsWith(".pdf") ? "application/pdf" : "image/jpeg",
          file_size: 1,
        });
      } catch {
        /* booking exists; docs can be retried on detail */
      }
    }

    await refreshBooking(mapped.id);
    await refreshProject(proj);
    UI.pf._busy = false;
    toast("Booking submitted. Unit held.", "ok");
    go("agent-booking-" + eng.bkP(mapped.id));
  } catch (err) {
    UI.pf._busy = false;
    const fe = fieldErrors(err);
    UI.pf._e = {
      ...(fe.lead_id ? { lead: fe.lead_id } : {}),
      ...(fe.unit_id ? { unit: fe.unit_id } : {}),
      ...(fe.final_price ? { price: fe.final_price } : {}),
    };
    if (!Object.keys(UI.pf._e).length) {
      toast(err instanceof ApiError ? err.message : "Could not create booking", "err");
    }
    render();
  }
}

async function spasave(bookingId: string) {
  const f = eng.UI.mf;
  if (f._busy) return;
  const t = Date.parse(String(f.d || "") + "T10:00:00+04:00");
  if (!f.d || Number.isNaN(t) || t > eng.NOW()) {
    f._e = { d: "Choose today or an earlier date." };
    renderOverlay();
    return;
  }
  f._busy = true;
  f._e = {};
  renderOverlay();
  try {
    await markSpaIssued(resolveBookingApiId(bookingId), {
      spa_issued_date: String(f.d),
      spa_number: String(f.no || "").trim() || undefined,
    });
    await refreshBooking(bookingId);
    f._busy = false;
    closeM();
    toast("SPA marked as issued", "ok");
  } catch (err) {
    f._busy = false;
    toast(err instanceof ApiError ? err.message : "Could not mark SPA", "err");
    renderOverlay();
  }
}

async function bkdocsave(bookingId: string, category: string) {
  const f = eng.UI.mf;
  if (f._busy) return;
  if (!f.name) {
    f._e = { name: "Choose a file." };
    renderOverlay();
    return;
  }
  const name = String(f.name);
  f._busy = true;
  f._e = {};
  renderOverlay();
  try {
    const apiId = resolveBookingApiId(bookingId);
    await uploadBookingDocument(apiId, category, {
      file_name: name,
      storage_key: `bookings/${apiId}/${category}/${name}`,
      mime_type: name.toLowerCase().endsWith(".pdf") ? "application/pdf" : "image/jpeg",
      file_size: 1,
    });
    await refreshBooking(bookingId);
    f._busy = false;
    closeM();
    toast("Uploaded. Admin will review it", "ok");
  } catch (err) {
    f._busy = false;
    toast(err instanceof ApiError ? err.message : "Upload failed", "err");
    renderOverlay();
  }
}

async function resubsave(bookingId: string) {
  const f = eng.UI.mf;
  if (f._busy) return;
  if (!(f.txt || "").trim()) {
    f._e = { txt: "Tell Admin what changed." };
    renderOverlay();
    return;
  }
  f._busy = true;
  f._e = {};
  renderOverlay();
  try {
    await resubmitBooking(resolveBookingApiId(bookingId), { notes: String(f.txt).trim() });
    await refreshBooking(bookingId);
    f._busy = false;
    closeM();
    toast("Resubmitted for review", "ok");
  } catch (err) {
    f._busy = false;
    toast(err instanceof ApiError ? err.message : "Could not resubmit", "err");
    renderOverlay();
  }
}

async function bkapprove(bookingId: string) {
  const pf = eng.UI.pf;
  if (pf._busy) return;
  pf._busy = true;
  bump();
  try {
    await approveBooking(resolveBookingApiId(bookingId));
    await refreshBooking(bookingId);
    pf._busy = false;
    toast("Booking approved", "ok");
    render();
  } catch (err) {
    pf._busy = false;
    toast(err instanceof ApiError ? err.message : "Could not approve", "err");
    bump();
  }
}

async function chgsave(bookingId: string) {
  const f = eng.UI.mf;
  if (f._busy) return;
  const e: Record<string, string> = {};
  if (!(f.txt || "").trim()) e.txt = "Tell the agent what to fix.";
  if (Object.keys(e).length) {
    f._e = e;
    renderOverlay();
    return;
  }
  f._busy = true;
  f._e = {};
  renderOverlay();
  try {
    await requestBookingChanges(resolveBookingApiId(bookingId), { reason: String(f.txt).trim() });
    await refreshBooking(bookingId);
    f._busy = false;
    closeM();
    toast("Sent back for changes", "ok");
  } catch (err) {
    f._busy = false;
    toast(err instanceof ApiError ? err.message : "Could not request changes", "err");
    renderOverlay();
  }
}

async function rejsave(bookingId: string) {
  const f = eng.UI.mf;
  if (f._busy) return;
  if (!(f.txt || "").trim()) {
    f._e = { txt: "Give a reason." };
    renderOverlay();
    return;
  }
  f._busy = true;
  f._e = {};
  renderOverlay();
  try {
    await rejectBooking(resolveBookingApiId(bookingId), { reason: String(f.txt).trim() });
    await refreshBooking(bookingId);
    f._busy = false;
    closeM();
    toast("Booking rejected, unit released", "ok");
  } catch (err) {
    f._busy = false;
    toast(err instanceof ApiError ? err.message : "Could not reject", "err");
    renderOverlay();
  }
}

async function docdec(bookingId: string, category: string, decision: string) {
  const pf = eng.UI.pf;
  if (pf._busy) return;
  pf._busy = true;
  bump();
  try {
    await decideBookingDocument(resolveBookingApiId(bookingId), category, {
      decision: decision === "approved" ? "approved" : "rejected",
    });
    await refreshBooking(bookingId);
    pf._busy = false;
    toast(decision === "approved" ? "Document approved" : "Document rejected", "ok");
    render();
  } catch (err) {
    pf._busy = false;
    toast(err instanceof ApiError ? err.message : "Could not update document", "err");
    bump();
  }
}

async function docrej(bookingId: string, category: string) {
  const f = eng.UI.mf;
  if (f._busy) return;
  if (!(f.txt || "").trim()) {
    f._e = { txt: "Say what is wrong." };
    renderOverlay();
    return;
  }
  f._busy = true;
  f._e = {};
  renderOverlay();
  try {
    await decideBookingDocument(resolveBookingApiId(bookingId), category, {
      decision: "rejected",
      rejection_note: String(f.txt).trim(),
    });
    await refreshBooking(bookingId);
    f._busy = false;
    closeM();
    toast("Document rejected", "ok");
  } catch (err) {
    f._busy = false;
    toast(err instanceof ApiError ? err.message : "Could not reject document", "err");
    renderOverlay();
  }
}

async function bkclose(bookingId: string) {
  const pf = eng.UI.pf;
  if (pf._busy) return;
  pf._busy = true;
  bump();
  try {
    await closeBooking(resolveBookingApiId(bookingId));
    await refreshBooking(bookingId);
    pf._busy = false;
    toast("Booking closed. Commission created.", "ok");
    render();
  } catch (err) {
    pf._busy = false;
    toast(err instanceof ApiError ? err.message : "Could not close booking", "err");
    bump();
  }
}

async function paysave(bookingId: string) {
  const f = eng.UI.mf;
  if (f._busy) return;
  const b = eng.bkById(bookingId);
  if (!b?.miles?.length) {
    toast("No milestones on this booking", "err");
    return;
  }
  const pd = String(f.paid || "")
    .split(",")
    .map((x) => x === "1");
  f._busy = true;
  renderOverlay();
  try {
    for (let i = 0; i < b.miles.length; i++) {
      const m = b.miles[i];
      if (!m.id) continue;
      const wantPaid = !!pd[i];
      if (wantPaid === !!m.paid) continue;
      await updateBookingPayment(resolveBookingApiId(bookingId), {
        milestone_id: m.id,
        is_paid: wantPaid,
        paid_amount: wantPaid ? m.amt || undefined : 0,
      });
    }
    await refreshBooking(bookingId);
    f._busy = false;
    closeM();
    toast("Buyer payments updated", "ok");
  } catch (err) {
    f._busy = false;
    toast(err instanceof ApiError ? err.message : "Could not update payments", "err");
    renderOverlay();
  }
}

async function withCommission(
  bookingId: string,
  fn: (commissionId: string | number) => Promise<void>,
  opts?: { modal?: boolean },
) {
  const busyBag = opts?.modal ? eng.UI.mf : eng.UI.pf;
  if (busyBag._busy) return;
  const b = eng.bkById(bookingId);
  let cid = b?.commissionId;
  if (!cid) {
    // Try resolve from commission list by booking
    try {
      const list = await listCommissions();
      const hit = (list.data || []).find(
        (c) => c.booking_id === b?.apiId || c.booking_code === b?.id || c.booking_code === bookingId,
      );
      if (hit) {
        applyCommissionToBooking(hit);
        cid = hit.id;
      }
    } catch {
      /* fall through */
    }
  }
  if (!cid) {
    toast("No commission record for this booking yet", "err");
    return;
  }
  busyBag._busy = true;
  if (opts?.modal) renderOverlay();
  else bump();
  try {
    await fn(cid);
    try {
      const res = await getCommission(cid);
      if (res.success && res.data) applyCommissionToBooking(res.data);
    } catch {
      /* ignore */
    }
    busyBag._busy = false;
    bump();
  } catch (err) {
    busyBag._busy = false;
    if (opts?.modal) renderOverlay();
    else bump();
    throw err;
  }
}

/** Resolve developer name → API PK (create if missing). */
async function resolveDeveloperId(name: string): Promise<number> {
  const trimmed = name.trim();
  const listed = await listDevelopers();
  const items = Array.isArray(listed.data) ? listed.data : [];
  const hit = items.find(
    (d) => String(d.name || "").trim().toLowerCase() === trimmed.toLowerCase(),
  );
  if (hit?.id != null) return Number(hit.id);

  const created = await createDeveloper({ name: trimmed });
  if (!created.success || created.data?.id == null) {
    throw new ApiError(
      created.message || "Could not create developer.",
      "VALIDATION_ERROR",
      { developer: ["Could not create developer."] },
      400,
    );
  }
  return Number(created.data.id);
}

async function projsave(projectId?: string) {
  const f = eng.UI.mf;
  if (f._busy) return;
  const e: Record<string, string> = {};
  ["name", "dev", "area", "plan"].forEach((k) => {
    if (!(f[k] || "").trim()) e[k] = "Required.";
  });
  if (!(+f.comm > 0 && +f.comm <= 15)) e.comm = "Between 0 and 15.";
  if (!(+f.rel >= 0 && +f.rel <= 100)) e.rel = "Between 0 and 100.";
  if (Object.keys(e).length) {
    f._e = e;
    renderOverlay();
    return;
  }

  f._busy = true;
  f._e = {};
  renderOverlay();

  try {
    const developerId = await resolveDeveloperId(String(f.dev));
    const community = String(f.area).trim();
    const ho = String(f.ho || "").trim();
    // Prefer API schema used by GET detail (community, property_type, rera_project_number, …).
    const payload = {
      name: String(f.name).trim(),
      developer: developerId,
      community,
      city: String(f.city || "Dubai"),
      country: "UAE",
      property_type: String(f.type || "Apartment"),
      status: String(f.status || "Launched"),
      handover_quarter: ho,
      payment_plan: String(f.plan).trim(),
      commission_percent: +f.comm,
      release_threshold_percent: +f.rel,
      rera_project_number: String(f.rera || "").trim(),
      description: String(f.desc || "").trim(),
      priority: !!f.pri,
      is_active: f.active !== false && f.active !== "0" && f.active !== "",
    };

    if (projectId) {
      const res = await updateProject(resolveProjectApiId(projectId), payload as any);
      if (res.success && res.data) upsertUiProject(res.data);
      f._busy = false;
      closeM();
      toast("Project updated", "ok");
      render();
    } else {
      const res = await createProject(payload as any);
      f._busy = false;
      if (res.success && res.data) {
        const mapped = upsertUiProject(res.data);
        closeM();
        toast("Project created. Add its units next", "ok");
        go("admin-project-" + mapped.id);
      } else {
        f._e = { name: res.message || "Could not create project." };
        renderOverlay();
      }
    }
  } catch (err) {
    f._busy = false;
    const fe = fieldErrors(err);
    f._e = {
      ...(fe.developer ? { dev: fe.developer } : {}),
      ...(fe.community ? { area: fe.community } : {}),
      ...(fe.name ? { name: fe.name } : {}),
    };
    if (!Object.keys(f._e).length) {
      f._e = { name: err instanceof ApiError ? err.message : "Could not save project." };
    }
    renderOverlay();
  }
}

async function unitsave(projectId: string, unitId?: string) {
  const f = eng.UI.mf;
  if (f._busy) return;
  const e: Record<string, string> = {};
  if (!unitId && !(f.id || "").trim()) e.id = "Enter a unit number.";
  if (!(f.type || "").trim()) e.type = "Choose a type.";
  if (!(+f.size > 0)) e.size = "Enter the size.";
  if (!(+f.price > 0)) e.price = "Enter the price.";
  if (Object.keys(e).length) {
    f._e = e;
    renderOverlay();
    return;
  }
  f._busy = true;
  f._e = {};
  renderOverlay();
  try {
    const payload = {
      unit_number: String(f.id || unitId || "").trim(),
      unit_type: String(f.type).trim(),
      size_sqft: +f.size,
      price: +f.price,
      status: f.off ? "Sold" : undefined,
    };
    if (unitId) {
      const unitApiId = resolveUnitApiId(projectId, unitId);
      const res = await updateUnit(unitApiId, {
        unit_type: payload.unit_type,
        size_sqft: payload.size_sqft,
        price: payload.price,
      });
      f._busy = false;
      if (res.success) {
        await refreshProject(projectId);
        closeM();
        toast("Unit updated", "ok");
        render();
      } else {
        f._e = { type: res.message || "Could not update unit." };
        renderOverlay();
      }
      return;
    }
    const res = await createUnit(resolveProjectApiId(projectId), {
      unit_number: payload.unit_number,
      unit_type: payload.unit_type,
      size_sqft: payload.size_sqft,
      price: payload.price,
      status: "Available",
    });
    f._busy = false;
    if (res.success) {
      await refreshProject(projectId);
      closeM();
      toast("Unit added", "ok");
      render();
    } else {
      f._e = { id: res.message || "Could not save unit." };
      renderOverlay();
    }
  } catch (err) {
    f._busy = false;
    const fe = fieldErrors(err);
    f._e = {
      ...(fe.unit_number ? { id: fe.unit_number } : {}),
      ...(fe.unit_type ? { type: fe.unit_type } : {}),
      ...(fe.size_sqft ? { size: fe.size_sqft } : {}),
      ...(fe.price ? { price: fe.price } : {}),
    };
    if (!Object.keys(f._e).length) {
      const msg = err instanceof ApiError ? err.message : "Could not save unit.";
      f._e = { [unitId ? "type" : "id"]: msg };
    }
    renderOverlay();
  }
}

async function holdrel(projectId: string, unitId: string) {
  const f = eng.UI.mf;
  if (f._busy) return;
  f._busy = true;
  renderOverlay();
  try {
    const unitApiId = resolveUnitApiId(projectId, unitId);
    await releaseUnitHold(unitApiId);
    await refreshProject(projectId);
    f._busy = false;
    closeM();
    toast("Hold released", "ok");
    render();
  } catch (err) {
    f._busy = false;
    toast(err instanceof ApiError ? err.message : "Could not release hold", "err");
    renderOverlay();
  }
}

async function availDecide(requestId: string, status: "confirmed" | "rejected") {
  const pf = eng.UI.pf;
  if (pf._busy) return;
  const f = eng.UI.mf;
  const notes = String(f[`availnote_${requestId}`] || pf[`availnote_${requestId}`] || f.txt || "").trim() || undefined;
  pf._busy = true;
  bump();
  try {
    await decideAvailabilityRequest(requestId, { status, notes });
    pf._busy = false;
    toast(status === "confirmed" ? "Availability confirmed" : "Request rejected", "ok");
    bump();
  } catch (err) {
    pf._busy = false;
    toast(err instanceof ApiError ? err.message : "Could not decide", "err");
    bump();
  }
}

export function installPropertySalesApiOverrides(): void {
  const A = actions();

  A.shortsave = (a) => {
    void shortsave(a[0]);
  };
  A.availsave = (a) => {
    void availsave(a[0], a[1]);
  };
  A.booksave = () => {
    void booksave();
  };
  A.spasave = (a) => {
    void spasave(a[0]);
  };
  A.bkdocsave = (a) => {
    void bkdocsave(a[0], a[1]);
  };
  A.resubsave = (a) => {
    void resubsave(a[0]);
  };
  A.bkapprove = (a) => {
    void bkapprove(a[0]);
  };
  A.chgsave = (a) => {
    void chgsave(a[0]);
  };
  A.rejsave = (a) => {
    void rejsave(a[0]);
  };
  A.docdec = (a) => {
    void docdec(a[0], a[1], a[2] || "approved");
  };
  A.docrej = (a) => {
    void docrej(a[0], a[1]);
  };
  A.bkclose = (a) => {
    void bkclose(a[0]);
  };
  A.paysave = (a) => {
    void paysave(a[0]);
  };
  A.devinv = (a) => {
    void withCommission(a[0], async (cid) => {
      await markDeveloperInvoiced(cid);
      toast("Marked as invoiced", "ok");
    }).catch((err) => {
      toast(err instanceof ApiError ? err.message : "Could not mark invoiced", "err");
    });
  };
  A.devrec = (a) => {
    void withCommission(a[0], async (cid) => {
      await markDeveloperReceived(cid);
      toast("Marked as received", "ok");
    }).catch((err) => {
      toast(err instanceof ApiError ? err.message : "Could not mark received", "err");
    });
  };
  A.commrel = (a) => {
    void withCommission(
      a[0],
      async (cid) => {
        await releaseCommission(cid);
        closeM();
        toast("Incentive released", "ok");
      },
      { modal: true },
    ).catch((err) => {
      toast(err instanceof ApiError ? err.message : "Could not release", "err");
    });
  };
  A.adjsave = (a) => {
    const f = eng.UI.mf;
    const e: Record<string, string> = {};
    if (f.amt === "" || Number.isNaN(+f.amt)) e.amt = "Enter a number.";
    if (!(f.txt || "").trim()) e.txt = "A reason is required.";
    if (Object.keys(e).length) {
      f._e = e;
      renderOverlay();
      return;
    }
    void withCommission(
      a[0],
      async (cid) => {
        await adjustCommission(cid, {
          adjustment_amount: f.amt,
          adjustment_note: String(f.txt).trim(),
        });
        closeM();
        toast("Adjustment saved", "ok");
      },
      { modal: true },
    ).catch((err) => {
      toast(err instanceof ApiError ? err.message : "Could not adjust", "err");
    });
  };
  A.projsave = (a) => {
    void projsave(a[0]);
  };
  A.unitsave = (a) => {
    void unitsave(a[0], a[1]);
  };
  A.holdrel = (a) => {
    void holdrel(a[0], a[1]);
  };
  A.availconfirm = (a) => {
    void availDecide(a[0], "confirmed");
  };
  A.availreject = (a) => {
    void availDecide(a[0], "rejected");
  };
  A.slabssave = () => {
    void (async () => {
      const f = eng.UI.mf;
      if (f._busy) return;
      f._busy = true;
      renderOverlay();
      try {
        await upsertSlabs({
          agent_id: numId(f.agent),
          plan_name: String(f.name || "Agent plan"),
          tiers: Array.isArray(f.tiers) ? f.tiers : [],
        });
        f._busy = false;
        closeM();
        toast("Slab plan saved", "ok");
      } catch (err) {
        f._busy = false;
        toast(err instanceof ApiError ? err.message : "Could not save slabs", "err");
        renderOverlay();
      }
    })();
  };
}
