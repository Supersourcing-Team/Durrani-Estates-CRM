/* Shared live password checklist (invite + reset screens). */
import React from "react";
import { Icon } from "../../ui";

function Ck({ ok, t }: { ok: boolean; t: string }) {
  return (
    <div className={"ck " + (ok ? "ok" : "no")}>
      <Icon n={ok ? "check" : "x"} s={14} />
      {t}
    </div>
  );
}

export function PasswordRules({ password }: { password: string }) {
  const pw = String(password || "");
  return (
    <div className="col" style={{ gap: 4 }}>
      <Ck ok={pw.length >= 8} t="At least 8 characters" />
      <Ck ok={/[A-Za-z]/.test(pw)} t="Contains a letter" />
      <Ck ok={/\d/.test(pw)} t="Contains a number" />
    </div>
  );
}
