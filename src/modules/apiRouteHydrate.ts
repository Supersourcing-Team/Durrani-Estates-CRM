/**
 * Silently load Module 2/3/4 API data into eng.S when routes change.
 * Existing screens keep their original UI and read from eng as before.
 */
import { eng, bump, parse, hashOf } from "../engine";
import { getLead, listLeads } from "../http/leads";
import { getProject, listProjectUnits, listProjects, listShortlist } from "../http/catalogue";
import { getBooking, listBookings } from "../http/deals";
import { getCommission, listCommissions } from "../http/commission";
import { getSettings } from "../http/settings";
import { getCnApplication, getCnNote, listCnApplications, listCnNotes } from "../http/convertibleNotes";
import { upsertUiLead, upsertUiLeads } from "./leads/leadMapper";
import {
  hydrateInactivityPolicies,
  hydrateLeadWorkspace,
} from "./leads/workspaceBootstrap";
import {
  applyCommissionToBooking,
  applyShortlistToLead,
  upsertUiBooking,
  upsertUiBookings,
  upsertUiProject,
  upsertUiProjects,
  resolveBookingApiId,
} from "./deals/propertyMappers";
import {
  applyOrgSettings,
  resolveCnNoteApiId,
  upsertCnApplication,
  upsertCnApplications,
  upsertCnNote,
  upsertCnNotes,
} from "./notes/cnMappers";

let lastKey = "";
let inflight: Promise<void> | null = null;

