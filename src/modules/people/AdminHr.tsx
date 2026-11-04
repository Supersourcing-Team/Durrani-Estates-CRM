/* AD HR & Attendance (prototype route admin-hr): tabs Today, Leave, Regularisation, Calendar, Locations. */
import React from 'react';
import { eng, fd, fds, fhm } from '../../engine';
import { Btn, Card, Chip, Empty, Kpi, LeadLinks, PgHead, Sel, Tabs } from '../../ui';
import type { ScreenComp } from '../../app/types';
import { AttCalendar } from './AttCalendar';
import { GeoCell, LeaveSeg, RegTable, ReqActs, ReqChip } from './parts';
import { GeoPanel } from './GeoPanel';

const HIST_CLS: Record<string, string> = { Present: 's6', Late: 's5', Absent: 's7', 'Miss punch': 's5', 'Early leave': 's5' };

/** Today tab: KPIs, who is in today, and one person's history. */
function HrToday({ ag }: { ag: any[] }) {
  const S = eng.S;
  const emp = eng.UI.f.he || ag[0].id;
  const rows: any[] = S.att.filter((a: any) => a.u === emp).sort((a: any, b: any) => b.date - a.date);
  const st = (id: string): string => eng.todayStat(id);
  return (
    <>
      <div className="grid g4c keep mb16">
        {['Present', 'Late', 'Absent', 'On leave'].map((k) => (
          <Kpi key={k} l={k} n={String(ag.filter((a) => st(a.id) === k).length)} d={k === 'Present' ? 'of ' + ag.length + ' people' : ''} />
        ))}
      </div>
      <Card title={'Today · ' + fd(eng.NOW())} bare cls="mb16">
        <div className="tw">
          <table className="tbl">
            <thead><tr><th>Person</th><th>Team</th><th>Status</th><th>Punched in</th><th>Location (IP)</th></tr></thead>
            <tbody>
              {ag.map((a) => {
                const ta = S.todayAtt[a.id], pu = eng.punchState(a.id);
                return (
                  <tr key={a.id}>
                    <td><a href={'#admin-user-' + a.id} data-go={'admin-user-' + a.id}>{a.name}</a></td>
                    <td className="sm">{eng.teamName(a.team)}</td>
                    <td><Chip t={st(a.id)} cls={eng.TST[st(a.id)] || 's2'} /></td>
                    <td className="sm">
                      {ta && ta.in ? fhm(ta.in) : pu.in ? fhm(pu.t) : <span className="faint">None</span>}
                      {a.role === 'mgmt' ? <> <Chip t="Manager" cls="s4" dot={false} /></> : null}
                    </td>
                    <td className="sm"><GeoCell uid={a.id} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
      <Card title="Attendance history" bare>
        <div style={{ padding: '12px 20px' }}><Sel bind="he" cur={emp} opts={ag.map((a) => [a.id, a.name] as [string, string])} /></div>
        {rows.length ? (
          <div className="tw">
            <table className="tbl">
              <thead><tr><th>Date</th><th>In</th><th>Out</th><th>Status</th></tr></thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.date}>
                    <td>{fd(r.date)}</td>
                    <td className="sm">{r.in ? fhm(r.in) : '-'}</td>
                    <td className="sm">{r.out ? fhm(r.out) : '-'}</td>
                    <td><Chip t={r.st} cls={HIST_CLS[r.st] || 's2'} />{r.reg === 'approved' ? <> <Chip t="Regularised" cls="s4" dot={false} /></> : null}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <Empty icn="cal" t="No history for this person" d="Records appear after they punch in." />}
      </Card>
    </>
  );
}

/** Leave tab: every leave request, filtered by status. */
function HrLeave({ pl }: { pl: number }) {
  const f = eng.UI.f.lf || 'pending';
  const l: any[] = eng.S.leave.slice().sort((a: any, b: any) => b.from - a.from).filter((x: any) => f === 'all' || x.status === f);
  return (
    <>
      <LeaveSeg f={f} pending={pl} />
      <Card bare>
        {l.length ? (
          <div className="tw">
            <table className="tbl">
              <thead><tr><th>Employee</th><th>Type</th><th>Dates</th><th className="num">Days</th><th>Reason</th><th>Status</th><th></th></tr></thead>
              <tbody>
                {l.map((x) => (
                  <tr key={x.id}>
                    <td>{eng.uname(x.user)}<div className="xs faint">{eng.roleTeam(x.user)}</div></td>
                    <td>{x.type}</td>
                    <td>{fds(x.from)}{x.days > 1 ? ' to ' + fds(x.to) : ''}</td>
                    <td className="num">{x.days}</td>
                    <td className="sm"><LeadLinks text={x.reason} /></td>
                    <td><ReqChip x={x} /></td>
                    <td className="tr"><ReqActs kind="leave" x={x} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <Empty icn="cal" t="No requests" d="Nothing waiting." />}
      </Card>
    </>
  );
}

export const AdminHr: ScreenComp = ({ params }) => {
  const S = eng.S;
  const tab = ['leave', 'reg', 'cal', 'loc'].includes(params[0]) ? params[0] : 'today';
  const ag: any[] = S.users.filter((u: any) => ['agent', 'mgmt'].includes(u.role) && u.status === 'active');
  const pl = S.leave.filter((l: any) => l.status === 'pending').length, pr = S.reg.filter((r: any) => r.status === 'pending').length;
  const rq: any[] = S.reg.filter((r: any) => r.status !== 'none');

  return (
    <>
      <PgHead t="HR & Attendance" sub="Who is in, who is off, and what needs a decision."
        right={<Btn cls="pri" open="leave-apply" ic="plus">Apply leave for an employee</Btn>} />
      <Tabs cur={tab} items={[
        { k: 'today', l: 'Today', go: 'admin-hr' },
        { k: 'leave', l: 'Leave', go: 'admin-hr-leave', n: pl },
        { k: 'reg', l: 'Regularisation', go: 'admin-hr-reg', n: pr },
        { k: 'cal', l: 'Calendar', i: 'cal', go: 'admin-hr-cal' },
        { k: 'loc', l: 'Locations', i: 'pin', go: 'admin-hr-loc', n: eng.geoFlags().length || null },
      ]} />
      {tab === 'cal' ? <AttCalendar role="admin" />
        : tab === 'loc' ? <GeoPanel />
        : tab === 'today' ? <HrToday ag={ag} />
        : tab === 'leave' ? <HrLeave pl={pl} />
        : <Card bare>{rq.length ? <RegTable rq={rq} who="Employee" /> : <Empty icn="check" t="No requests" d="Agents ask here when they miss a punch." />}</Card>}
    </>
  );
};
