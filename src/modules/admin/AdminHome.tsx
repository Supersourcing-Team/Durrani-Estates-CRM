/* AD06 Admin Home Dashboard (prototype route admin-home). */
import React from 'react';
import { eng, money, fd, rel, sum } from '../../engine';
import { Card, Chip, Dl, Empty, Kpi, LeadLinks, PgHead } from '../../ui';
import type { ScreenComp } from '../../app/types';
import { Tc } from './parts';

export const AdminHome: ScreenComp = () => {
  const S = eng.S;
  const NOW = eng.NOW();
  const rv: any[] = eng.pendingReview().sort((a: any, b: any) => a.at - b.at);
  const pool: any[] = eng.poolLeads();
  const risk = S.leads.filter((l: any) => l.owner && eng.leadRisk(l).state === 'risk');
  const agents: any[] = eng.agentsAll();
  const rev = sum(agents, (u: any) => eng.revOf(u.id));
  const elig = S.bookings.filter((b: any) => eng.comm(b).st === 'eligible');

  const teamRows = S.teams.map((t: any) => {
    const ag: any[] = eng.agentsOf(t.id);
    return { t, rev: sum(ag, (a: any) => eng.revOf(a.id)), n: ag.length, leads: eng.teamLeads(t.id).length };
  });

  return (
    <>
      <PgHead t="Home Dashboard" sub={fd(NOW) + ' · ' + agents.length + ' agents across ' + S.teams.length + ' teams'} />
      <div className="grid g4c keep mb16">
        <Kpi l="Awaiting your review" n={String(rv.length)} d="Bookings, documents, notes, requests" go="admin-review" cls={rv.length ? 'warn' : ''} />
        <Kpi l="Leads in the pool" n={String(pool.length)} d="Waiting to be assigned" go="admin-assign" />
        <Kpi l="Revenue" n={money(rev)} d="Approved and closed bookings" go="admin-reports" />
        <Kpi l="Incentives ready" n={String(elig.length)} d={money(sum(elig, (b: any) => eng.comm(b).inc)) + ' to release'} go="admin-commission" />
      </div>

      <div className="grid g21">
        <div className="col g16">
          <Card title="Review queue" bare right={<a className="btn s" href="#admin-review" data-go="admin-review">All {rv.length}</a>}>
            {rv.length ? (
              <div className="tw"><table className="tbl">
                <thead><tr><th>Type</th><th>Item</th><th>From</th><th>Waiting</th><th></th></tr></thead>
                <tbody>
                  {rv.slice(0, 7).map((it, i) => {
                    const go = eng.reviewGo(it), rt = eng.RT[it.type], title = eng.reviewTitle(it), who = eng.reviewWho(it), wait = rel(it.at).replace(' ago', '');
                    return (
                      <tr key={i} className="click" data-go={go}>
                        <Tc first l="Type" t={rt[0]}><Chip t={rt[0]} cls={rt[1]} /></Tc>
                        <Tc l="Item" className="sm b" t={title}><LeadLinks text={title} /></Tc>
                        <Tc l="From" className="sm">{who}</Tc>
                        <Tc l="Waiting" className="sm">{wait}</Tc>
                        <Tc l="" className="tr" t="Open"><a className="btn s pri" href={'#' + go} data-go={go}>Open</a></Tc>
                      </tr>
                    );
                  })}
                </tbody>
              </table></div>
            ) : <Empty icn="check" t="Nothing waiting" d="New bookings, documents and requests show up here." />}
          </Card>

          <Card title="Teams" bare>
            <div className="tw"><table className="tbl">
              <thead><tr><th>Team</th><th>Manager</th><th className="num">Agents</th><th className="num">Active leads</th><th className="num">Revenue</th></tr></thead>
              <tbody>
                {teamRows.map((r: any) => (
                  <tr key={r.t.id} className="click" data-go="admin-people-teams">
                    <Tc first l="Team" className="b">{r.t.name}</Tc>
                    <Tc l="Manager">{eng.uname(r.t.mgr)}</Tc>
                    <Tc l="Agents" className="num">{String(r.n)}</Tc>
                    <Tc l="Active leads" className="num">{String(r.leads)}</Tc>
                    <Tc l="Revenue" className="num">{money(r.rev)}</Tc>
                  </tr>
                ))}
              </tbody>
            </table></div>
          </Card>
        </div>

        <div className="col g16">
          <Card title="Lead health" right={<a className="btn s" href="#admin-leads" data-go="admin-leads">Leads</a>}>
            <Dl items={[
              ['In the pool', <b>{pool.length}</b>],
              ['At risk of auto-return', <b className={risk.length ? 'dangertx' : ''}>{risk.length}</b>],
              ['Active leads', <b>{S.leads.filter((l: any) => l.owner && !l.archived).length}</b>],
              ['Rules', `${S.set.inactX} days to at risk, ${S.set.inactY} more to return`],
            ]} />
          </Card>
          <Card title="Latest audit" right={<a className="btn s" href="#admin-audit" data-go="admin-audit">Open</a>}>
            {S.audit.length ? S.audit.slice(0, 5).map((a: any) => (
              <div key={a.id} style={{ padding: '8px 0', borderBottom: '1px solid var(--bd-s)' }}>
                <div className="sm"><b><LeadLinks text={a.action} /></b><LeadLinks text={' · ' + a.entity} /></div>
                <div className="xs faint">{(eng.uname(a.actor) || 'System') + ' · ' + rel(a.at)}</div>
              </div>
            )) : <p className="muted sm">Nothing yet.</p>}
          </Card>
        </div>
      </div>
    </>
  );
};
