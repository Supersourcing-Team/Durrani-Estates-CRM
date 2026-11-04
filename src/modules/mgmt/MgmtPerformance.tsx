/* M11 Performance & MIS (prototype route mgmt-performance): team KPIs, revenue bars, targets and full table. */
import React from 'react';
import { eng, money, pct } from '../../engine';
import { Bar, Card, Kpi, PgHead } from '../../ui';
import type { ScreenComp } from '../../app/types';
import { DlBtn } from './parts';

export const MgmtPerformance: ScreenComp = () => {
  const S = eng.S;
  const ag: any[] = eng.myTeam(), T = S.set.targets.agent, M = S.set.targets.mgmt;
  const rows = ag.map((a) => {
    const pf = eng.perfOf(a.id), ls = S.leads.filter((l: any) => l.owner === a.id);
    return { a, rev: eng.revOf(a.id), bk: eng.bookingsCount(a.id), calls: pf.calls, meet: pf.meet, leads: ls.length };
  }).sort((x, y) => y.rev - x.rev);
  const mx = Math.max(...rows.map((r) => r.rev), 1);
  const csv = 'Agent,Revenue (AED),Bookings,Calls,Meetings,Active leads\n' + rows.map((r) => [r.a.name, r.rev, r.bk, r.calls, r.meet, r.leads].join(',')).join('\n');
  const tr = eng.teamRev();
  const sum = (k: 'bk' | 'calls' | 'meet') => eng.sum(rows, (r: any) => r[k]);
  const hit = (ok: boolean) => 'num ' + (ok ? 'oktx b' : '');
  return (
    <>
      <PgHead t="Performance & MIS" sub="October 2026 to date. Revenue counts only approved or closed bookings."
        right={<DlBtn label="Download CSV" text={csv} name="export.csv" />} />
      <div className="grid g4c keep mb16">
        <Kpi l="Team revenue" n={money(tr)} d={pct(tr, M.rev) + '% of ' + money(M.rev)} />
        <Kpi l="Bookings" n={String(sum('bk'))} d={'Target ' + M.book} />
        <Kpi l="Calls" n={String(sum('calls'))} d={'Target ' + T.calls * ag.length} />
        <Kpi l="Meetings" n={String(sum('meet'))} d={'Target ' + T.meet * ag.length} />
      </div>
      <div className="grid g2 mb16">
        <Card title="Revenue by agent">
          <div className="col g16">
            {rows.map((r) => <div key={r.a.id}><div className="row sb sm"><span>{r.a.name}</span><b>{money(r.rev)}</b></div><Bar p={pct(r.rev, mx)} /></div>)}
          </div>
        </Card>
        <Card title="Targets per agent" bare>
          <div className="tw">
            <table className="tbl">
              <thead><tr><th>Agent</th><th className="num">Revenue</th><th className="num">Calls</th><th className="num">Meetings</th></tr></thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.a.id}>
                    <td>{r.a.name}</td>
                    <td className={hit(r.rev >= T.rev)}>{pct(r.rev, T.rev)}%</td>
                    <td className={hit(r.calls >= T.calls)}>{pct(r.calls, T.calls)}%</td>
                    <td className={hit(r.meet >= T.meet)}>{pct(r.meet, T.meet)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
      <Card title="Full table" bare>
        <div className="tw">
          <table className="tbl">
            <thead><tr><th>Agent</th><th className="num">Revenue</th><th className="num">Bookings</th><th className="num">Calls</th><th className="num">Meetings</th><th className="num">Active leads</th></tr></thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.a.id} className="click" data-go={`mgmt-agent-${r.a.id}`}>
                  <td><a href={`#mgmt-agent-${r.a.id}`} data-go={`mgmt-agent-${r.a.id}`}>{r.a.name}</a></td>
                  <td className="num">{eng.mfull(r.rev)}</td>
                  <td className="num">{r.bk}</td>
                  <td className="num">{r.calls}</td>
                  <td className="num">{r.meet}</td>
                  <td className="num">{r.leads}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
};