async function hydrate(hash: string) {
  const r = parse(hash);
  if (!r || !eng.S?.session) return;

  const key = r.key;
  const p = r.params || [];
  const routeKey = `${key}|${p.join("-")}|${JSON.stringify(eng.UI?.f || {})}`;
  if (routeKey === lastKey) return;
  lastKey = routeKey;

  try {
    // ---- Leads ----
    if (key === "agent-leads" || key === "mgmt-leads" || key === "admin-leads") {
      const f = eng.UI.f || {};
      const lv =
        key === "admin-leads"
          ? f.alv || "all"
          : key === "mgmt-leads"
            ? f.mv || "all"
            : f.lv || "all";
      const lq = key === "admin-leads" ? f.alq : key === "mgmt-leads" ? f.mq2 : f.lq;
      const lt = key === "agent-leads" ? f.lt : undefined;
      const lk = key === "agent-leads" ? f.lk : key === "mgmt-leads" ? f.mt2 : undefined;
      const ls = key === "agent-leads" ? f.ls : undefined;
      const res = await listLeads({
        lv: ["all", "today", "overdue", "risk", "hot", "fresh", "archived"].includes(lv)
          ? lv
          : "all",
        lq: lq || undefined,
        lt: lt && lt !== "all" ? lt : undefined,
        lk: lk && lk !== "all" ? lk : undefined,
        ls: ls === "new" ? "newest" : ls === "old" ? "oldest" : ls || "prio",
        page: 1,
        page_size: 100,
      });
      upsertUiLeads(res.data);
      bump();
      return;
    }

    if (key === "agent-lead" || key === "mgmt-lead" || key === "admin-lead") {
      const id = p[0];
      if (!id) return;
      const res = await getLead(id);
      if (res.success && res.data) {
        upsertUiLead(res.data);
        try {
          const sl = await listShortlist({ lead_id: id });
          if (sl.success && sl.data) applyShortlistToLead(id, sl.data);
        } catch {
          /* shortlist optional */
        }
        try {
          await hydrateLeadWorkspace(id);
        } catch {
          /* workspace optional */
        }
        bump();
      }
      return;
    }

    // ---- Catalogue ----
    if (key === "agent-catalogue" || key === "mgmt-projects" || key === "admin-projects") {
      const f = eng.UI.f || {};
      const res = await listProjects({
        q: f.pq || undefined,
        type: f.pt && f.pt !== "all" ? f.pt : undefined,
        city: f.pc && f.pc !== "all" ? f.pc : undefined,
      });
      upsertUiProjects(res.data);
      bump();
      return;
    }

    if (key === "agent-project" || key === "mgmt-project" || key === "admin-project") {
      const id = p[0];
      if (!id) return;
      const res = await getProject(id);
      if (res.success && res.data) {
        let project = res.data;
        if (!Array.isArray(project.units) || !project.units.length) {
          try {
            const units = await listProjectUnits(id);
            if (units.success && units.data?.length) {
              project = { ...project, units: units.data };
            }
          } catch {
            /* optional */
          }
        }
        upsertUiProject(project);
      }

      // Who is working — bookings for this project
      try {
        const bk = await listBookings({ project_id: id, page_size: 100 });
        const items = (bk.data || []).filter((b) => String(b.project_id) === String(id));
        if (items.length) upsertUiBookings(items);
      } catch {
        /* optional */
      }

      // Who is working — shortlist is lead-scoped only (lead_id required).
      // Refresh shortlists for leads already tied to this project via bookings / local data.
      try {
        const S = eng.S as any;
        const leadIds = new Set<string>();
        (S.bookings || [])
          .filter((b: any) => String(b.project) === String(id))
          .forEach((b: any) => b.lead && leadIds.add(String(b.lead)));
        (S.leads || [])
          .filter((l: any) => (l.shortlist || []).some((s: any) => String(s.p) === String(id)))
          .forEach((l: any) => leadIds.add(String(l.id)));
        for (const lid of [...leadIds].slice(0, 25)) {
          try {
            const one = await listShortlist({ lead_id: lid });
            if (one.success && one.data) applyShortlistToLead(lid, one.data);
          } catch {
            /* skip */
          }
        }
      } catch {
        /* optional */
      }

      bump();
      return;
    }

    // ---- Bookings ----
    if (key === "agent-bookings" || key === "mgmt-bookings" || key === "admin-review") {
      const res = await listBookings();
      upsertUiBookings(res.data);
      bump();
      return;
    }

    if (key === "agent-booking" || key === "mgmt-booking" || key === "admin-booking") {
      const code = eng.bkF(p[0]);
      const local = eng.bkById(code);
      const apiId = resolveBookingApiId(local || code);
      const res = await getBooking(apiId);
      if (res.success && res.data) {
        upsertUiBooking(res.data);
        bump();
      }
      return;
    }

    // ---- Commission ----
    if (key === "admin-commission") {
      const res = await listCommissions();
      (res.data || []).forEach(applyCommissionToBooking);
      bump();
      return;
    }

    if (key === "admin-comm") {
      const code = eng.bkF(p[0]);
      const b = eng.bkById(code);
      if (b?.commissionId) {
        const res = await getCommission(b.commissionId);
        if (res.success && res.data) {
          applyCommissionToBooking(res.data);
          bump();
        }
      } else {
        const res = await listCommissions();
        (res.data || []).forEach(applyCommissionToBooking);
        bump();
      }
      return;
    }

    // ---- Module 4: Org settings + inactivity policies ----
    if (key === "admin-settings" || key.startsWith("admin-settings")) {
      try {
        const res = await getSettings();
        if (res.success && res.data) applyOrgSettings(res.data);
      } catch {
        /* optional */
      }
      await hydrateInactivityPolicies();
      bump();
      return;
    }

    // ---- Module 4: Convertible Notes ----
    if (key === "agent-cn" || key === "mgmt-cn" || key === "admin-cn") {
      const [apps, notes] = await Promise.all([listCnApplications(), listCnNotes()]);
      upsertCnApplications(apps.data || []);
      upsertCnNotes(notes.data || []);
      bump();
      return;
    }

    if (key === "agent-cncalc" || key === "admin-settings-cn") {
      const res = await getSettings();
      if (res.success && res.data) {
        applyOrgSettings(res.data);
        bump();
      }
      return;
    }

    if (key === "agent-cnapp" || key === "mgmt-cnapp" || key === "admin-cnapp") {
      const leadId = p[0];
      if (!leadId) return;
      try {
        const leadRes = await getLead(leadId);
        if (leadRes.success && leadRes.data) upsertUiLead(leadRes.data);
      } catch {
        /* optional */
      }
      const listed = await listCnApplications({ lead_id: leadId });
      const hit = (listed.data || [])[0];
      if (hit) {
        const detail = await getCnApplication(hit.id);
        if (detail.success && detail.data) upsertCnApplication(detail.data);
        else upsertCnApplication(hit);
      }
      bump();
      return;
    }

    if (key === "agent-cnnote" || key === "mgmt-cnnote" || key === "admin-cnnote") {
      const slug = p[0];
      const code = eng.noteF(slug);
      const local = eng.noteById(code);
      const apiId = resolveCnNoteApiId(local || code);
      const res = await getCnNote(apiId);
      if (res.success && res.data) {
        upsertCnNote(res.data);
        bump();
      }
      return;
    }

    // Warm settings once after login-ish routes already covered; also when opening home
    if (key === "agent-home" || key === "mgmt-home" || key === "admin-home") {
      try {
        const res = await getSettings();
        if (res.success && res.data) applyOrgSettings(res.data);
      } catch {
        /* optional */
      }
    }
  } catch {
    /* keep prototype/local data if API unavailable */
  }
}

function run() {
  const h = hashOf();
  inflight = hydrate(h).finally(() => {
    inflight = null;
  });
}

/** Call once after auth/session is ready. */
export function installApiRouteHydration(): void {
  window.addEventListener("hashchange", () => {
    lastKey = "";
    run();
  });
  run();
  // Pick up filter pill / search changes (UI.f) without editing screen components.
  setInterval(() => {
    if (!eng.S?.session) return;
    const h = hashOf();
    const r = parse(h);
    if (!r) return;
    if (
      [
        "agent-leads",
        "mgmt-leads",
        "admin-leads",
        "agent-catalogue",
        "mgmt-projects",
        "admin-projects",
      ].includes(r.key)
    ) {
      void hydrate(h);
    }
  }, 800);
}
