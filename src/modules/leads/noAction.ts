/**
 * "No action" leads: an owned, non-archived lead whose agent has done nothing on it
 * (call, meeting, note, message, document, stage change) for N days or more.
 * N is Settings -> Lead rules -> "Days with no action" (S.set.noActDays, default 2).
 */
import { eng } from "../../engine";

const WORK_KINDS = new Set(["call", "meet", "note", "wa", "doc", "stage", "mail"]);

export function noActionThreshold(): number {
  const n = Number(eng.S.set.noActDays);
  return Number.isFinite(n) && n >= 1 ? n : 2;
}

/** Time (ms) of the last thing the agent did on the lead. */
export function lastWorkAt(l: any): number {
  let t = 0;
  (l.ev || []).forEach((e: any) => {
    if (e && WORK_KINDS.has(e.k) && Number(e.t) > t) t = Number(e.t);
  });
  (l.calls || []).forEach((c: any) => {
    if (c && Number(c.t) > t) t = Number(c.t);
  });
  return Math.max(t, Number(l.lastCommit) || 0, Number(l.assigned) || 0, Number(l.created) || 0);
}

/** Whole days since the last action; 0 for unowned or archived leads. */
export function noActionDays(l: any): number {
  if (!l.owner || l.archived) return 0;
  const t = lastWorkAt(l);
  return t ? Math.max(0, eng.daysBetween(t, eng.NOW())) : 0;
}

export function isNoAction(l: any): boolean {
  return !!l.owner && !l.archived && noActionDays(l) >= noActionThreshold();
}
