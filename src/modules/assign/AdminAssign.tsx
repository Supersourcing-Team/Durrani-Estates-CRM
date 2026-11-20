/* AD10 Assignments (prototype route admin-assign, final version in 15b-leads.js): the Admin pool. */
import React from 'react';
import { eng, pct, rel } from '../../engine';
import { Bar, Btn, Card, Chip, Empty, LeadLinks, PgHead, Search, Sel, paged } from '../../ui';
import { CapChip, SelBox, selIds } from './parts';
import type { ScreenComp } from '../../app/types';

export const AdminAssign: ScreenComp = () => {
  const S = eng.S, UI = eng.UI;
  const q = (UI.f.asq || '').toLowerCase(), cp = UI.f.asc || 'all';
  const pool: any[] = eng.poolLeads().filter((l: any) => (cp === 'all' || l.camp === cp) && (!q || (l.name + l.phone + l.id).toLowerCase().includes(q)));
  pool.sort((a, b) => (b.created || 0) - (a.created || 0));
  const P = paged(pool, 'adp', 12);
  const sel_ = selIds();
  const camps = [...new Set<string>(eng.poolLeads().map((l: any) => l.camp))];
  const ag: any[] = eng.agentsAll().filter((a: any) => a.status === 'active');

  return (
    <>
      <PgHead t="Assignments" sub="Leads waiting in the Admin pool. Send them to an agent or to a team queue for the manager to place." right={<>
        <Btn open="assign-info" ic="info">How it works</Btn>
        <Btn open="autodist" ic="zap">Spread evenly</Btn>
        <Btn open="assign-lead" ic="plus">Assign lead</Btn>
        <Btn cls="pri" open="bulk-reassign" ic="repeat" dis={!sel_.length}>{`Assign ${sel_.length || ''} selected`}</Btn>
      </>} />

      {/* team queues */}
      <div className="grid g2 keep mb16">
        {S.teams.map((t: any) => {
          const ql: any[] = eng.queueLeads(t.id);
          const qn = ql.length;
          return (
            <div key={t.id} className="card">
              <div className="row sb">
                <div><div className="b">{t.name} queue</div><div className="xs muted">Manager {eng.uname(t.mgr)} places these</div></div>
                <span className="h2">{qn}</span>
              </div>
              <div className="xs muted mt8">{qn ? 'Waiting for the manager. Oldest ' + rel(Math.min(...ql.map((l) => l.assigned || l.created || eng.NOW()))) : 'Empty'}</div>
            </div>
          );
        })}
      </div>

      {/* agent capacity (collapsed) */}
      <details className="card mb16">
        <summary className="row sb" style={{ cursor: 'pointer' }}>
          <span className="b">Agent capacity</span>
          <span className="xs muted">{ag.filter((a) => eng.capInfo(a.id).full).length} at ceiling · {eng.sum(ag, (a: any) => eng.capInfo(a.id).left)} free slots</span>
        </summary>
        <div className="grid g3 keep mt16">
          {ag.map((a) => {
            const c = eng.capInfo(a.id);
            return (
              <div key={a.id} className="card soft">
                <div className="row sb"><span className="b">{a.name}</span><CapChip c={c} /></div>
                <div className="xs muted">{eng.teamName(a.team)}{a.tag ? ' · ' + a.tag : ''}</div>
                <Bar p={pct(c.used, c.cap)} cls={c.full ? 'bad' : ''} />
                <div className="xs muted">{c.used} of {c.cap} active leads</div>
              </div>
            );
          })}
        </div>
      </details>

      <div className="row g6 wrap mb16 fbar">
        <div style={{ flex: 1, minWidth: 200 }}><Search bind="asq" val={UI.f.asq} ph="Search the pool" /></div>
        <Sel bind="asc" cur={cp} opts={[['all', 'All campaigns'], ...camps.map((c) => [c, c] as [string, string])]} />
        {sel_.length ? <button className="btn s" type="button" data-act="ui|sel|">Clear {sel_.length} selected</button> : null}
      </div>

      <Card title={'Admin pool (' + pool.length + ')'} bare>
        {pool.length ? (
          <>
            <div className="tw">
              <table className="tbl">
                <thead><tr><th className="sel"></th><th>Lead</th><th>Campaign</th><th>Country</th><th>Added</th><th></th></tr></thead>
                <tbody>
                  {P.items.map((l: any) => (
                    <tr key={l.id}>
                      <td><SelBox l={l} sel={sel_} /></td>
                      <td>
                        <a className="b" href={`#admin-lead-${l.id}`} data-go={`admin-lead-${l.id}`}>{l.name}</a>
                        <div className="xs faint"><LeadLinks text={`LEAD-${l.id} · ${l.phone}`} /></div>
                        {l.linked ? <div className="xs"><Chip t={<LeadLinks text={'Linked to LEAD-' + l.linked} />} cls="s4" dot={false} /></div> : null}
                      </td>
                      <td className="sm">{l.camp}</td>
                      <td className="sm">{l.country}</td>
                      <td className="sm">{rel(l.created)}</td>
                      <td className="tr"><button className="btn s pri" type="button" data-open={`reassign|${l.id}`}>Assign</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {P.foot}
          </>
        ) : <Empty icn="check" t="The pool is empty" d="New and returned leads show up here." act={<a className="btn pri" href="#admin-sources" data-go="admin-sources">Lead sources</a>} />}
      </Card>
    </>
  );
};
