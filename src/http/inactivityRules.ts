import { api } from "./axios";
import { apiEndpoints } from "./apiEndpoint";
import { policyMutationHeaders } from "./mutationHeaders";
import type { ApiResponse } from "./types";

export type TrackType = "property" | "cn" | "secondary" | string;

export interface InactivityPolicy {
  id: number;
  track: TrackType;
  inactivity_days: number | null;
  grace_days: number | null;
  enabled: boolean;
  version?: number;
  effective_from?: string;
  updated_at?: string;
  [key: string]: unknown;
}

export interface InactivityPolicyPayload {
  track: TrackType;
  inactivity_days: number;
  grace_days: number;
  enabled?: boolean;
}

function asList(data: unknown): InactivityPolicy[] {
  if (Array.isArray(data)) return data as InactivityPolicy[];
  if (data && typeof data === "object") {
    const o = data as Record<string, unknown>;
    if (Array.isArray(o.results)) return o.results as InactivityPolicy[];
    if (Array.isArray(o.items)) return o.items as InactivityPolicy[];
    if (Array.isArray(o.policies)) return o.policies as InactivityPolicy[];
  }
  return [];
}

export async function listInactivityPolicies() {
  const { data } = await api.get<ApiResponse<InactivityPolicy[]>>(
    apiEndpoints.settings.inactivityRules,
  );
  return { items: asList(data.data), raw: data };
}

export async function createInactivityPolicy(payload: InactivityPolicyPayload) {
  const { data } = await api.post<ApiResponse<InactivityPolicy>>(
    apiEndpoints.settings.inactivityRules,
    { enabled: true, ...payload },
    { headers: policyMutationHeaders() },
  );
  return data.data;
}

export async function updateInactivityPolicy(
  id: string | number,
  payload: Partial<Omit<InactivityPolicyPayload, "track">> & { enabled?: boolean },
) {
  const { data } = await api.patch<ApiResponse<InactivityPolicy>>(
    apiEndpoints.settings.inactivityRuleById(id),
    payload,
    { headers: policyMutationHeaders() },
  );
  return data.data;
}

/** Upsert property/cn/secondary with the same X/Y days from Admin Settings. */
export async function upsertInactivityPolicies(params: {
  inactivity_days: number;
  grace_days: number;
  enabled?: boolean;
  tracks?: TrackType[];
}) {
  const tracks = params.tracks ?? ["property", "cn", "secondary"];
  const { items } = await listInactivityPolicies();
  const byTrack = new Map(items.map((p) => [String(p.track).toLowerCase(), p]));
  const results: InactivityPolicy[] = [];

  for (const track of tracks) {
    const existing = byTrack.get(String(track).toLowerCase());
    if (existing?.id != null) {
      results.push(
        await updateInactivityPolicy(existing.id, {
          inactivity_days: params.inactivity_days,
          grace_days: params.grace_days,
          enabled: params.enabled ?? true,
        }),
      );
    } else {
      results.push(
        await createInactivityPolicy({
          track,
          inactivity_days: params.inactivity_days,
          grace_days: params.grace_days,
          enabled: params.enabled ?? true,
        }),
      );
    }
  }
  return results;
}

/** Prefer enabled property policy for local inactX / inactY mirrors. */
export function pickPrimaryPolicy(items: InactivityPolicy[]): InactivityPolicy | null {
  const enabled = items.filter((p) => p.enabled && p.inactivity_days != null);
  return (
    enabled.find((p) => String(p.track).toLowerCase() === "property") ||
    enabled[0] ||
    items.find((p) => String(p.track).toLowerCase() === "property") ||
    items[0] ||
    null
  );
}
