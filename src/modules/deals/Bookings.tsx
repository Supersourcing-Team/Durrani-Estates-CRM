/* Bookings list (prototype route agent-bookings). */
import React from 'react';
import { eng } from '../../engine';
import { Bn, Card, Icon, Kpi, PgHead } from '../../ui';
import type { ScreenComp } from '../../app/types';
import { BookingTable } from './shared';

const inGroup = (b: any, k: string) =>
  k === 'open' ? ['pending', 'changes'].includes(b.status)
    : k === 'deal' ? b.status === 'approved'
      : k === 'done' ? b.status === 'closed'
        : ['rejected', 'expired'].includes(b.status);

const PILLS: [string, string][] = [['all', 'All'], ['open', 'Awaiting Admin'], ['deal', 'In progress'], ['done', 'Closed'], ['bad', 'Rejected or expired']];

export const Bookings: ScreenComp = () => {
  const S = eng.S;
  const u = eng.me();
  const all: any[] = S.bookings.filter((b: any) => b.agent === u.id);
  const f = eng.UI.f.bf || 'all';
  const list = all.filter((b) => f === 'all' || inGroup(b, f)).sort((a, b) => b.submitted - a.submitted);
  const c = (k: string) => all.filter((b) => inGroup(b, k)).length;
  const chg = all.filter((b) => b.status === 'changes');

  return (
    <>
      <PgHead t="Bookings" sub="Raise a booking to hold a unit while Admin reviews it. Revenue counts only after approval."
        right={<a className="btn pri" href="#agent-bookingnew" data-go="agent-bookingnew"><Icon n="plus" s={16} />New booking</a>} />
      {chg.length ? (
        <div className="mb16">
          <Bn kind="warn" title={chg.length + ' booking' + (chg.length > 1 ? 's' : '') + ' need changes'} body="Fix them before the unit hold ends."
            acts={<>{chg.map((b) => { const g = 'agent-booking-' + eng.bkP(b.id); return <a key={b.id} className="btn s" href={'#' + g} data-go={g}>{b.id}</a>; })}</>} />
        </div>
      ) : null}
      <div className="grid g4c keep mb16">
        <Kpi l="Awaiting Admin" n={String(c('open'))} d={'Unit held ' + S.set.holdHours + 'h'} act="ui|bf|open" />
        <Kpi l="Approved, in progress" n={String(c('deal'))} d="Documents to complete" act="ui|bf|deal" />
        <Kpi l="Closed" n={String(c('done'))} d="Commission starts here" act="ui|bf|done" />
        <Kpi l="Rejected or expired" n={String(c('bad'))} d="Unit released" act="ui|bf|bad" />
      </div>
      <div className="pills mb16">
        {PILLS.map(([k, t]) => <button key={k} type="button" className={'pill ' + (f === k ? 'on' : '')} data-act={`ui|bf|${k}`}>{t}</button>)}
      </div>
      <Card bare><BookingTable list={list} role="agent" pageKey="bk" /></Card>
    </>
  );
};
