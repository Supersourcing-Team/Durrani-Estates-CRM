/* A08 Project Catalogue (prototype routes agent-catalogue and mgmt-projects; same render, title differs by role). */
import React from 'react';
import { eng } from '../../engine';
import { Card, Empty, PgHead } from '../../ui';
import type { ScreenComp } from '../../app/types';
import { ProjCard, ProjToolbar } from './shared';

function CataloguePage({ role }: { role: 'agent' | 'mgmt' }) {
  const l: any[] = eng.projFilter().sort((a: any, b: any) => (b.pri ? 1 : 0) - (a.pri ? 1 : 0));
  return (
    <>
      <PgHead t={role === 'agent' ? 'Project Catalogue' : 'Projects'} sub="Live inventory and payment plans. Unit status updates as Admin approves bookings." />
      <ProjToolbar />
      {l.length ? (
        <div className="grid g3">{l.map((p) => <ProjCard key={p.id} p={p} role={role} />)}</div>
      ) : (
        <Card><Empty icn="building" t="No projects match" d="Clear the search or filters." act={<button className="btn" type="button" data-act="clearf">Clear filters</button>} /></Card>
      )}
    </>
  );
}

export const Catalogue: ScreenComp = () => <CataloguePage role="agent" />;
/** Manager: mgmt-projects */
export const MgmtProjects: ScreenComp = () => <CataloguePage role="mgmt" />;
