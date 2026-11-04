/*
 * L03 Set password from invite link (route #invite-{token}).
 * Wired to GET /v1/auth/invite/{token}/ + POST /v1/auth/accept-invite/.
 */
import React, { useEffect, useState } from "react";
import { eng, bump, go, render } from "../../engine";
import { Bn, Btn, Empty, Fld, PfInput, pv } from "../../ui";
import type { ScreenComp } from "../../app/types";
import { LoginFrame } from "./LoginFrame";
import { PasswordRules } from "./PasswordRules";
import {
  acceptInviteWithApi,
  apiErrorToForm,
  loadInviteToken,
  mapApiRole,
  roleLabel,
  routeToken,
} from "../session";
import { passwordHint } from "../password";
import type { InviteValidateData } from "../../http/types";

type LoadState =
  | { status: "loading" }
  | { status: "ok"; data: InviteValidateData }
  | { status: "err"; message: string; used?: boolean };

async function submitAccept(token: string, invite: InviteValidateData) {
  const UI = eng.UI;
  if (UI.pf._busy) return;

  const pw = String(pv("npw") || "");
  const cf = String(pv("ncf") || "");
  const e: Record<string, string> = {};
  const hint = passwordHint(pw);
  if (hint) e.npw = hint;
  if (cf !== pw) e.ncf = "The two passwords do not match.";
  if (Object.keys(e).length) {
    UI.pf._e = e;
    render();
    return;
  }

  UI.pf._busy = true;
  UI.pf._e = {};
  bump();

  try {
    await acceptInviteWithApi({
      token,
      password: pw,
      first_name: invite.first_name,
      last_name: invite.last_name,
    });
    UI.pf._busy = false;
    UI.pf = {
      _m: `Password set. Sign in with ${invite.email}.`,
      _mk: "ok",
    };
    go("login");
  } catch (err) {
    const mapped = apiErrorToForm(err);
    UI.pf._busy = false;
    UI.pf._e = {
      ...(mapped.fields.password ? { npw: mapped.fields.password } : {}),
      ...(mapped.fields.npw ? { npw: mapped.fields.npw } : {}),
    };
    UI.pf._m = mapped.message || null;
    UI.pf._mk = "err";
    render();
  }
}

export const Invite: ScreenComp = ({ params }) => {
  const token = routeToken(params);
  const UI = eng.UI;
  const e = UI.pf._e || {};
  const busy = !!UI.pf._busy;
  const pw = String(pv("npw") || "");
  const [load, setLoad] = useState<LoadState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    setLoad({ status: "loading" });
    if (!token) {
      setLoad({ status: "err", message: "This invite link is not valid." });
      return;
    }
    void loadInviteToken(token)
      .then((data) => {
        if (!cancelled) setLoad({ status: "ok", data });
      })
      .catch((err) => {
        if (cancelled) return;
        const mapped = apiErrorToForm(err);
        const msg = mapped.message || "This invite link is not valid.";
        const used = /already|used|activated/i.test(msg);
        setLoad({ status: "err", message: msg, used });
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  if (load.status === "loading") {
    return (
      <LoginFrame>
        <Empty icn="clock" t="Checking invite…" d="One moment while we validate your invite link." />
      </LoginFrame>
    );
  }

  if (load.status === "err") {
    return (
      <LoginFrame>
        <Empty
          icn={load.used ? "check" : "alert"}
          t={load.used ? "This link was already used" : "Invite link not valid"}
          d={
            load.used
              ? "Your password is set. Sign in with your work email."
              : load.message + " Ask your Admin to send a new invite if it expired."
          }
          act={<Btn t="Go to sign in" go="login" cls="pri" />}
        />
      </LoginFrame>
    );
  }

  const inv = load.data;
  const appRole = mapApiRole(inv.role?.code);
  const first = inv.first_name || inv.email.split("@")[0];
  const roleTxt = appRole ? roleLabel(appRole) : inv.role?.name || "staff";

  return (
    <LoginFrame>
      <div>
        <h1 className="h1">Welcome, {first}</h1>
        <p className="sub">
          Set a password to activate your {roleTxt} account
          {inv.employee_code ? (
            <>
              . Your employee ID is <b>{inv.employee_code}</b>
            </>
          ) : null}
          .
        </p>
      </div>
      {UI.pf._m ? <Bn kind={UI.pf._mk || "err"} body={UI.pf._m} /> : null}
      <form
        className="col"
        noValidate
        onSubmit={(ev) => {
          ev.preventDefault();
          void submitAccept(token, inv);
        }}
      >
        <Fld label="New password" htmlFor="p_npw" err={e.npw}>
          <PfInput k="npw" type="password" bad={!!e.npw} />
        </Fld>
        <PasswordRules password={pw} />
        <Fld label="Confirm password" htmlFor="p_ncf" err={e.ncf}>
          <PfInput k="ncf" type="password" bad={!!e.ncf} />
        </Fld>
        <button className="btn pri blk" type="submit" disabled={busy}>
          {busy ? "Activating…" : "Activate account"}
        </button>
      </form>
    </LoginFrame>
  );
};
