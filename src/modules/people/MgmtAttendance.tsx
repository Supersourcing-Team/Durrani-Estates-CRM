/* M Team Attendance (prototype route mgmt-attendance, with the attendance tabs and "Apply for my leave" added in later files). */
import React from 'react';
import { eng, fd, fhm } from '../../engine';
import { Btn, Card, Chip, Empty, Kpi, PgHead } from '../../ui';
import type { ScreenComp } from '../../app/types';
import { AttTabs, RegTable } from './parts';

export const MgmtAttendance: ScreenComp = () => {
  const S = eng.S, NOW = eng.NOW();
  const ag: any[] = eng.myTeam();
  const ids: string[] = eng.teamIds();
  const rq: any[] = S.reg.filter((r: any) => ids.includes(r.user) && r.status !== 'none');
  const pend = rq.filter((r) => r.status === 'pending');
  const st = (id: string): string => eng.todayStat(id);

  return (
    <>
      <PgHead t="Team Attendance" sub={fd(NOW) + ' · ' + ag.length + ' agents'} right={<Btn open="leave-req" ic="cal">Apply for my leave</Btn>} />
      <AttTabs cur="team" />
      <div className="grid g4c keep mb16">
        {['Present', 'Late', 'Absent', 'On leave'].map((k) => <Kpi key={k} l={k} n={String(ag.filter((a) => st(a.id) === k).length)} />)}
      </div>
      <Card title="Today" bare cls="mb16">
        <div className="tw">
          <table className="tbl">
            <thead><tr><th>Agent</th><th>Status</th><th>Punched in</th><th>Punched out</th></tr></thead>
            <tbody>
              {ag.map((a) => {
                const p = eng.punchState(a.id), ta = S.todayAtt[a.id];
                return (
                  <tr key={a.id}>
                    <td><a href={'#mgmt-agent-' + a.id} data-go={'mgmt-agent-' + a.id}>{a.name}</a></td>
                    <td><Chip t={st(a.id)} cls={eng.TST[st(a.id)] || 's2'} /></td>
                    <td>{ta && ta.in ? fhm(ta.in) : p.in ? fhm(p.t) : <span className="faint">None</span>}</td>
                    <td>{p.outAt && eng.sameDay(p.outAt, NOW) ? fhm(p.outAt) : <span className="faint">None</span>}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
      <Card title={'Regularisation requests (' + pend.length + ' pending)'} bare>
        {rq.length ? <RegTable rq={rq} who="Agent" /> : <Empty icn="check" t="No requests" d="Agents can ask to correct a missed punch." />}
      </Card>
    </>
  );
};
