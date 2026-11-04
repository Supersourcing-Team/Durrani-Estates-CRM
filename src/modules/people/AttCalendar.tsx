/* Attendance calendar (prototype: attCalendar(role)) and the agent route agent-attcal. */
import React from 'react';
import { eng, fd, fds, fhm, f2 } from '../../engine';
import { Bn, Card, Icon, Kpi, PgHead, Sel } from '../../ui';
import type { ScreenComp } from '../../app/types';
import { AttLegend, AttTabs } from './parts';

const WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const isWe = (d: number) => [0, 6].includes(eng.dowOf(d));

/** One day cell in the single-person month grid. Past and today open the day detail. */
function DayCell({ pid, d, i }: { pid: string; d: number; i: any }) {
  const tm = i.in ? fhm(i.in) + (i.out ? ' to ' + fhm(i.out) : '') : '';
  const clickable = !['future', 'off'].includes(i.k);
  const props = {
    className: `cday k-${i.k} ${eng.sameDay(d, eng.NOW()) ? 'today' : ''}`,
    'aria-label': `${fd(d)}: ${i.t || ''}`,
  };
  const inner = (
    <>
      <span className="dn">{f2(d, { day: 'numeric' })}</span>
      {i.t ? <span className="dt">{i.t}</span> : null}
      {tm ? <span className="dtm">{tm}</span> : null}
      {i.reg ? <span className="dtm">Regularised</span> : null}
    </>
  );
  return clickable
    ? <button type="button" {...props} data-open={`att-day|${pid}|${d}`}>{inner}</button>
    : <div {...props}>{inner}</div>;
}

