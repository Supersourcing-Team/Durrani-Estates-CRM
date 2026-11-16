/**
 * Normalize invite / reset deep links into hash routes.
 *
 * Backend emails currently look like:
 *   https://<host>/accept-invite?token=<uuid>
 *
 * This app uses hash routes:
 *   #invite-<uuid>
 *   #login-reset-<uuid>
 */
export function normalizeAuthDeepLinks(): boolean {
  const path = location.pathname.replace(/\/+$/, "") || "/";
  const params = new URLSearchParams(location.search);
  const token = (params.get("token") || "").trim();

  if (!token) return false;

  const invitePaths = ["/accept-invite", "/invite", "/auth/accept-invite", "/auth/invite"];
  const resetPaths = ["/reset-password", "/auth/reset-password", "/login-reset"];

  let nextHash: string | null = null;
  if (invitePaths.includes(path)) nextHash = `#invite-${token}`;
  else if (resetPaths.includes(path)) nextHash = `#login-reset-${token}`;

  if (!nextHash) return false;

  // Drop path/query so Vite SPA stays on / with a hash route.
  history.replaceState(null, "", `/${nextHash}`);
  return true;
}
