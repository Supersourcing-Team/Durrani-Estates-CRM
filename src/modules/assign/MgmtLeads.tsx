/* M09 Team Leads (prototype route mgmt-leads, tabs: all leads / escalations). */
import React from 'react';
import { eng, rel } from '../../engine';
import { Card, Chip, Empty, LeadLinks, PgHead, Search, Sel, Tabs } from '../../ui';
import { LeadTable } from '../leads/LeadTable';
import type { ScreenComp } from '../../app/types';

export const MgmtLeads: ScreenComp = ({ params }) => {
  const UI = eng.UI;
  const u = eng.me();
  const tab = params[0] === 'esc' ? 'esc' : 'all';
  const esc_: any[] = eng.teamEsc();
  const open = esc_.filter((e) => e.status === 'open');

  const hdr = (
    <>
      <PgHead t="Team Leads" sub={'Every active lead in ' + eng.teamName(u.team) + '. Open a lead to reassign, hold or nudge.'} />
      <Tabs cur={tab} items={[
        { k: 'all', l: 'All leads', go: 'mgmt-leads', n: eng.teamLeads(u.team).length },
        { k: 'esc', l: 'Escalations', go: 'mgmt-leads-esc', n: open.length },
      ]} />
    </>
  );

  if (tab === 'esc') {
    const rows = esc_.sort((a, b) => (a.status === 'open' ? 0 : 1) - (b.status === 'open' ? 0 : 1) || b.at - a.at);
    return (
      <>
        {hdr}
        <Card bare>
          {esc_.length ? (
            <div className="tw">
              <table className="tbl">
                <thead><tr><th>Lead</th><th>Agent</th><th>Request</th><th>Raised</th><th>Status</th><th></th></tr></thead>
                <tbody>
                  {rows.map((e, i) => (
                    <tr key={e.lead.id + '-' + i}>
                      <td>
                        <a className="b" href={`#mgmt-lead-${e.lead.id}`} data-go={`mgmt-lead-${e.lead.id}`}>{e.lead.name}</a>
                        <div className="xs faint"><LeadLinks text={'LEAD-' + e.lead.id} /></div>
                      </td>
                      <td>{eng.uname(e.by)}</td>
                      <td className="sm" style={{ maxWidth: 340 }}><LeadLinks text={e.reason} /></td>
                      <td className="sm">{rel(e.at)}</td>
                      <td>{e.status === 'open' ? <Chip t="Open" cls="s5" /> : <Chip t="Resolved" cls="s6" />}</td>
                      <td className="tr">
                        {e.status === 'open'
                          ? <button className="btn pri s" type="button" data-open={`esc-respond|${e.lead.id}`}>Respond</button>
                          : <span className="sm muted"><LeadLinks text={(e.resp || '').slice(0, 40)} /></span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : <Empty icn="flag" t="No escalations" d="Agents raise these when they need a decision." />}
        </Card>
      </>
    );
  }

  /* All leads: filters, then the shared lead table */
  let list: any[] = eng.teamLeads(u.team);
  const q = (UI.f.mq2 || '').toLowerCase(), ag = UI.f.ma || 'all', t = UI.f.mt2 || 'all', v = UI.f.mv || 'all';
  list = list.filter((l) => (!q || (l.name + l.phone + l.id).toLowerCase().includes(q))
    && (ag === 'all' || l.owner === ag)
    && (t === 'all' || l.temp === t)
    && (v === 'all' || (v === 'risk' ? eng.leadRisk(l).state === 'risk' : v === 'overdue' ? eng.isOverdue(l) : v === 'hold' ? !!l.hold : v === 'esc' ? l.esc && l.esc.status === 'open' : true)));
  list.sort((a, b) => eng.prio(a) - eng.prio(b));

  return (
    <>
      {hdr}
      <div className="row g6 wrap mb16 fbar">
        <div style={{ flex: 1, minWidth: 220 }}><Search bind="mq2" val={UI.f.mq2} ph="Search name, phone or lead ID" /></div>
        <Sel bind="ma" cur={ag} opts={[['all', 'All agents'], ...eng.myTeam().map((a: any) => [a.id, a.name] as [string, string])]} />
        <Sel bind="mt2" cur={t} opts={[['all', 'Any temperature'], ['hot', 'Hot'], ['warm', 'Warm'], ['cold', 'Cold']]} />
        <Sel bind="mv" cur={v} opts={[['all', 'All leads'], ['risk', 'At risk'], ['overdue', 'Overdue'], ['hold', 'On hold'], ['esc', 'Escalated']]} />
      </div>
      <section className="card flat"><LeadTable list={list} role="mgmt" pageKey="ml" per={12} owner /></section>
    </>
  );
};
