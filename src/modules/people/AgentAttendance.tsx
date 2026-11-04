/* A Attendance (prototype route agent-attendance, with the 15a-att tabs and manager wording). Also used by mgmt-myatt. */
import React from 'react';
import { eng, fhm, fds, f2 } from '../../engine';
import { Btn, Card, Chip, Empty, Kpi, PgHead } from '../../ui';
import type { ScreenComp } from '../../app/types';
import { ATT_CLS, AttTabs, ReqActs, ReqChip, ShiftCard } from './parts';

export const AgentAttendance: ScreenComp = () => {
  const S = eng.S;
  const u = eng.me();
  const rows: any[] = S.att.filter((a: any) => a.u === u.id).sort((a: any, b: any) => b.date - a.date);
  const p = eng.punchState(u.id);
  const ta = S.todayAtt[u.id];
  const cnt = (k: string) => rows.filter((r) => r.st === k).length;
  const lv: any[] = S.leave.filter((l: any) => l.user === u.id).sort((a: any, b: any) => b.from - a.from);
  const sub = u.role === 'mgmt' ? 'Your own punches and leave. Admin approves your requests.' : 'Your punches, exceptions and leave requests.';

  return (
    <>
      <PgHead t="Attendance" sub={sub} right={<Btn open="leave-req" ic="cal">Request leave</Btn>} />
      <AttTabs cur="mine" />
      <div className="mb16"><ShiftCard /></div>

      <div className="grid g4c keep mb16">
        <Kpi l="Today" n={ta ? ta.st : p.in ? 'Working' : 'Not in'} d={p.in ? 'Since ' + fhm(p.t) : 'No punch yet'} />
        <Kpi l="Present days" n={String(cnt('Present'))} d="Last 14 days" />
        <Kpi l="Late" n={String(cnt('Late'))} d="Last 14 days" />
        <Kpi l="Needs fixing" n={String(rows.filter((r) => ['Miss punch', 'Absent', 'Early leave'].includes(r.st)).length)} d="Request regularisation" />
      </div>

      <Card title="Recent days" bare cls="mb16">
        <div className="tw">
          <table className="tbl">
            <thead><tr><th>Date</th><th>Status</th><th>In</th><th>Out</th><th></th></tr></thead>
            <tbody>
              {rows.map((r) => {
                const rq = S.reg.filter((x: any) => x.user === u.id && x.date === r.date && !['none', 'withdrawn'].includes(x.status)).pop();
                const ex = ['Late', 'Miss punch', 'Absent', 'Early leave'].includes(r.st);
                return (
                  <tr key={r.date}>
                    <td>{f2(r.date, { weekday: 'short', day: 'numeric', month: 'short' })}</td>
                    <td><Chip t={r.st} cls={ATT_CLS[r.st] || 's2'} /></td>
                    <td>{r.in ? fhm(r.in) : <span className="faint">None</span>}</td>
                    <td>{r.out ? fhm(r.out) : <span className="faint">None</span>}</td>
                    <td className="tr">
                      {rq ? (
                        <div className="row g6 end" style={{ flexWrap: 'nowrap' }}><ReqChip x={rq} pre="Request " /><ReqActs kind="reg" x={rq} /></div>
                      ) : ex ? <button className="btn s" type="button" data-open={`regularise|${r.date}`}>Request regularisation</button> : null}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <Card title="Leave requests" bare>
        {lv.length ? (
          <div className="tw">
            <table className="tbl">
              <thead><tr><th>Type</th><th>Dates</th><th className="num">Days</th><th>Reason</th><th>Status</th><th></th></tr></thead>
              <tbody>
                {lv.map((l) => (
                  <tr key={l.id}>
                    <td>{l.type}</td>
                    <td>{fds(l.from)}{l.days > 1 ? ' to ' + fds(l.to) : ''}</td>
                    <td className="num">{l.days}</td>
                    <td className="sm">{l.reason}</td>
                    <td><ReqChip x={l} /></td>
                    <td className="tr"><ReqActs kind="leave" x={l} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <Empty icn="cal" t="No leave requests" d="Request leave and your manager approves it. There are no balances to track." />}
      </Card>
    </>
  );
};
