/* A Performance (prototype route agent-performance) */
import React from 'react';
import { eng, money, pct } from '../../engine';
import { Bar, Bn, Card, PgHead } from '../../ui';
import type { ScreenComp } from '../../app/types';

const STAGES = ['New', 'Contacted', 'Qualified', 'Shortlisted', 'Booking submitted', 'Pending', 'Closed'];

/** One target line: label, "value of target" and a progress bar (green once reached). */
function TargetRow({ l, v, t, fmt }: { l: string; v: number; t: number; fmt?: (n: number) => string }) {
  return (
    <div>
      <div className="row sb sm"><span>{l}</span><b>{fmt ? fmt(v) : v} of {fmt ? fmt(t) : t}</b></div>
      <Bar p={pct(v, t)} cls={v >= t ? 'ok' : ''} />
    </div>
  );
}

/** Horizontal count bars (lead funnel, call outcomes). */
function Funnel({ rows }: { rows: [string, number][] }) {
  const mx = Math.max(...rows.map((r) => r[1]), 1);
  return <div className="kfunnel">{rows.map(([s, n]) => <div className="fr" key={s}><span>{s}</span><Bar p={pct(n, mx)} /><b className="tr">{n}</b></div>)}</div>;
}

export const AgentPerformance: ScreenComp = () => {
  const S = eng.S;
  const u = eng.me();
  const rev = eng.revOf(u.id), bc = eng.bookingsCount(u.id), pf = eng.perfOf(u.id), T = S.set.targets.agent;
  const all: any[] = S.leads.filter((l: any) => l.owner === u.id || (l.own.length && l.own[l.own.length - 1].to === u.id));
  const sl = eng.slabOf(u), ns = eng.nextSlab(u);
  const callsAll = all.flatMap((l) => l.calls);
  const outs: [string, number][] = eng.CALLRES.map((r: string) => [r, callsAll.filter((c: any) => c.res === r).length]);
  const funnel: [string, number][] = STAGES.map((s) => [s, all.filter((l) => l.stage === s).length]);

  return (
    <>
      <PgHead t="Performance" sub="October 2026 to date. Revenue and bookings count only approved or closed bookings." />
      <div className="grid g2 mb16">
        <Card title="Targets">
          <div className="col g16">
            <TargetRow l="Revenue" v={rev} t={T.rev} fmt={money} />
            <TargetRow l="Bookings" v={bc} t={T.book} />
            <TargetRow l="Calls" v={pf.calls} t={T.calls} />
            <TargetRow l="Meetings" v={pf.meet} t={T.meet} />
            <TargetRow l="Follow-ups" v={pf.fu} t={T.fu} />
          </div>
        </Card>
        <Card title="Commission slab">
          {sl ? (
            <>
              <div className="kns">{sl.name} · {sl.rate}%</div>
              <p className="muted mt8">Admin assigns your slab. Your incentive on each closed booking is the developer commission times {sl.rate}%.</p>
              {ns ? (
                <div className="mt16">
                  <div className="row sb sm"><span>Approved bookings toward {ns.slab.name}</span><b>{money(rev)} of {money(ns.slab.from)}</b></div>
                  <Bar p={pct(rev, ns.slab.from)} />
                  <p className="muted sm mt8">{money(ns.gap)} to go. This is a guide only. Moving slab is Admin's decision.</p>
                </div>
              ) : null}
            </>
          ) : <Bn kind="warn" title="No slab assigned" body="You cannot earn incentive until Admin assigns one." />}
        </Card>
      </div>
      <div className="grid g2">
        <Card title="Lead funnel"><Funnel rows={funnel} /></Card>
        <Card title="Call outcomes">
          <Funnel rows={outs} />
          <p className="muted sm mt16">From calls logged on your leads in this prototype.</p>
        </Card>
      </div>
    </>
  );
};
