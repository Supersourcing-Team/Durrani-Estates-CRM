/* AD15 Commission list (prototype route admin-commission). Filter lives in UI.f.cf. */
import React from 'react';
import { eng } from '../../engine';
import { Card, CommChip, Empty, Kpi, PgHead } from '../../ui';
import type { ScreenComp } from '../../app/types';
import { C } from './shared';

const SEG: [string, string][] = [['all', 'All'], ['eligible', 'Ready'], ['pending', 'Waiting'], ['blocked', 'Blocked'], ['released', 'Released']];

export const Commission: ScreenComp = () => {
  const f = eng.UI.f.cf || 'all';
  const rows = eng.S.bookings.filter((b: any) => ['approved', 'closed'].includes(b.status)).map((b: any) => ({ b, c: eng.comm(b) }));
  const by = (k: string) => rows.filter((r: any) => r.c.st === k);
  const tot = (k: string) => eng.money(eng.sum(by(k), (r: any) => r.c.inc));
  const list = rows.filter((r: any) => f === 'all' || r.c.st === f).sort((x: any, y: any) => y.b.submitted - x.b.submitted);
  return (
    <>
      <PgHead t="Commission" sub="Incentive = developer commission x the agent's slab rate. It releases only when the booking is closed, the developer has paid you, and the buyer has paid the release milestone." />
      <div className="grid g4c keep mb16">
        <Kpi l="Ready to release" n={tot('eligible')} d={by('eligible').length + ' bookings'} act="ui|cf|eligible" />
        <Kpi l="Waiting" n={tot('pending')} d={by('pending').length + ' bookings'} act="ui|cf|pending" />
        <Kpi l="Blocked" n={tot('blocked')} d={by('blocked').length + ' bookings'} act="ui|cf|blocked" cls={by('blocked').length ? 'warn' : ''} />
        <Kpi l="Released" n={tot('released')} d={by('released').length + ' bookings'} act="ui|cf|released" />
      </div>
      <div className="seg mb16">
        {SEG.map(([k, t]) => <button key={k} type="button" className={f === k ? 'on' : ''} data-act={`ui|cf|${k}`}>{t}</button>)}
      </div>
      <Card bare>
        {list.length ? (
          <div className="tw">
            <table className="tbl">
              <thead><tr><th>Booking</th><th>Agent</th><th className="num">Price</th><th className="num">Incentive</th><th>Developer</th><th className="num">Buyer paid</th><th>Status</th></tr></thead>
              <tbody>
                {list.map(({ b, c }: any) => {
                  const g = 'admin-comm-' + eng.bkP(b.id);
                  return (
                    <tr key={b.id} className="click" data-go={g}>
                      <C first l="Booking" text={b.id + c.p.name + ' ' + b.unit}>
                        <a className="b" href={'#' + g} data-go={g}>{b.id}</a><div className="xs faint">{c.p.name} {b.unit}</div>
                      </C>
                      <C l="Agent" className="sm">{eng.uname(b.agent)}</C>
                      <C l="Price" className="num">{eng.money(b.price)}</C>
                      <C l="Incentive" className="num">{eng.mfull(c.inc)}</C>
                      <C l="Developer" className="sm">{eng.devState(b).l}</C>
                      <C l="Buyer paid" className="num" text={b.paidPct + '%'}>{b.paidPct}%</C>
                      <C l="Status" text={eng.CMS[c.st][0]}><CommChip s={c.st} /></C>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : <Empty icn="percent" t="Nothing here" d="No bookings in this state." />}
      </Card>
    </>
  );
};
