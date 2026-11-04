/* Manager Bookings list (prototype route mgmt-bookings): the team's bookings, read only. */
import React from 'react';
import { eng, money } from '../../engine';
import { Card, Kpi, PgHead } from '../../ui';
import type { ScreenComp } from '../../app/types';
import { BookingTable } from './shared';

const inGroup = (b: any, k: string) =>
  k === 'open' ? ['pending', 'changes'].includes(b.status)
    : k === 'deal' ? b.status === 'approved'
      : k === 'done' ? b.status === 'closed'
        : ['rejected', 'expired'].includes(b.status);

const PILLS: [string, string][] = [['all', 'All'], ['open', 'Awaiting Admin'], ['deal', 'In progress'], ['done', 'Closed'], ['bad', 'Rejected or expired']];

export const MgmtBookings: ScreenComp = () => {
  const l: any[] = eng.teamBookings().sort((a: any, b: any) => b.submitted - a.submitted);
  const f = eng.UI.f.mbf || 'all';
  const fl = l.filter((b) => f === 'all' || inGroup(b, f));
  return (
    <>
      <PgHead t="Bookings" sub="Your team's bookings. Admin approves them. You can read everything but not change it." />
      <div className="grid g4c keep mb16">
        <Kpi l="Awaiting Admin" n={String(l.filter((b) => inGroup(b, 'open')).length)} />
        <Kpi l="In progress" n={String(l.filter((b) => inGroup(b, 'deal')).length)} />
        <Kpi l="Closed" n={String(l.filter((b) => inGroup(b, 'done')).length)} />
        <Kpi l="Approved value" n={money(eng.sum(l.filter((b) => ['approved', 'closed'].includes(b.status)), (b: any) => b.price))} />
      </div>
      <div className="pills mb16">
        {PILLS.map(([k, t]) => <button key={k} type="button" className={'pill ' + (f === k ? 'on' : '')} data-act={`ui|mbf|${k}`}>{t}</button>)}
      </div>
      <Card bare><BookingTable list={fl} role="mgmt" pageKey="mbk" /></Card>
    </>
  );
};
