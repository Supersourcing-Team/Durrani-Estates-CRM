/*
 * L02 Request password reset (route #login-forgot).
 * Wired to POST /v1/auth/forgot-password/.
 */
import React from "react";
import { eng, bump, render } from "../../engine";
import { Bn, Fld, Icon, PfInput } from "../../ui";
import type { ScreenComp } from "../../app/types";
import { LoginFrame } from "./LoginFrame";
import { apiErrorToForm, requestForgotPassword } from "../session";

async function submitForgot() {
  const UI = eng.UI;
  if (UI.pf._busy) return;

  const email = String(UI.pf.femail || "").trim().toLowerCase();
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    UI.pf._e = { femail: "Enter a valid email address." };
    render();
    return;
  }

  UI.pf._busy = true;
  UI.pf._e = {};
  bump();

  try {
    const data = await requestForgotPassword(email);
    UI.pf._busy = false;
    UI.pf._sent = email;
    // Staging/dev often returns the token so QA can continue without email.
    if (data.token) UI.pf._devToken = data.token;
    render();
  } catch (err) {
    const mapped = apiErrorToForm(err);
    UI.pf._busy = false;
    UI.pf._e = mapped.fields.email
      ? { femail: mapped.fields.email }
      : mapped.fields.femail
        ? { femail: mapped.fields.femail }
        : {};
    UI.pf._m = mapped.message || null;
    UI.pf._mk = "err";
    render();
  }
}

export const LoginForgot: ScreenComp = () => {
  const UI = eng.UI;
  const e = UI.pf._e || {};
  const busy = !!UI.pf._busy;

  if (UI.pf._sent) {
    return (
      <LoginFrame>
        <div>
          <h1 className="h1">Check your inbox</h1>
          <p className="sub">
            If {UI.pf._sent} belongs to an account, we sent a reset link. It works once and expires in
            1 hour.
          </p>
        </div>
        <Bn
          kind="info"
          title="Nothing arrived?"
          body="Check spam, or ask your Admin to resend. We never confirm whether an email is registered."
        />
        {UI.pf._devToken ? (
          <Bn
            kind="ok"
            title="Dev shortcut"
            body="A reset token was returned by the API (staging/dev only)."
            acts={
              <a
                className="btn s pri"
                href={`#login-reset-${UI.pf._devToken}`}
                data-go={`login-reset-${UI.pf._devToken}`}
              >
                Continue to set password
              </a>
            }
          />
        ) : null}
        <a className="btn pri blk" href="#login" data-go="login">
          Back to sign in
        </a>
      </LoginFrame>
    );
  }

  return (
    <LoginFrame>
      <div>
        <h1 className="h1">Reset your password</h1>
        <p className="sub">Enter your work email and we will send a reset link.</p>
      </div>
      {UI.pf._m ? <Bn kind={UI.pf._mk || "err"} body={UI.pf._m} /> : null}
      <form
        className="col"
        noValidate
        onSubmit={(ev) => {
          ev.preventDefault();
          void submitForgot();
        }}
      >
        <Fld label="Work email" htmlFor="p_femail" err={e.femail}>
          <PfInput k="femail" type="email" ph="name@durraniestates.com" bad={!!e.femail} />
        </Fld>
        <button className="btn pri blk" type="submit" disabled={busy}>
          {busy ? "Sending…" : "Send reset link"}
        </button>
        <a className="btn ghost" href="#login" data-go="login">
          <Icon n="back" s={14} />
          Back to sign in
        </a>
      </form>
    </LoginFrame>
  );
};
