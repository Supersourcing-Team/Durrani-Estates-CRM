/*
 * App shell (prototype: shell, sidebar, topbar, tabbar, notifDD, shiftWidget, unloggedBanner, flashHtml).
 */
import React from 'react';
import { eng, type RouteDef, type Crumb } from '../engine';
import { Icon, Av, AvBox, Bn, Btn, Empty, Html } from '../ui';
import { hashOf } from '../app/route';

const LOGO_SRC = (): string => {
  const m = /src="([^"]+)"/.exec(eng.LOGO);
  return m ? m[1] : '';
};
export function Logo() {
  return <img className="brandlogo" src={LOGO_SRC()} alt="Durrani Estates" width={96} height={38} />;
}

const homeOf = (role: string): string => eng.homeOf(role);
const navOf = (d: RouteDef): string => d.nav || d.key;
export const roleLabel = (u: any): string => eng.roleLabel(u);

/** Live clock: re-renders this component once a second. */
export function useTick(ms = 1000): number {
  const [n, setN] = React.useState(0);
  React.useEffect(() => { const t = setInterval(() => setN((x) => x + 1), ms); return () => clearInterval(t); }, [ms]);
  return n;
}

/** prototype: badgeFor(navKey) */
function Badge({ k }: { k: string }) {
  const S = eng.S;
  if (!S.session) return null;
  const r = S.session.role;
  const me = eng.me();
  let n = 0, red = false;
  if (k === 'admin-review') { n = eng.pendingReview().length; red = true; }
  else if (k === 'mgmt-leave') n = S.leave.filter((l: any) => l.status === 'pending' && eng.teamOf(l.user) === me.team).length;
  else if (k === 'mgmt-leads') { n = eng.escalationsFor(me).filter((e: any) => e.status === 'open').length; red = true; }
  else if (k === 'agent-leads' && r === 'agent') { n = eng.myLeads(me.id).filter((l: any) => eng.leadRisk(l).state === 'risk').length; red = true; }
  return n ? <span className={'bdg' + (red ? ' red' : '')}>{n}</span> : null;
}

function Sidebar({ role, cur }: { role: string; cur: string }) {
  const u = eng.me();
  const G = eng.SBG[role] || {};
  const unread = eng.unreadCount();
  return (
    <aside className="side" aria-label="Main navigation">
      <a className="logo" href={'#' + homeOf(role)} data-go={homeOf(role)} aria-label="Home"><Logo /></a>
      <nav className="nav">
        {eng.NAVS[role].map(([k, l, i]: [string, string, string]) => (
          <React.Fragment key={k}>
            {G[k] ? <div className="sbg">{G[k]}</div> : null}
            <a className={'nl ' + (cur === k ? 'on' : '')} href={'#' + k} data-go={k} title={l}><Icon n={i} s={18} /><span>{l}</span><Badge k={k} /></a>
          </React.Fragment>
        ))}
      </nav>
      <div className="sbfoot">
        <a className={'nl ' + (cur === role + '-notifications' ? 'on' : '')} href={`#${role}-notifications`} data-go={`${role}-notifications`}>
          <Icon n="bell" s={18} /><span>Notifications</span>{unread ? <span className="bdg">{unread}</span> : null}
        </a>
        {role !== 'admin' ? (
          <a className={'nl ' + (cur === role + '-settings' ? 'on' : '')} href={`#${role}-settings`} data-go={`${role}-settings`}><Icon n="cog" s={18} /><span>Settings</span></a>
        ) : null}
      </div>
      <button type="button" className="me" data-open="account-menu" aria-label="Account menu">
        <Av n={u.name} />
        <span style={{ minWidth: 0, flex: 1 }}>
          <span className="b trunc" style={{ display: 'block' }}>{u.name}</span>
          <span className="faint xs trunc" style={{ display: 'block' }}>{roleLabel(u)}</span>
        </span>
        <span style={{ color: 'var(--tx3)' }}><Icon n="chevd" s={14} /></span>
      </button>
    </aside>
  );
}

