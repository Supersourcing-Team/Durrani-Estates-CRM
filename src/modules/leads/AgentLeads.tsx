/* A03 My Leads (prototype route agent-leads): view pills, search, filters and the lead table. */
import React from 'react';
import { eng } from '../../engine';
import { Bn, Icon, PgHead, Search, Sel } from '../../ui';
import type { ScreenComp } from '../../app/types';
import { LeadTable } from './LeadTable';

const PILLS: [string, string][] = [['all', 'All'], ['today', 'Due today'], ['overdue', 'Overdue'], ['risk', 'At risk'], ['hot', 'Hot'], ['fresh', 'Not contacted'], ['archived', 'Archived']];

export const AgentLeads: ScreenComp = () => {
  const UI = eng.UI;
  const u = eng.me(), a: any[] = eng.leadsOf(u.id), c = eng.capInfo(u.id), v = UI.f.lv || 'all';
  const cnt: Record<string, number> = {
    all: a.length,
    today: a.filter((l) => eng.isToday(l) && !l.next.done).length,
    overdue: a.filter(eng.isOverdue).length,
    risk: a.filter((l) => eng.leadRisk(l).state === 'risk').length,
    hot: a.filter((l) => l.temp === 'hot').length,
    fresh: a.filter((l) => !l.attempts || l.stage === 'New').length,
    archived: eng.archivedOf(u.id).length,
  };
  const list: any[] = eng.agentLeadsFiltered(u.id);

  return (
    <>
      <PgHead t="My Leads" sub={`${c.used} active of ${c.cap} allowed. ${c.left} slot${c.left === 1 ? '' : 's'} left.`}
        right={<button className="btn pri" type="button" data-open={c.full ? 'blocked|x|cap' : 'add-lead'}><Icon n="plus" s={16} />Add lead</button>} />
      {c.full ? <div className="mb16"><Bn kind="warn" title="You are at your active lead ceiling" body="You cannot receive or add leads until you close or return some. Ask your manager if you need more room." /></div> : null}
      <div className="pills mb16">
        {PILLS.map(([k, t]) => (
          <button key={k} type="button" className={`pill ${v === k ? 'on' : ''} ${k === 'risk' || k === 'overdue' ? 'dg' : ''}`} data-act={`ui|lv|${k}`}>{t} <b>{cnt[k]}</b></button>
        ))}
      </div>
      <div className="row g6 wrap mb16 fbar">
        <div style={{ flex: 1, minWidth: 220 }}><Search bind="lq" val={UI.f.lq} ph="Search name, phone or lead ID" /></div>
        <Sel bind="lt" cur={UI.f.lt || 'all'} opts={[['all', 'Any temperature'], ['hot', 'Hot'], ['warm', 'Warm'], ['cold', 'Cold']]} />
        <Sel bind="lk" cur={UI.f.lk || 'all'} opts={[['all', 'All tracks'], ['property', 'Property Sale'], ['cn', 'Convertible Notes'], ['secondary', 'Secondary Market']]} />
        <Sel bind="ls" cur={UI.f.ls || 'prio'} opts={[['prio', 'Sort: Priority'], ['new', 'Sort: Newest'], ['old', 'Sort: Longest idle'], ['name', 'Sort: Name']]} />
      </div>
      <section className="card flat"><LeadTable list={list} role="agent" pageKey="leads" per={10} /></section>
    </>
  );
};
