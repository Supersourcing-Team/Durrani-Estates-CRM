/*
 * Root component (prototype: render()). Picks the screen for the current hash, applies the
 * sign-in and role checks, and wraps agent screens in the app shell.
 */
import React from 'react';
import { eng } from '../engine';
import { Btn, Empty } from '../ui';
import { useEngine } from './store';
import { Stage } from './stage';
import { parseHash, hashOf, routeKeyOf } from './route';
import { screens } from './registry';
import { Shell, roleLabel } from '../project-layout/Shell';
import { ModalHost, ToastHost } from './hosts';
import { ErrorBoundary } from './ErrorBoundary';
import { APP_ROLE, APP_NAME } from './config';

const APP_ROLES = ['agent', 'mgmt', 'admin'];

function NotFound() {
  return (
    <div className="page" style={{ maxWidth: 560, margin: '60px auto' }}>
      <Empty icn="alert" t="Screen not found" d="This link does not match any screen in the app." act={<Btn t="Go to login" go="login" cls="pri" />} />
    </div>
  );
}

function LoginRedirect() {
  return (
    <div className="login">
      <div className="l"><Empty icn="lock" t="Please sign in" d="Your session has ended or you opened a link that needs a sign-in." act={<Btn t="Go to sign in" go="login" cls="pri" />} /></div>
      <div className="r" />
    </div>
  );
}

function Denied({ d }: { d: any }) {
  const role = eng.S.session.role;
  return (
    <div className="card" style={{ maxWidth: 640, margin: '20px auto' }}>
      <Empty icn="lock" t="You do not have access to this screen"
        d={`Your role (${roleLabel(eng.me())}) cannot open ${d.title}. Access is enforced on the server as well, so the data is never returned.`}
        act={<Btn t="Back to my home" go={eng.homeOf(role)} cls="pri" />} />
    </div>
  );
}

/** Screens that exist in the prototype but belong to the Manager or Admin apps. */
function OtherApp({ d }: { d: any }) {
  return (
    <div className="card" style={{ maxWidth: 640, margin: '20px auto' }}>
      <Empty icn="lock" t="This screen is in another app"
        d={`${d.title} is not available in this build.`}
        act={<Btn t="Sign out" act="logout" cls="pri" />} />
    </div>
  );
}

/** Single-role builds: someone from another role signed in. */
function WrongApp({ role }: { role: string }) {
  const name: Record<string, string> = { agent: 'Agent', mgmt: 'Manager', admin: 'Admin' };
  return (
    <div className="login">
      <div className="l">
        <Empty icn="lock" t={`This is the ${name[APP_ROLE as string]} app`}
          d={`You are signed in as ${name[role] || role}. Open the ${name[role] || role} app to continue.`}
          act={<Btn t="Sign out" act="logout" cls="pri" />} />
      </div>
      <div className="r" />
    </div>
  );
}

function Content() {
  const r = parseHash();
  if (!r) return <NotFound />;
  const d = r.def;
  const S = eng.S;
  const Comp = screens[d.key];
  if (APP_ROLES.includes(d.role)) {
    if (!S.session) { eng.UI.next = hashOf(); return <LoginRedirect />; }
    const role = S.session.role;
    if (APP_ROLE && role !== APP_ROLE) return <WrongApp role={role} />;
    const rk = routeKeyOf(r);
    if (role !== d.role) {
      const den = { title: 'Access denied', level: 'EC', id: 'EC', key: 'denied', nav: role + '-home' };
      return <Shell role={role} d={den as any} params={[]} routeKey={rk}><Denied d={d} /></Shell>;
    }
    return (
      <Shell role={role} d={d} params={r.params} routeKey={rk}>
        <ErrorBoundary key={rk}>{Comp ? <Comp params={r.params} /> : <OtherApp d={d} />}</ErrorBoundary>
      </Shell>
    );
  }
  if (!Comp) return <NotFound />;
  return <ErrorBoundary key={routeKeyOf(r)}><Comp params={r.params} /></ErrorBoundary>;
}

export function App() {
  useEngine();
  React.useEffect(() => { document.title = APP_NAME; });
  return (
    <div id="frame">
      <Stage><div id="app"><Content /></div></Stage>
      <ModalHost />
      <ToastHost />
    </div>
  );
}
