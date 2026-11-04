/* Admin Projects & Properties list (prototype route admin-projects). */
import React from 'react';
import { eng } from '../../engine';
import { Card, Empty, Icon, PgHead, Search, Sel } from '../../ui';
import type { ScreenComp } from '../../app/types';
import { ProjCard } from './shared';

export const AdminProjects: ScreenComp = () => {
  const UI = eng.UI;
  const q = (UI.f.pq || '').toLowerCase(), t = UI.f.pt || 'all', v = UI.f.pv || 'all';
  const l: any[] = eng.S.projects.filter((p: any) => (!q || (p.name + p.dev + p.area).toLowerCase().includes(q))
    && (t === 'all' || p.type === t) && (v === 'all' || (v === 'on' ? p.active : !p.active)));
  return (
    <>
      <PgHead t="Projects & Properties" sub="Projects, units and prices agents see in the catalogue."
        right={<button className="btn pri" type="button" data-open="project-edit"><Icon n="plus" s={16} />Add project</button>} />
      <div className="row g6 wrap mb16 fbar">
        <div style={{ flex: 1, minWidth: 200 }}><Search bind="pq" val={UI.f.pq} ph="Search projects, developers, areas" /></div>
        <Sel bind="pt" cur={t} opts={[['all', 'All types'], 'Apartment', 'Villa']} />
        <Sel bind="pv" cur={v} opts={[['all', 'Live and hidden'], ['on', 'Live'], ['off', 'Hidden']]} />
      </div>
      {l.length ? (
        <div className="grid g3">{l.map((p) => <ProjCard key={p.id} p={p} role="admin" hidden={!p.active} />)}</div>
      ) : (
        <Card><Empty icn="building" t="No projects match" d="Clear the search or filters." act={<button className="btn" type="button" data-act="clearf">Clear filters</button>} /></Card>
      )}
    </>
  );
};
