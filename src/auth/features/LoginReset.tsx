/*
 * L02b Set a new password from email reset link (route #login-reset-{token}).
 * Wired to GET /v1/auth/reset-password/{token}/ + POST /v1/auth/reset-password/.
 */
import React, { useEffect, useState } from "react";
import { eng, bump, go, render } from "../../engine";
import { Bn, Btn, Empty, Fld, PfInput, pv } from "../../ui";
import type { ScreenComp } from "../../app/types";
import { LoginFrame } from "./LoginFrame";
import { PasswordRules } from "./PasswordRules";
import {
  apiErrorToForm,
  confirmResetPassword,
  loadResetToken,
  routeToken,
} from "../session";
import { passwordHint } from "../password";
import type { ResetValidateData } from "../../http/types";

type LoadState =
  | { status: "loading" }
  | { status: "ok"; data: ResetValidateData }
  | { status: "err"; message: string };

async function submitReset(token: string) {
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
    await confirmResetPassword(token, pw);
    UI.pf._busy = false;
    UI.pf = {
      _m: "Password reset successfully. You can now sign in.",
      _mk: "ok",
    };
    go("login");
  } catch (err) {
    const mapped = apiErrorToForm(err);
    UI.pf._busy = false;
    UI.pf._e = {
      ...(mapped.fields.new_password ? { npw: mapped.fields.new_password } : {}),
      ...(mapped.fields.npw ? { npw: mapped.fields.npw } : {}),
      ...(mapped.fields.token ? { npw: mapped.fields.token } : {}),
    };
    UI.pf._m = mapped.message || null;
    UI.pf._mk = "err";
    render();
  }
}

export const LoginReset: ScreenComp = ({ params }) => {
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
      setLoad({ status: "err", message: "This reset link is not valid." });
      return;
    }
    void loadResetToken(token)
      .then((data) => {
        if (!cancelled) setLoad({ status: "ok", data });
      })
      .catch((err) => {
        if (cancelled) return;
        const mapped = apiErrorToForm(err);
        setLoad({
          status: "err",
          message: mapped.message || "This reset link is not valid or has expired.",
        });
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  if (load.status === "loading") {
    return (
      <LoginFrame>
        <Empty icn="clock" t="Checking reset link…" d="One moment while we validate your link." />
      </LoginFrame>
    );
  }

  if (load.status === "err") {
    return (
      <LoginFrame>
        <Empty
          icn="alert"
          t="Reset link not valid"
          d={load.message}
          act={<Btn t="Request a new link" go="login-forgot" cls="pri" />}
        />
      </LoginFrame>
    );
  }

  return (
    <LoginFrame>
      <div>
        <h1 className="h1">Choose a new password</h1>
        <p className="sub">
          Resetting password for <b>{load.data.email}</b>. The link works once.
        </p>
      </div>
      {UI.pf._m ? <Bn kind={UI.pf._mk || "err"} body={UI.pf._m} /> : null}
      <form
        className="col"
        noValidate
        onSubmit={(ev) => {
          ev.preventDefault();
          void submitReset(token);
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
          {busy ? "Saving…" : "Save new password"}
        </button>
        <a className="btn ghost" href="#login" data-go="login">
          Back to sign in
        </a>
      </form>
    </LoginFrame>
  );
};
