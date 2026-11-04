/* M12 Agent detail for a manager (prototype route mgmt-agent-<userId>): profile, KPIs, leads and bookings. */
import React from 'react';
import { eng, ini, money } from '../../engine';
import { AvBox, Btn, Card, Chip, Empty, Kpi } from '../../ui';
import type { ScreenComp } from '../../app/types';
import { LeadTable } from '../leads/LeadTable';
import { BookingTable } from '../deals/shared';
import { TodayChip } from './parts';

export const MgmtAgent: ScreenComp = ({ params }) => {
  const S = eng.S;
  const a = eng.userById(params[0]);
  const mine = eng.me();
  if (!a || a.role !== 'agent' || a.team !== mine.team) {
    return (
      <Card>
        <Empty icn="lock" t="Agent not found in your team" d={'You can only open agents in ' + eng.teamName(mine.team) + '.'}
          act={<Btn t="Back" go="mgmt-home" cls="pri" />} />
      </Card>
    );
  }
  const ls: any[] = eng.leadsOf(a.id), c = eng.capInfo(a.id);
  const nRisk = ls.filter((l) => eng.leadRisk(l).state === 'risk').length;
  const bk = S.bookings.filter((b: any) => b.agent === a.id);
  return (
    <>
      <div className="card mb16">
        <div className="row g16 wrap">
          <AvBox cls="lg" t={ini(a.name)} />
          <div style={{ flex: 1, minWidth: 200 }}>
            <h1 className="h1" style={{ fontSize: 28 }}>{a.name}</h1>
            <div className="muted mt8">{a.emp} · {a.email} · {a.phone}</div>
            <div className="row g6 wrap mt8"><TodayChip id={a.id} />{a.tag ? <Chip t={a.tag + ' tag'} cls="s4" /> : null}</div>
          </div>
        </div>
      </div>
      <div className="grid g4c keep mb16">
        <Kpi l="Active leads" n={c.used + ' / ' + c.cap} />
        <Kpi l="Revenue" n={money(eng.revOf(a.id))} d={eng.bookingsCount(a.id) + ' bookings'} />
        <Kpi l="At risk" n={String(nRisk)} cls={nRisk ? 'warn' : ''} />
        <Kpi l="Speed to lead" n={((S.speed && S.speed[a.id]) || '-') + ' min'} d={'Target ' + S.set.speed} />
      </div>
      <Card title="Leads" bare cls="mb16">
        <LeadTable list={[...ls].sort((x, y) => eng.prio(x) - eng.prio(y))} role="mgmt" pageKey="mag" per={8} />
      </Card>
      <Card title="Bookings" bare>
        {bk.length ? <BookingTable list={bk} role="mgmt" pageKey="mab" /> : <Empty icn="file" t="No bookings" d="This agent has not raised any." />}
      </Card>
    </>
  );
};
