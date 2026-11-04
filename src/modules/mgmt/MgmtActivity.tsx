/* M10 Team Activity (prototype route mgmt-activity): KPIs, agent / type filters, paged activity table. */
import React from 'react';
import { eng, fhm } from '../../engine';
import { Card, Empty, Kpi, PgHead, Sel, paged } from '../../ui';
import type { ScreenComp } from '../../app/types';

const KINDS: [string, string][] = [['all', 'All'], ['call', 'Calls'], ['meet', 'Meetings']];

export const MgmtActivity: ScreenComp = () => {
  const S = eng.S, UI = eng.UI, NOW = eng.NOW();
  const ids: string[] = eng.teamIds();
  const f = UI.f.af || 'all', ag = UI.f.aa || 'all';
  const l = S.activity.filter((a: any) => ids.includes(a.u) && (ag === 'all' || a.u === ag)
    && (f === 'all' || (f === 'call' && a.k === 'Call') || (f === 'meet' && a.k === 'Meeting')));
  const P = paged<any>(l, 'act', 12);
  const today = (k: string) => S.activity.filter((a: any) => ids.includes(a.u) && a.k === k && eng.sameDay(a.t, NOW)).length;
  const speed = S.speed ? Math.round(eng.sum(ids, (i: string) => S.speed[i] || 0) / ids.length) : '-';
  return (
    <>
      <PgHead t="Team Activity" sub="What your agents did, newest first. Call length is typed by the agent." />
      <div className="grid g4c keep mb16">
        <Kpi l="Calls logged today" n={String(today('Call'))} />
        <Kpi l="Meetings today" n={String(today('Meeting'))} />
        <Kpi l="Speed to lead" n={speed + ' min'} d={'Target ' + S.set.speed + ' min'} />
        <Kpi l="Agents punched in" n={ids.filter((i) => eng.punchState(i).in).length + ' / ' + ids.length} />
      </div>
      <div className="row g6 wrap mb16 fbar">
        <Sel bind="aa" cur={ag} opts={[['all', 'All agents'], ...eng.myTeam().map((a: any) => [a.id, a.name] as [string, string])]} />
        <div className="seg">
          {KINDS.map(([k, t]) => <button key={k} type="button" className={f === k ? 'on' : ''} data-act={`ui|af|${k}`}>{t}</button>)}
        </div>
      </div>
      <Card bare>
        {l.length ? (
          <>
            <div className="tw">
              <table className="tbl">
                <thead><tr><th>Time</th><th>Agent</th><th>Activity</th><th>Lead</th><th>Outcome</th><th>Next step</th></tr></thead>
                <tbody>
                  {P.items.map((a, i) => {
                    const ld = eng.leadById(a.lead);
                    return (
                      <tr key={i}>
                        <td className="sm"><b>{fhm(a.t)}</b><div className="xs faint">{eng.sameDay(a.t, NOW) ? 'Today' : eng.fds(a.t)}</div></td>
                        <td>{eng.uname(a.u)}</td>
                        <td>{a.k}</td>
                        <td>{ld ? <a href={`#mgmt-lead-${ld.id}`} data-go={`mgmt-lead-${ld.id}`}>{ld.name}</a> : null}</td>
                        <td>{a.out}</td>
                        <td className="sm">{a.next}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {P.foot}
          </>
        ) : <Empty icn="zap" t="No activity" d="Nothing matches this filter." />}
      </Card>
    </>
  );
};
