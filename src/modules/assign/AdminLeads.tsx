/* AD07 Leads (prototype route admin-leads): every lead in the company with view pills and filters. */
import React from 'react';
import { eng } from '../../engine';
import { Btn, PgHead, Search, Sel } from '../../ui';
import { LeadTable } from '../leads/LeadTable';
import type { ScreenComp } from '../../app/types';

const VIEWS: [string, string][] = [['all', 'All active'], ['pool', 'In pool'], ['risk', 'At risk'], ['hot', 'Hot'], ['linked', 'Linked'], ['esc', 'Escalated'], ['arch', 'Archived']];

export const AdminLeads: ScreenComp = () => {
  const S = eng.S, UI = eng.UI;
  const v = UI.f.alv || 'all', q = (UI.f.alq || '').toLowerCase(), ow = UI.f.alo || 'all', tm = UI.f.alt || 'all', cp = UI.f.alc || 'all';
  const camps = [...new Set<string>(S.leads.map((l: any) => l.camp))].sort();
  const V: Record<string, (l: any) => boolean> = {
    all: (l) => !l.archived,
    pool: (l) => !l.owner && !l.archived,
    risk: (l) => l.owner && !l.archived && eng.leadRisk(l).state === 'risk',
    hot: (l) => !l.archived && l.temp === 'hot',
    linked: (l) => !!l.linked,
    esc: (l) => l.esc && l.esc.status === 'open',
    arch: (l) => l.archived,
  };
  const cnt = (k: string) => S.leads.filter(V[k]).length;
  const ls: any[] = S.leads.filter((l: any) => V[v](l)
    && (!q || (l.name + l.phone + l.id + l.email).toLowerCase().includes(q))
    && (ow === 'all' || (ow === 'pool' ? !l.owner : l.owner === ow))
    && (tm === 'all' || eng.teamOf(l.owner) === tm)
    && (cp === 'all' || l.camp === cp));
  ls.sort((a, b) => (b.created || 0) - (a.created || 0));

  return (
    <>
      <PgHead t="Leads" sub="Every lead in the company. Open one to reassign it, read its history or see its documents." right={<>
        <Btn go="admin-import" ic="upload">Import leads</Btn>
        <Btn cls="pri" open="add-lead" ic="plus">Add lead</Btn>
      </>} />
      <div className="pills mb16">
        {VIEWS.map(([k, t]) => <button key={k} type="button" className={'pill ' + (v === k ? 'on' : '')} data-act={`ui|alv|${k}`}>{t} <span className="cnt">{cnt(k)}</span></button>)}
      </div>
      <div className="row g6 wrap mb16 fbar">
        <div style={{ flex: 1, minWidth: 220 }}><Search bind="alq" val={UI.f.alq} ph="Search name, phone, email or lead ID" /></div>
        <Sel bind="alo" cur={ow} opts={[['all', 'Any owner'], ['pool', 'Admin pool'], ...eng.agentsAll().map((a: any) => [a.id, a.name] as [string, string])]} />
        <Sel bind="alt" cur={tm} opts={[['all', 'All teams'], ...S.teams.map((t: any) => [t.id, t.name] as [string, string])]} />
        <Sel bind="alc" cur={cp} opts={[['all', 'All campaigns'], ...camps.map((c) => [c, c] as [string, string])]} />
      </div>
      <section className="card flat"><LeadTable list={ls} role="admin" pageKey="alp" per={12} owner /></section>
    </>
  );
};
