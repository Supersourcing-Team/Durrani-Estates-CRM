/* Admin Secondary Market (prototype route admin-secondary, tab 'requests', plus the 15c-deals "How it works" button and requests hint). */
import React from 'react';
import { eng } from '../../engine';
import { Card, Empty, Icon, Kpi, PgHead, Tabs } from '../../ui';
import type { ScreenComp } from '../../app/types';
import { SecTable } from './SecList';

export const SecListAdmin: ScreenComp = ({ params }) => {
  const S = eng.S;
  const tab = params[0] === 'requests' ? 'requests' : 'all';
  const req: any[] = S.sec.filter((s: any) => s.status === 'Requested');
  const list: any[] = tab === 'requests' ? req : S.sec;
  return (
    <>
      <PgHead t="Secondary Market" sub="Accept resale requests, assign a Secondary agent and set the commission."
        right={<>
          <button className="btn" type="button" data-open="sec-info"><Icon n="info" s={16} />How it works</button>
          <button className="btn pri" type="button" data-open="sec-new"><Icon n="plus" s={16} />Create listing</button>
        </>} />
      <div className="grid g4c keep mb16">
        <Kpi l="Waiting for you" n={String(req.length)} d="New requests" cls={req.length ? 'warn' : ''} go="admin-secondary-requests" />
        <Kpi l="Live listings" n={String(S.sec.filter((s: any) => s.kind === 'seller' && ['Active', 'Negotiation'].includes(s.status)).length)} />
        <Kpi l="Buyer requests" n={String(S.sec.filter((s: any) => s.kind === 'buyer' && !['Closed', 'Lost', 'Declined'].includes(s.status)).length)} />
        <Kpi l="Matched" n={String(S.sec.filter((s: any) => s.status === 'Matched').length)} />
      </div>
      <Tabs items={[{ k: 'all', l: 'All', go: 'admin-secondary', n: S.sec.length }, { k: 'requests', l: 'Requests', go: 'admin-secondary-requests', n: req.length }]} cur={tab} />
      {tab === 'requests' ? <p className="muted sm mt8 mb8">Agents raised these. Approving a seller request publishes it as a live listing for every agent. Approving a buyer request assigns a Secondary agent to find a match.</p> : null}
      <Card title="" bare>
        {list.length ? <SecTable rows={list} role="admin" /> : <Empty icn="store" t="Nothing waiting" d="New requests from agents show here." />}
      </Card>
    </>
  );
};
