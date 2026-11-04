/*
 * Shared attendance parts (prototype: clockRing, shiftCard, punchBtns, reqChip, reqActs, attTabs, attLegend).
 * The live clock values are computed on every render; useTick() re-renders once a second.
 */
import React from 'react';
import { eng, fhm, fd } from '../../engine';
import { Chip, Icon, LeadLinks, Tabs, type TabItem } from '../../ui';
import { useTick } from '../../project-layout/Shell';

/** prototype: clockRing(p, size). SVG progress ring of worked time against a 9 hour shift. */
export function ClockRing({ p, size = 168 }: { p: any; size?: number }) {
  useTick(1000);
  const r = size / 2 - 9, C = 2 * Math.PI * r, c = size / 2;
  const frac = p && p.in ? Math.min(1, eng.workedMs(p) / eng.SHIFT_MS) : 0;
  return (
    <div className="cring" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <circle cx={c} cy={c} r={r} className="trk" />
        {Array.from({ length: 12 }, (_, i) => {
          const a = (i / 12) * 2 * Math.PI;
          return (
            <line key={i} className="tick"
              x1={(c + Math.sin(a) * (r - 14)).toFixed(1)} y1={(c - Math.cos(a) * (r - 14)).toFixed(1)}
              x2={(c + Math.sin(a) * (r - 9)).toFixed(1)} y2={(c - Math.cos(a) * (r - 9)).toFixed(1)} />
          );
        })}
        <circle cx={c} cy={c} r={r} className={'val ' + (p && p.brk ? 'brk' : '')}
          strokeDasharray={C.toFixed(1)} strokeDashoffset={(C * (1 - frac)).toFixed(1)} transform={`rotate(-90 ${c} ${c})`} />
      </svg>
      <div className="cring-c">
        {p && p.in ? (
          <><span className="cr-l">{p.brk ? 'On break' : 'Worked today'}</span><span className="cr-v">{eng.hms(eng.workedMs(p))}</span><span className="cr-s">of 9h shift</span></>
        ) : (
          <><span className="cr-l">Dubai time</span><span className="cr-v">{eng.clockTxt(eng.liveNow())}</span><span className="cr-s">Shift 09:00 to 18:00</span></>
        )}
      </div>
    </div>
  );
}

/** Live Dubai clock text (prototype: <b data-clock="now">). */
export function LiveClock() {
  useTick(1000);
  return <>{eng.clockTxt(eng.liveNow())}</>;
}

/** prototype: punchBtns(p, done) */
export function PunchBtns({ p, done }: { p: any; done: boolean }) {
  return (
    <>
      {!p.in && !done ? <button className="btn pri" type="button" data-act="punch|in"><Icon n="clock" s={16} />Punch in</button> : null}
      {p.in && !p.brk ? <button className="btn" type="button" data-act="punch|brk">Start break</button> : null}
      {p.in && p.brk ? <button className="btn pri" type="button" data-act="punch|endbrk">End break</button> : null}
      {p.in ? <button className="btn" type="button" data-act="punch|out" disabled={p.brk || undefined}>Punch out</button> : null}
      {done ? <span className="muted sm">Done for today. See you tomorrow.</span> : null}
    </>
  );
}

/** prototype: shiftCard() */
export function ShiftCard() {
  const u = eng.me(), p = eng.punchState(u.id), NOW = eng.NOW();
  const done = !!(p.outAt && eng.sameDay(p.outAt, NOW));
  const ta = eng.S.todayAtt[u.id];
  return (
    <section className="card shiftcard">
      <ClockRing p={p} size={132} />
      <div className="sc-b">
        <div className="lbl">{fd(NOW)}</div>
        <div className="kns">{p.in ? (p.brk ? 'On break' : 'Working') : done ? 'Punched out' : 'Not punched in'}</div>
        <div className="muted sm">{p.in ? 'Punched in at ' + fhm(p.t) + (ta ? ' · ' + ta.st : '') : done ? 'Punched out at ' + fhm(p.outAt) : 'Late after 10:00. Punch in when you start.'}</div>
        <div className="row g6 wrap mt16"><PunchBtns p={p} done={done} /></div>
      </div>
    </section>
  );
}

const REQ: Record<string, [string, string]> = {
  pending: ['Pending', 's5'], approved: ['Approved', 's6'], rejected: ['Rejected', 's7'],
  cancelled: ['Cancelled', 's2'], withdrawn: ['Withdrawn', 's2'], revoked: ['Revoked', 's7'],
};
/** prototype: reqChip(x, pre). Status chip of a leave or regularisation request, plus the last decision note. */
export function ReqChip({ x, pre }: { x: any; pre?: string }) {
  const [t, c] = REQ[x.status] || [eng.cap1(x.status), 's2'];
  const h = (x.hist || []).slice(-1)[0];
  const why = h && h.a !== 'Requested' ? h.a + ' by ' + eng.uname(h.by) + (h.why ? ': ' + h.why : '') : x.note || '';
  return (
    <>
      <Chip t={(pre || '') + t} cls={c} />
      {why ? <div className="xs faint mt4" style={{ maxWidth: 240, whiteSpace: 'normal' }}>{why}</div> : null}
    </>
  );
}

