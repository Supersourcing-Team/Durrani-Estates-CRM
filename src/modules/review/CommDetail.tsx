/* AD16 Commission detail (prototype route admin-comm). */
import React from 'react';
import { eng } from '../../engine';
import { Bn, Btn, Card, CommChip, Dl, Empty, Icon, type Node } from '../../ui';
import type { ScreenComp } from '../../app/types';
import { HistList } from '../deals/shared';

/** One release condition (prototype: step(ok, t, d, act)) */
function Step({ ok, t, d, act }: { ok: boolean; t: Node; d: Node; act?: Node }) {
  return (
    <div className={'stpi ' + (ok ? 'done' : '')}>
      <span className="dot2">{ok ? <Icon n="check" s={14} /> : null}</span>
      <div className="bd"><div className="b">{t}</div><div className="muted sm">{d}</div></div>
      {act || null}
    </div>
  );
}

export const CommDetail: ScreenComp = ({ params }) => {
  const b = eng.bkById(eng.bkF(params[0]));
  if (!b || !['approved', 'closed'].includes(b.status)) {
    return (
      <Card>
        <Empty icn="percent" t={b ? 'No commission yet' : 'Booking not found'} d={b ? 'Commission starts once a booking is approved.' : 'No booking with that ID.'}
          act={<Btn t="Back" go="admin-commission" cls="pri" />} />
      </Card>
    );
  }
  const c = eng.comm(b), pr = c.p, ag = eng.userById(b.agent), dv = eng.devState(b);
  const bkGo = 'admin-booking-' + eng.bkP(b.id), userGo = 'admin-user-' + ag.id;
  return (
    <>
      <div className="card mb16">
        <div className="row sb wrap top g16">
          <div>
            <div className="row g6 wrap"><h1 className="h1" style={{ fontSize: 28 }}>{b.id}</h1><CommChip s={c.st} /></div>
            <div className="muted mt8">{pr.name} · Unit {b.unit} · {ag.name}</div>
          </div>
          <a className="btn" href={'#' + bkGo} data-go={bkGo}>Open booking</a>
        </div>
      </div>
      {c.reason && c.st !== 'released' ? (
        <div className="mb16">
          <Bn kind={c.st === 'blocked' ? 'warn' : 'info'} title={c.st === 'eligible' ? 'Ready to release' : 'Why it is not ready'}
            body={c.st === 'eligible' ? 'All conditions are met.' : c.reason} />
        </div>
      ) : null}
      <div className="grid g21">
        <div className="col g16">
          <Card title="Conditions">
            <div className="stp">
              <Step ok={b.status === 'closed'} t="Booking closed by Admin" d="All five documents approved" />
              <Step ok={!!b.devInv} t="Developer invoiced" d={b.devInv ? eng.fd(b.devInv) : 'Raise the invoice to ' + pr.dev}
                act={b.status === 'closed' && !b.devInv ? <button className="btn s pri" type="button" data-act={`devinv|${b.id}`}>Mark invoiced</button> : null} />
              <Step ok={!!b.devRec} t="Developer commission received" d={b.devRec ? eng.fd(b.devRec) : dv.k === 'over' ? dv.l : 'Waiting for the developer'}
                act={b.devInv && !b.devRec ? <button className="btn s pri" type="button" data-act={`devrec|${b.id}`}>Mark received</button> : null} />
              <Step ok={b.paidPct >= pr.relPct} t={'Buyer has paid ' + pr.relPct + '%'} d={'Now ' + b.paidPct + '%'}
                act={b.status === 'closed' && b.paidPct < pr.relPct ? <button className="btn s" type="button" data-open={`pay-progress|${b.id}`}>Record payments</button> : null} />
              <Step ok={!!b.incRel} t="Incentive released" d={b.incRel ? eng.fd(b.incRel) : 'Release when everything above is done'}
                act={c.st === 'eligible' ? <button className="btn s pri" type="button" data-open={`comm-release|${b.id}`}>Release</button> : null} />
            </div>
          </Card>
          <Card title="History"><HistList arr={b.hist} /></Card>
        </div>
        <div className="col g16">
          <Card title="Calculation">
            <Dl items={[
              ['Agreed price', eng.mfull(b.price, b.cur)],
              ['Developer commission (' + pr.comm + '%)', eng.mfull(c.brokerage)],
              ['Agent slab', c.slab ? c.slab.name + ' · ' + c.rate + '%' : <span className="dangertx">None</span>],
              ['Adjustment', b.adj ? eng.mfull(b.adj) : 'None'],
              ['Incentive', <b>{eng.mfull(c.inc)}</b>],
            ]} />
            {b.adjNote ? <p className="muted sm mt8">Adjustment note: {b.adjNote}</p> : null}
            {b.incRel ? null : <button className="btn blk mt16" type="button" data-open={`comm-adjust|${b.id}`}>Adjust amount</button>}
          </Card>
          {!c.slab ? (
            <Card title="Fix the cause">
              <p className="muted sm mb8">{ag.name} has no slab.</p>
              <a className="btn blk" href={'#' + userGo} data-go={userGo}>Assign a slab</a>
            </Card>
          ) : null}
        </div>
      </div>
    </>
  );
};