function Tabbar({ role, cur }: { role: string; cur: string }) {
  return (
    <nav className="tabbar" aria-label="Primary">
      {eng.TABS[role].map(([k, l, i]: [string, string, string]) => (
        <a key={k} href={'#' + k} data-go={k} className={cur === k ? 'on' : ''}><Icon n={i} s={22} /><span>{l}</span></a>
      ))}
      <button type="button" data-open="more-nav" aria-label="More"><Icon n="menu" s={22} /><span>More</span></button>
    </nav>
  );
}

/** prototype: shiftWidget(): punch clock button in the top bar */
export function ShiftWidget() {
  useTick(1000);
  const u = eng.me();
  if (!u || u.role === 'admin') return null;
  const p = eng.punchState(u.id);
  const done = p.outAt && eng.sameDay(p.outAt, eng.NOW());
  return (
    <button type="button" className={'shiftw ' + (p.in ? (p.brk ? 'brk' : 'in') : '')} data-open="punch" aria-label="Attendance">
      <Icon n={p.in ? 'timer' : 'clock'} s={16} />
      <span className="sw-t">{p.in ? eng.hms(eng.workedMs(p)) : eng.clockTxt(eng.liveNow())}</span>
      <span className="sw-l">{p.in ? (p.brk ? 'On break' : 'Working') : done ? 'Punched out' : 'Punch in'}</span>
    </button>
  );
}

function NotifDD({ role }: { role: string }) {
  const items = eng.myNotifs().slice(0, 6);
  return (
    <div className="dd" role="dialog" aria-label="Notifications">
      <div className="row sb" style={{ padding: '12px 14px', borderBottom: '1px solid var(--bd)' }}>
        <span className="h3">Notifications</span>
        <button className="btn lnk xs" type="button" data-act="readall">Mark all read</button>
      </div>
      {items.length ? items.map((n: any) => (
        <button key={n.id} type="button" className={'ddi ' + (n.read ? '' : 'un')} data-act={`notifgo|${n.id}`}>
          <AvBox cls="sm"><Icon n={n.ic || 'bell'} s={13} /></AvBox>
          <span style={{ minWidth: 0 }}>
            <span className="b" style={{ display: 'block', fontSize: 13 }}>{n.t}</span>
            <span className="muted xs" style={{ display: 'block' }}>{n.d || ''}</span>
            <span className="faint xs">{eng.rel(n.at)}</span>
          </span>
        </button>
      )) : <Empty icn="bell" t="All caught up" d="No notifications yet." />}
      <a className="ddi" style={{ justifyContent: 'center', fontWeight: 600, color: 'var(--tx-brand)' }} href={`#${role}-notifications`} data-go={`${role}-notifications`}>View all notifications</a>
    </div>
  );
}