/** prototype: reqActs(kind, x). Withdraw / cancel for the owner; approve / reject / revoke / reopen for the approver. */
export function ReqActs({ kind, x }: { kind: 'leave' | 'reg'; x: any }) {
  const u = eng.me();
  const b = (t: string, mode: string, cls?: string) => (
    <button className={'btn s ' + (cls || '')} type="button" data-open={`req-undo|${kind}|${x.id}|${mode}`}>{t}</button>
  );
  if (x.user === u.id) {
    if (x.status === 'pending') return b('Withdraw', 'withdraw');
    if (kind === 'leave' && x.status === 'approved' && x.from > eng.NOW()) return b('Cancel leave', 'cancel');
    return null;
  }
  if (!eng.canDecide(x)) return null;
  if (x.status === 'pending') {
    return kind === 'leave'
      ? <><button className="btn s pri" type="button" data-act={`leavedec|${x.id}|approved`}>Approve</button><button className="btn s" type="button" data-open={`leave-reject|${x.id}`}>Reject</button></>
      : <><button className="btn s pri" type="button" data-act={`regdec|${x.id}|approved`}>Approve</button><button className="btn s" type="button" data-open={`reg-reject|${x.id}`}>Reject</button></>;
  }
  if (x.status === 'approved') return b('Revoke', 'revoke');
  if (x.status === 'rejected') return b('Reopen', 'reopen');
  return null;
}

/** prototype: attTabs(cur) */
export function AttTabs({ cur }: { cur: string }) {
  const items: TabItem[] = eng.me().role === 'mgmt'
    ? [{ k: 'team', l: 'Team today', go: 'mgmt-attendance', i: 'users' }, { k: 'cal', l: 'Calendar', go: 'mgmt-attcal', i: 'cal' }, { k: 'mine', l: 'My attendance', go: 'mgmt-myatt', i: 'user' }]
    : [{ k: 'mine', l: 'My attendance', go: 'agent-attendance', i: 'user' }, { k: 'cal', l: 'Calendar', go: 'agent-attcal', i: 'cal' }];
  return <div className="mb16"><Tabs items={items} cur={cur} /></div>;
}

/** prototype: attLegend() */
export function AttLegend() {
  const { SHIFT, KCL, hmOf } = eng;
  return (
    <div className="attleg">
      {['ok', 'late', 'early', 'miss', 'abs', 'leave', 'lpend', 'off'].map((k) => <span key={k}><i className={'mc k-' + k} />{KCL[k]}</span>)}
      <span className="faint">Shift {hmOf(SHIFT.start)} to {hmOf(SHIFT.end)} · late after {hmOf(SHIFT.start + SHIFT.grace)} · set by Admin</span>
    </div>
  );
}

/** Chip colour per attendance record status (Recent days table). */
export const ATT_CLS: Record<string, string> = { Present: 's6', Late: 's5', 'Miss punch': 's7', Absent: 's7', 'Early leave': 's5' };

/** prototype: geoFlag(g). Chip for a sign-in whose IP looks off (VPN, other city, new device). */
export function GeoFlag({ g }: { g: any }) {
  const x = eng.geoIssue(g);
  return x ? <Chip t={x} cls={x.startsWith('VPN') ? 's7' : 's5'} dot={false} /> : null;
}

/** prototype: geoCell(uid). Today's punch-in location, opening the IP detail. */
export function GeoCell({ uid }: { uid: string }) {
  const g = (eng.S.geo || []).filter((x: any) => x.u === uid && eng.sameDay(x.at, eng.NOW()) && x.ev === 'Punch in').pop();
  if (!g) return <span className="faint">No punch</span>;
  return <><button type="button" className="lnkb" data-open={`ip-detail|${g.id}`}>{g.city}, {g.cc}</button> <GeoFlag g={g} /></>;
}

/** Pending / Approved / All switch for leave lists (UI.f.lf). */
export function LeaveSeg({ f, pending }: { f: string; pending: number }) {
  return (
    <div className="seg mb16">
      <button className={f === 'pending' ? 'on' : ''} data-act="ui|lf|pending">Pending ({pending})</button>
      <button className={f === 'approved' ? 'on' : ''} data-act="ui|lf|approved">Approved</button>
      <button className={f === 'all' ? 'on' : ''} data-act="ui|lf|all">All</button>
    </div>
  );
}

/** Regularisation requests table (mgmt-attendance and admin-hr-reg). `who` is the first column heading. */
export function RegTable({ rq, who }: { rq: any[]; who: string }) {
  return (
    <div className="tw">
      <table className="tbl">
        <thead><tr><th>{who}</th><th>Date</th><th>Reason</th><th>Status</th><th></th></tr></thead>
        <tbody>
          {rq.map((r) => (
            <tr key={r.id}>
              <td>{eng.uname(r.user)}</td>
              <td>{eng.fds(r.date)}</td>
              <td className="sm"><LeadLinks text={r.reason} /></td>
              <td><ReqChip x={r} /></td>
              <td className="tr"><ReqActs kind="reg" x={r} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

