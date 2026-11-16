/*
 * Invite accept — Create Your Password (route #invite-{token}).
 * Flow: validate invite → set password → navigate to #login (email prefilled).
 */
import React, { useEffect, useState } from "react";
import { eng, bump, go, render } from "../../engine";
import { Bn, Btn, Empty, Icon } from "../../ui";
import type { ScreenComp } from "../../app/types";
import { LoginFrame } from "./LoginFrame";
import { AuthHelp, EyeIcon, setPf } from "./authBits";
import {
  acceptInviteWithApi,
  apiErrorToForm,
  loadInviteToken,
  mapApiRole,
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

  const pw = String(UI.pf.npw || "");
  const cf = String(UI.pf.ncf || "");
  const e: Record<string, string> = {};
  const hint = passwordHint(pw);
  if (hint) e.npw = hint;
  if (!cf) e.ncf = "Re-enter your new password.";
  else if (cf !== pw) e.ncf = "The two passwords do not match.";
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
    // Hand off to login screen (design flow after invitation).
    UI.pf = {
      email: invite.email,
      role: mapApiRole(invite.role?.code) || "agent",
      _m: "Password set successfully. Sign in with your work email.",
      _mk: "ok",
    };
    go("login");
  } catch (err) {
    const mapped = apiErrorToForm(err);
    UI.pf._busy = false;
    UI.pf._e = {
      ...(mapped.fields.password ? { npw: mapped.fields.password } : {}),
      ...(mapped.fields.npw ? { npw: mapped.fields.npw } : {}),
      ...(mapped.fields.ncf ? { ncf: mapped.fields.ncf } : {}),
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
  const showPw = UI.pf.showpw === "1";
  const showCf = UI.pf.showcf === "1";
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
      <LoginFrame bare>
        <Empty icn="clock" t="Checking invite…" d="One moment while we validate your invite link." />
      </LoginFrame>
    );
  }

  if (load.status === "err") {
    return (
      <LoginFrame bare>
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
        <AuthHelp />
      </LoginFrame>
    );
  }

  const inv = load.data;

  return (
    <LoginFrame bare>
      <h1 className="auth-h">Create Your Password</h1>
      <p className="auth-sub">
        Set a password to activate your Durrani Estates account and access the platform.
      </p>

      {UI.pf._m ? (
        <div className="auth-note">
          <Bn kind={UI.pf._mk || "err"} body={UI.pf._m} />
        </div>
      ) : null}

      <form
        className="auth-fields"
        noValidate
        onSubmit={(ev) => {
          ev.preventDefault();
          void submitAccept(token, inv);
        }}
      >
        <div className="afld">
          <label htmlFor="p_npw">New password</label>
          <div className="ainp pw">
            <input
              className={"inp" + (e.npw ? " bad" : "")}
              id="p_npw"
              type={showPw ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Enter new password"
              value={UI.pf.npw || ""}
              disabled={busy}
              onChange={(ev) => setPf("npw", ev.target.value)}
            />
            <button
              type="button"
              className="eye"
              aria-label={showPw ? "Hide password" : "Show password"}
              onClick={() => {
                UI.pf.showpw = showPw ? "0" : "1";
                bump();
              }}
            >
              <EyeIcon off={!showPw} />
            </button>
          </div>
          {e.npw ? (
            <span className="err">
              <Icon n="alert" s={14} />
              {e.npw}
            </span>
          ) : null}
        </div>

        <div className="afld">
          <label htmlFor="p_ncf">Confirm new password</label>
          <div className="ainp pw">
            <input
              className={"inp" + (e.ncf ? " bad" : "")}
              id="p_ncf"
              type={showCf ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Re-enter new password"
              value={UI.pf.ncf || ""}
              disabled={busy}
              onChange={(ev) => setPf("ncf", ev.target.value)}
            />
            <button
              type="button"
              className="eye"
              aria-label={showCf ? "Hide password" : "Show password"}
              onClick={() => {
                UI.pf.showcf = showCf ? "0" : "1";
                bump();
              }}
            >
              <EyeIcon off={!showCf} />
            </button>
          </div>
          {e.ncf ? (
            <span className="err">
              <Icon n="alert" s={14} />
              {e.ncf}
            </span>
          ) : null}
        </div>

        <button className="auth-btn" type="submit" disabled={busy}>
          {busy ? "Saving…" : "Set Password & Continue"}
        </button>
      </form>

      <AuthHelp />
    </LoginFrame>
  );
};
