/* Shared bits for public auth screens (login, invite, reset). */
import React from "react";
import { eng, bump } from "../../engine";
import { Icon } from "../../ui";

export function EyeIcon({ off }: { off: boolean }) {
  return off ? (
    <svg
      viewBox="0 0 24 24"
      width={18}
      height={18}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.53 13.53 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
      <line x1="2" x2="22" y1="2" y2="22" />
    </svg>
  ) : (
    <Icon n="eye" s={18} />
  );
}

export function setPf(k: string, v: unknown) {
  const UI = eng.UI;
  UI.pf[k] = v;
  if (UI.pf._e) delete UI.pf._e[k];
  bump();
}

export function AuthHelp() {
  return (
    <p className="auth-help">
      Need help? <a href="mailto:support@durraniestates.com">Contact support</a>
    </p>
  );
}
