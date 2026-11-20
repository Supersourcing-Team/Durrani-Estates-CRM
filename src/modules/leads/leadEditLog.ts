/**
 * Every lead edit (details, qualification, shortlist) is written to the lead timeline and the
 * audit log (client-side; the engine keeps both). The timeline entry is intentionally not flagged
 * `_pending`, so it survives timeline re-hydration even if the server does not log the edit.
 */
import { eng } from "../../engine";

export function logLeadEdit(
  leadId: string,
  summary: string,
  before: string,
  after: string,
  action = "Lead details edited",
): void {
  const l = eng.leadById(leadId);
  if (!l) return;
  eng.addEv(l, "sys", summary);
  eng.audit(action, "LEAD-" + l.id, before, after);
}

/** "label: old → new" diff helper; returns only the fields that changed. */
export function diffFields(
  rows: Array<[label: string, before: unknown, after: unknown]>,
): { text: string; before: string; after: string; count: number } {
  const norm = (v: unknown) => (v == null || v === "" ? "not set" : String(v));
  const changed = rows.filter(([, b, a]) => norm(b) !== norm(a));
  return {
    count: changed.length,
    text: changed.map(([l, b, a]) => `${l}: ${norm(b)} → ${norm(a)}`).join("; "),
    before: changed.map(([l, b]) => `${l}: ${norm(b)}`).join("; "),
    after: changed.map(([l, , a]) => `${l}: ${norm(a)}`).join("; "),
  };
}