export function AttCalendar({ role }: { role: 'agent' | 'mgmt' | 'admin' }) {
  const S = eng.S, UI = eng.UI;
  const u = eng.me();
  const { SHIFT, hmOf } = eng;
  const off = Math.max(-2, Math.min(1, +(UI.f.calm || 0)));
  const days: number[] = eng.monthDays(off);
  const mlabel = f2(days[10], { month: 'long', year: 'numeric' });
  const pool: any[] = role === 'agent' ? [u] : role === 'mgmt' ? [u, ...eng.myTeam()] : S.users.filter((x: any) => ['agent', 'mgmt'].includes(x.role) && x.status === 'active');
  const tf = role === 'admin' ? (UI.f.calt || 'all') : 'all';
  const people = pool.filter((x) => tf === 'all' || x.team === tf);
  const view = role === 'agent' ? 'person' : (UI.f.calv || 'team');
  const pid = people.some((x) => x.id === UI.f.calp) ? UI.f.calp : (role === 'agent' ? u.id : people[0].id);

  const nav = (
    <div className="row g6 wrap mb16 fbar">
      <div className="seg">
        <button type="button" data-act={`ui|calm|${off - 1}`} aria-label="Previous month" disabled={off <= -2 || undefined}><Icon n="back" s={14} /></button>
        <button type="button" className="on" style={{ minWidth: 140 }}>{mlabel}</button>
        <button type="button" data-act={`ui|calm|${off + 1}`} aria-label="Next month" disabled={off >= 1 || undefined}><Icon n="chev" s={14} /></button>
      </div>
      {role !== 'agent' ? (
        <div className="seg">
          <button type="button" className={view === 'team' ? 'on' : ''} data-act="ui|calv|team">Everyone</button>
          <button type="button" className={view === 'person' ? 'on' : ''} data-act="ui|calv|person">One person</button>
        </div>
      ) : null}
      {role === 'admin' ? <Sel bind="calt" cur={tf} opts={[['all', 'All teams'], ...S.teams.map((t: any) => [t.id, t.name] as [string, string])]} /> : null}
      {view === 'person' && role !== 'agent' ? <Sel bind="calp" cur={pid} opts={people.map((x) => [x.id, x.name + (x.role === 'mgmt' ? ' (Manager)' : '')] as [string, string])} /> : null}
    </div>
  );

  if (view === 'person') {
    const who = eng.userById(pid);
    const infos: [number, any][] = days.map((d) => [d, eng.dayInfo(pid, d)]);
    const c = (k: string) => infos.filter((x) => x[1].k === k).length;
    const lead = (eng.dowOf(days[0]) + 6) % 7;
    const leaveTypes = [...new Set(infos.filter((x) => x[1].k === 'leave').map((x) => x[1].t))].join(', ');
    return (
      <>
        {nav}
        <div className="grid g4c keep mb16">
          <Kpi l="On time" n={String(c('ok'))} d="days" />
          <Kpi l="Late in" n={String(c('late'))} d={'after ' + hmOf(SHIFT.start + SHIFT.grace)} cls={c('late') ? 'warn' : ''} />
          <Kpi l="Left early or missed" n={String(c('early') + c('miss'))} d="Can be regularised" />
          <Kpi l="Leave" n={String(c('leave'))} d={leaveTypes || 'None'} />
        </div>
        <Card title={who.name + (role !== 'agent' ? ' · ' + eng.roleTeam(who.id) : '')}>
          <div className="calwk">{WEEK.map((d) => <span key={d}>{d}</span>)}</div>
          <div className="calgrid">
            {Array.from({ length: lead }, (_, k) => <span key={'p' + k} className="cday pad" />)}
            {infos.map(([d, i]) => <DayCell key={d} pid={pid} d={d} i={i} />)}
          </div>
          <AttLegend />
        </Card>
      </>
    );
  }

  /* Everyone: one row per person, one column per day. */
  const pend = S.leave.filter((l: any) => l.status === 'pending' && people.some((p) => p.id === l.user));
  const rgo = role === 'admin' ? 'admin-hr-leave' : 'mgmt-leave';
  return (
    <>
      {nav}
      {pend.length ? (
        <div className="mb16">
          <Bn kind="info" title={pend.length + ' leave request' + (pend.length > 1 ? 's' : '') + ' waiting'} body="Shown on the calendar with a dashed outline until decided."
            acts={<a className="btn s" href={'#' + rgo} data-go={rgo}>Review</a>} />
        </div>
      ) : null}
      <Card bare>
        <div className="tw attmw">
          <table className="attm">
            <thead>
              <tr>
                <th className="nm">Person</th>
                {days.map((d) => (
                  <th key={d} className={`${isWe(d) ? 'we' : ''} ${eng.sameDay(d, eng.NOW()) ? 'td' : ''}`}><span>{f2(d, { weekday: 'narrow' })}</span>{f2(d, { day: 'numeric' })}</th>
                ))}
                <th className="num">On time</th><th className="num">Late</th><th className="num">Leave</th>
              </tr>
            </thead>
            <tbody>
              {people.map((p) => {
                const inf: [number, any][] = days.map((d) => [d, eng.dayInfo(p.id, d)]);
                const c = (k: string) => inf.filter((x) => x[1].k === k).length;
                return (
                  <tr key={p.id}>
                    <td className="nm">
                      <button type="button" className="lnkb" data-act={`calpick|${p.id}`}>{p.name}</button>
                      <div className="xs faint">{p.role === 'mgmt' ? 'Manager' : eng.teamName(p.team)}</div>
                    </td>
                    {inf.map(([d, i]) => (
                      <td key={d} className={isWe(d) ? 'we' : ''}>
                        {!['future', 'off'].includes(i.k)
                          ? <button type="button" className={'mc k-' + i.k} data-open={`att-day|${p.id}|${d}`}
                              title={`${p.name} · ${fds(d)} · ${i.t}${i.in ? ' · in ' + fhm(i.in) : ''}${i.out ? ' · out ' + fhm(i.out) : ''}`}>{i.ab}</button>
                          : <span className={'mc k-' + i.k}>{i.ab}</span>}
                      </td>
                    ))}
                    <td className="num sm">{c('ok')}</td>
                    <td className={'num sm ' + (c('late') ? 'warntx' : '')}>{c('late')}</td>
                    <td className="num sm">{c('leave')}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div style={{ padding: '0 16px 14px' }}><AttLegend /></div>
      </Card>
    </>
  );
}

/* A Attendance calendar (prototype route agent-attcal) */
export const AgentAttCal: ScreenComp = () => (
  <>
    <PgHead t="Attendance" sub="Every day this month: on time, late, leave and missed punches." />
    <AttTabs cur="cal" />
    <AttCalendar role="agent" />
  </>
);

/* M Team attendance calendar (prototype route mgmt-attcal) */
export const MgmtAttCal: ScreenComp = () => (
  <>
    <PgHead t="Team Attendance" sub={'Leave and punch timing for everyone in ' + eng.teamName(eng.me().team) + '.'} />
    <AttTabs cur="cal" />
    <AttCalendar role="mgmt" />
  </>
);
