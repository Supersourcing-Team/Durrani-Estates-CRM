/*
 * L01 Sign in (route #login). Wired to POST /v1/auth/login/ (Module 1).
 * Role tabs are UI-only: API returns role.code; mismatch shows inline error.
 */
import React from "react";
import { eng, bump, go, homeOf, render } from "../../engine";
import { Bn, Icon } from "../../ui";
import type { ScreenComp } from "../../app/types";
import { LoginFrame } from "./LoginFrame";
import { apiErrorToForm, loginWithApi, type AppRole } from "../session";

const ROLES: { k: AppRole; l: string; ic: React.ReactNode }[] = [
  { k: "agent", l: "Agent", ic: <Icon n="user" s={17} /> },
  { k: "mgmt", l: "Management", ic: <Icon n="user" s={17} /> },
  { k: "admin", l: "Admin", ic: <UserCog /> },
];

function UserCog() {
  return (
    <svg
      viewBox="0 0 24 24"
      width={17}
      height={17}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="10" cy="7" r={4} />
      <path d="M10.3 15H7a4 4 0 0 0-4 4v2" />
      <circle cx="18" cy="18" r={3} />
      <path d="M18 14v1M18 21v1M21.5 16l-.87.5M15.4 19.5l-.87.5M21.5 20l-.87-.5M15.4 16.5l-.87-.5" />
    </svg>
  );
}

function EyeIcon({ off }: { off: boolean }) {
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

const setPf = (k: string, v: unknown) => {
  const UI = eng.UI;
  UI.pf[k] = v;
  if (UI.pf._e) delete UI.pf._e[k];
  bump();
};

function validateLocal(email: string, password: string): Record<string, string> {
  const e: Record<string, string> = {};
  if (!email) e.email = "Enter your work email.";
  else if (!/^\S+@\S+\.\S+$/.test(email)) e.email = "This does not look like an email address.";
  if (!password) e.password = "Enter your password.";
  else if (password.length < 8) e.password = "Passwords have at least 8 characters.";
  return e;
}

async function submitLogin() {
  const UI = eng.UI;
  if (UI.pf._busy) return;

  const role: AppRole = UI.pf.role || "agent";
  const email = String(UI.pf.email || "").trim().toLowerCase();
  const password = String(UI.pf.password || "");

  const local = validateLocal(email, password);
  if (Object.keys(local).length) {
    UI.pf._e = local;
    UI.pf._m = null;
    render();
    return;
  }

  UI.pf._busy = true;
  UI.pf._e = {};
  UI.pf._m = null;
  UI.pf._locked = false;
  bump();

  try {
    const { role: signedRole } = await loginWithApi({
      email,
      password,
      tabRole: role,
      rememberMe: !!UI.pf.remember,
    });
    UI.pf._busy = false;
    UI.pf.password = "";
    const nx = UI.next;
    UI.next = null;
    if (nx && String(nx).startsWith(signedRole)) go(nx);
    else go(homeOf(signedRole));
  } catch (err) {
    const mapped = apiErrorToForm(err);
    UI.pf._busy = false;
    UI.pf._e = mapped.fields;
    UI.pf._locked = !!mapped.locked;
    UI.pf._m = mapped.message || null;
    UI.pf._mk = "err";
    if (mapped.locked) (eng.S as any).fails = 5;
    render();
  }
}

export const Login: ScreenComp = () => {
  const S = eng.S;
  const UI = eng.UI;
  const e = UI.pf._e || {};
  const role: AppRole = UI.pf.role || "agent";
  const lock = !!UI.pf._locked || (S.fails || 0) >= 5;
  const show = UI.pf.showpw === "1";
  const busy = !!UI.pf._busy;

  return (
    <LoginFrame bare>
      <div className="auth-tabs" role="tablist" aria-label="Sign in as">
        {ROLES.map((r) => (
          <button
            key={r.k}
            type="button"
            role="tab"
            aria-selected={role === r.k}
            className={"auth-tab" + (role === r.k ? " on" : "")}
            onClick={() => {
              UI.pf.role = r.k;
              UI.pf._e = {};
              bump();
            }}
          >
            {r.ic}
            {r.l}
          </button>
        ))}
      </div>

      <h1 className="auth-h">Welcome back!</h1>
      <p className="auth-sub">Sign in to manage your sales, inventory, and business operations.</p>

      {lock ? (
        <div className="auth-note">
          <Bn
            kind="err"
            title="Too many attempts"
            body="This account is locked for 15 minutes. You can reset your password instead."
            acts={
              <a className="btn s" href="#login-forgot" data-go="login-forgot">
                Reset password
              </a>
            }
          />
        </div>
      ) : null}
      {UI.pf._m ? (
        <div className="auth-note">
          <Bn kind={UI.pf._mk || "info"} body={UI.pf._m} />
        </div>
      ) : null}

      <form
        className="auth-fields"
        noValidate
        onSubmit={(ev) => {
          ev.preventDefault();
          void submitLogin();
        }}
      >
        <div className="afld">
          <label htmlFor="p_email">Email address</label>
          <div className="ainp">
            <input
              className={"inp" + (e.email ? " bad" : "")}
              id="p_email"
              type="email"
              autoComplete="username"
              placeholder="Enter your work email"
              value={UI.pf.email || ""}
              disabled={busy || lock}
              onChange={(ev) => setPf("email", ev.target.value)}
            />
          </div>
          {e.email ? (
            <span className="err">
              <Icon n="alert" s={14} />
              {e.email}
            </span>
          ) : null}
        </div>
        <div className="afld">
          <div className="afld-h">
            <label htmlFor="p_password">Password</label>
            <a href="#login-forgot" data-go="login-forgot">
              Forgot your password?
            </a>
          </div>
          <div className="ainp pw">
            <input
              className={"inp" + (e.password ? " bad" : "")}
              id="p_password"
              type={show ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter your password"
              value={UI.pf.password || ""}
              disabled={busy || lock}
              onChange={(ev) => setPf("password", ev.target.value)}
            />
            <button
              type="button"
              className="eye"
              aria-label={show ? "Hide password" : "Show password"}
              onClick={() => {
                UI.pf.showpw = show ? "0" : "1";
                bump();
              }}
            >
              <EyeIcon off={!show} />
            </button>
          </div>
          {e.password ? (
            <span className="err">
              <Icon n="alert" s={14} />
              {e.password}
            </span>
          ) : null}
        </div>
        <button className="auth-btn" type="submit" disabled={busy || lock}>
          {busy ? "Signing in…" : "Login"}
        </button>
      </form>

      <p className="auth-help">
        Need help? <a href="mailto:support@durraniestates.com">Contact support</a>
      </p>
    </LoginFrame>
  );
};
