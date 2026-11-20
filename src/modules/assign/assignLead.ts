/** Actions + modal definition for the Admin "Assign lead" drawer (see AssignLeadModal.tsx). */
import { actions, eng, mdef, renderOverlay } from "../../engine";

export function installAssignLeadOverrides(): void {
  mdef("assign-lead", {
    role: "admin",
    init: () => ({ scope: "unassigned", q: "", lids: "", tgt: "agent", tm: "", to: "", why: "" }),
  });

  const A = actions();
  const origReassign = A.reassave;

  /** args: [leadId] - tick / untick a lead in the picker. */
  A.alpick = (a: string[]) => {
    const f = eng.UI.mf;
    const ids = String(f.lids || "").split(",").filter(Boolean);
    const i = ids.indexOf(a[0]);
    if (i >= 0) ids.splice(i, 1);
    else ids.push(a[0]);
    f.lids = ids.join(",");
    if (f._e) delete f._e.lids;
    renderOverlay();
  };

  const bulk = (pool: boolean) => {
    const f = eng.UI.mf;
    const ids = String(f.lids || "").split(",").filter(Boolean);
    const e: Record<string, string> = {};
    if (!ids.length) e.lids = "Pick at least one lead.";
    if (pool) f.to = "pool";
    if (pool && ids.length > 1) e.to = "Returning to the Admin pool works one lead at a time.";
    else if (!f.to) e.to = f.tgt === "team" ? "Choose a team queue." : "Choose an agent.";
    if (!String(f.why || "").trim()) e.why = "Add a reason.";
    if (Object.keys(e).length) {
      f._e = e;
      renderOverlay();
      return;
    }
    // A single lead going back to the Admin pool uses the normal single-lead save.
    if (pool) {
      origReassign([ids[0]]);
      return;
    }
    // Reuse the bulk assignment (capacity checks, history, audit, toast).
    eng.UI.f.sel = ids.join(",");
    A.bulksave([]);
  };

  A.alsave = () => bulk(false);

  /** Reassign / Assign drawer (admin): only the opened lead ticked -> the normal single-lead save; otherwise bulk. args: [leadId] */
  A.reassave2 = (a: string[]) => {
    const f = eng.UI.mf;
    const ids = String(f.lids || a[0]).split(",").filter(Boolean);
    if (ids.length === 1 && ids[0] === a[0]) {
      origReassign(a);
      return;
    }
    bulk(f.tgt === "pool");
  };
}
