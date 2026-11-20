/**
 * Lead sources for the "Add a lead" form (lead_source_id is required by POST /v1/leads/).
 * The list endpoint is not in the API doc yet, so the known candidates are tried in order and the
 * first one that answers is remembered. Sources seen on lead detail payloads are added too.
 */
import { api } from "./axios";
import { apiEndpoints } from "./apiEndpoint";

export type LeadSourceOpt = { id: number; name: string; source_type?: string };

const known = new Map<number, LeadSourceOpt>();
let listed = false;
let inflight: Promise<LeadSourceOpt[]> | null = null;

function pickList(body: any): any[] {
  if (Array.isArray(body)) return body;
  if (Array.isArray(body?.data)) return body.data;
  if (Array.isArray(body?.data?.results)) return body.data.results;
  if (Array.isArray(body?.results)) return body.results;
  return [];
}

/** Remember a source seen anywhere (lead detail payloads carry lead_source {id, name}). */
export function rememberLeadSource(s: { id?: unknown; name?: unknown; source_type?: unknown } | null | undefined) {
  const id = Number(s?.id);
  if (!s || !Number.isFinite(id) || !s.name) return;
  known.set(id, { id, name: String(s.name), source_type: s.source_type ? String(s.source_type) : undefined });
}

export function leadSourceOptions(): LeadSourceOpt[] {
  return [...known.values()].sort((a, b) => a.name.localeCompare(b.name));
}

/** Resolve the form value (an id, or a name from the fallback list) to a lead_source_id. */
export function resolveLeadSourceId(v: unknown): number | null {
  const n = Number(v);
  if (Number.isFinite(n) && known.has(n)) return n;
  const name = String(v || "").trim().toLowerCase();
  if (!name) return null;
  const hit = [...known.values()].find((s) => s.name.toLowerCase() === name);
  return hit ? hit.id : null;
}

export async function loadLeadSources(): Promise<LeadSourceOpt[]> {
  if (listed) return leadSourceOptions();
  if (inflight) return inflight;
  inflight = (async () => {
    for (const url of apiEndpoints.leadSources.candidates) {
      try {
        const { data } = await api.get(url, { params: { page_size: 200 } });
        const items = pickList(data);
        if (!items.length) continue;
        items.forEach(rememberLeadSource);
        listed = true;
        break;
      } catch {
        /* try the next candidate */
      }
    }
    inflight = null;
    return leadSourceOptions();
  })();
  return inflight;
}