const RL: Record<string, string> = { agent: 'Agent', mgmt: 'Management', admin: 'Admin' };
function Topbar({ role, crumbs, d }: { role: string; crumbs: Crumb[]; d: RouteDef }) {
  const u = eng.me();
  const unread = eng.unreadCount();
  const root = (d && d.level === 'L1' && (eng.NAVS[role] || []).some((n: string[]) => n[0] === d.key)) || (d && d.key === homeOf(role));
  const up = crumbs.length > 1 ? crumbs[crumbs.length - 2].go || homeOf(role) : homeOf(role);
  const lk = ({ agent: 'lq', mgmt: 'mq2', admin: 'alq' } as Record<string, string>)[role];
  const lr = ({ agent: 'agent-leads', mgmt: 'mgmt-leads', admin: 'admin-leads' } as Record<string, string>)[role];
  return (
    <header className={'topbar ' + (root ? 'isroot' : 'isdeep')}>
      <button type="button" className="iconbtn burger" data-open="more-nav" aria-label="Menu"><Icon n="menu" s={20} /></button>
      <a className="iconbtn appback" href={'#' + up} data-go={up} aria-label="Back"><Icon n="back" s={20} /></a>
      <a className="applogo" href={'#' + homeOf(role)} data-go={homeOf(role)} aria-label="Home"><Logo /></a>
      <div className="crumbs">
        <span className="rl">{RL[role]}</span><span className="faint rl"><Icon n="chev" s={12} /></span>
        {crumbs.map((c, i) => i === crumbs.length - 1
          ? <span className="cur" key={i}>{c.l}</span>
          : <React.Fragment key={i}><a href={'#' + c.go} data-go={c.go}>{c.l}</a><span className="faint"><Icon n="chev" s={12} /></span></React.Fragment>)}
      </div>
      <span className="apptitle">{crumbs[crumbs.length - 1].l}</span>
      <span className="sp" />
      <label className="tsearch"><Icon n="search" s={16} /><input type="search" placeholder="Search lead, phone or ID" aria-label="Search leads" data-tsearch={`${lk}|${lr}`} /></label>
      {role !== 'admin' ? <ShiftWidget /> : null}
      <div style={{ position: 'relative' }}>
        <button type="button" className="iconbtn bell" data-act="notif" aria-label="Notifications"><Icon n="bell" s={20} />{unread ? <span className="dot">{unread}</span> : null}</button>
        {eng.UI.notif ? <NotifDD role={role} /> : null}
      </div>
      <button type="button" className="appav" data-open="account-menu" aria-label="Account"><Av n={u.name} cls="sm" /></button>
    </header>
  );
}

/** prototype: unloggedBanner(role) + flashHtml(): prompts shown above the page content */
function PagePrompts({ role }: { role: string }) {
  const S = eng.S, UI = eng.UI;
  if (!S.session) return null;
  let unlogged: React.ReactNode = null;
  if (role === 'agent') {
    const p = S.unlogged[S.session.userId];
    if (p && !new RegExp('^agent-lead-' + p.lead + '(-|$)').test(hashOf())) {
      const l = eng.leadById(p.lead);
      unlogged = (
        <div className="mb16">
          <Bn kind="warn" title="Unlogged call" body={`You called ${l.name} ${eng.rel(p.t)}. Log the result before your next call.`}
            acts={<><Btn cls="pri s" open={`call-log|${l.id}`}>Log call</Btn><Btn cls="s" go={`agent-lead-${l.id}`}>Open lead</Btn></>} />
        </div>
      );
    }
  }
  const f = UI.pf && UI.pf._flash;
  const flash = f ? (
    <div className="mb16 flash">
      <Bn kind={f.kind || 'ok'} title={<Html html={f.t} />} body={f.d ? <Html html={f.d} /> : undefined}
        acts={<><Html html={f.acts || ''} as="span" className="flashacts" style={{ display: 'contents' }} /><button className="btn ghost s" type="button" data-act="flashx" aria-label="Dismiss"><Icon n="x" s={14} /></button></>} />
    </div>
  ) : null;
  return <>{unlogged}{flash}</>;
}

export function Shell({ role, d, params, routeKey, children }: { role: string; d: RouteDef; params: string[]; routeKey: string; children: React.ReactNode }) {
  const crumbs: Crumb[] = d.crumb ? d.crumb(params) : [{ l: d.title }];
  const cur = navOf(d);
  return (
    <div className="shell">
      <Sidebar role={role} cur={cur} />
      <div className="main">
        <Topbar role={role} crumbs={crumbs} d={d} />
        <main className="page enter" id="page" key={routeKey}>
          <span className="devtag">{d.id} · {d.level} · {hashOf()}</span>
          <PagePrompts role={role} />
          {children}
        </main>
        <Tabbar role={role} cur={cur} />
      </div>
    </div>
  );
}
