/** Headers required by workspace / rules-engine / inactivity write APIs. */

export function newIdempotencyKey(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `idem-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

/** Workspace + rules writes need Idempotency-Key + X-Ownership-Cycle. */
export function workspaceMutationHeaders(ownershipCycle: string | null | undefined) {
  const headers: Record<string, string> = {
    "Idempotency-Key": newIdempotencyKey(),
  };
  if (ownershipCycle) headers["X-Ownership-Cycle"] = String(ownershipCycle);
  return headers;
}

/** Inactivity policy POST/PATCH need Idempotency-Key only. */
export function policyMutationHeaders() {
  return { "Idempotency-Key": newIdempotencyKey() };
}
