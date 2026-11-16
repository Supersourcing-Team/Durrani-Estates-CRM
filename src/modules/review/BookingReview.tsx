/* AD14 Booking review, Admin split view (prototype route admin-booking). */
import React from 'react';
import { eng, HR } from '../../engine';
import { Bar, BkChip, Bn, BusyBtn, Card, Chip, CommChip, Dl, DocChip, Icon, Kvs, type Node } from '../../ui';
import type { ScreenComp } from '../../app/types';
import { HistList } from '../deals/shared';
import { C, DOC_KEYS, DealTracker, LostBk } from './shared';

const LATE = ['spa', 'dld', 'oqood'];

/** One document row with View / Approve / Reject */
function DocSlot({ b, k }: { b: any; k: string }) {
  const d = b.docs[k];
  const busy = !!eng.UI.pf._busy;
  const locked = LATE.includes(k) && !['approved', 'closed'].includes(b.status);
  const can = d.s === 'uploaded' && ['pending', 'changes', 'approved'].includes(b.status) && !locked;
  const info = d.name ? d.name + ' · ' + eng.fd(d.at)
    : locked ? 'Opens after the booking is approved'
    : k === 'spa' && !b.spaIssued ? 'Waiting for the agent to mark the SPA as issued' : 'Not uploaded';
  return (
    <div className={'slot ' + (d.s === 'approved' ? 'okd' : d.s === 'rejected' ? 'rej' : d.s === 'uploaded' ? 'up' : '')}>
      <span className="ic"><Icon n="file" s={16} /></span>
      <div className="m">
        <div className="b">{eng.DOCN[k]}</div>
        <div className="xs faint">{info}</div>
        {d.note && d.s === 'rejected' ? <div className="xs dangertx">{d.note}</div> : null}
      </div>
      <DocChip s={d.s} />
      <div className="row g6">
        {d.name ? <button className="btn s" type="button" data-open={`doc-view|${b.id}|${k}`}>View</button> : null}
        {can ? <>
          <BusyBtn busy={busy} cls="btn s pri" act={`docdec|${b.id}|${k}|approved`} label="Approve" busyLabel="…" />
          <button className="btn s" type="button" data-open={`doc-reject|${b.id}|${k}`} disabled={busy || undefined}>Reject</button>
        </> : null}
      </div>
    </div>
  );
}

/** Right-hand decision card; content depends on the booking status */
function Decide({ b }: { b: any }) {
  const busy = !!eng.UI.pf._busy;
  const fOk = ['uploaded', 'approved'].includes(b.docs.form.s), rOk = ['uploaded', 'approved'].includes(b.docs.receipt.s);
  const payBtn = <button className="btn blk mt8" type="button" data-open={`pay-progress|${b.id}`} disabled={busy || undefined}>Record buyer payments</button>;
  if (b.status === 'pending') {
    return (
      <Card title="Your decision">
        {!(fOk && rOk) ? <Bn kind="warn" body="The booking form and deposit receipt both need to be uploaded before you can approve." /> : null}
        <div className="col g6 mt8">
          <BusyBtn busy={busy} cls="btn pri blk" act={`bkapprove|${b.id}`} disabled={!(fOk && rOk)} label={<><Icon n="check" s={16} />Approve booking</>} busyLabel="Approving…" />
          <button className="btn blk" type="button" data-open={`bk-changes|${b.id}`} disabled={busy || undefined}>Ask for changes</button>
          <button className="btn dng blk" type="button" data-open={`bk-reject|${b.id}`} disabled={busy || undefined}>Reject booking</button>
        </div>
        <p className="muted sm mt16">Approving books the unit and starts the deal as PENDING. Rejecting releases the unit.</p>
      </Card>
    );
  }
  if (b.status === 'changes') {
    return (
      <Card title="Your decision">
        <Bn kind="info" title="Waiting for the agent" body={'They were asked: ' + b.reason} />
        <div className="col g6 mt8"><button className="btn dng blk" type="button" data-open={`bk-reject|${b.id}`} disabled={busy || undefined}>Reject booking</button></div>
      </Card>
    );
  }
  if (b.status === 'approved') {
    const ok = eng.gateOk(b);
    const miss = DOC_KEYS.filter((k) => b.docs[k].s !== 'approved');
    return (
      <Card title="Closure">
        <div className="col g6 sm mb8">
          {DOC_KEYS.map((k) => {
            const s = b.docs[k].s;
            return (
              <div key={k} className={'ck ' + (s === 'approved' ? 'ok' : 'no')}>
                <Icon n={s === 'approved' ? 'check' : 'x'} s={14} />
                {eng.DOCN[k]}{s === 'uploaded' ? ' (waiting for you)' : s === 'missing' ? ' (not uploaded)' : s === 'rejected' ? ' (rejected)' : ''}
              </div>
            );
          })}
        </div>
        <BusyBtn busy={busy} cls="btn pri blk" act={`bkclose|${b.id}`} disabled={!ok} label={<><Icon n="check" s={16} />Approve closure</>} busyLabel="Closing…" />
        {ok ? null : <p className="muted sm mt8">{miss.length} document{miss.length > 1 ? 's' : ''} still not approved. Closure stays locked until all five are.</p>}
        {payBtn}
      </Card>
    );
  }
  if (b.status === 'closed') {
    const cm = eng.comm(b);
    const g = 'admin-comm-' + eng.bkP(b.id);
    return (
      <Card title="Closed">
        <p className="sm muted mb8">Revenue and commission are counted.</p>
        <Dl items={[['Buyer has paid', b.paidPct + '%'], ['Incentive', <><CommChip s={cm.st} />{' ' + eng.mfull(cm.inc)}</>]]} />
        <a className="btn blk mt16" href={'#' + g} data-go={g}>Open commission</a>
        {payBtn}
      </Card>
    );
  }
  return <Card title="Closed without a deal"><p className="muted sm">This booking was {b.status}. The unit went back on sale.</p></Card>;
}

export const BookingReview: ScreenComp = ({ params }) => {
  const b = eng.bkById(eng.bkF(params[0]));
  if (!b) return <LostBk back="admin-review" />;
  const l = eng.leadById(b.lead), pr = eng.projById(b.project);
  const hold = ['pending', 'changes'].includes(b.status) && b.holdUntil;
  const leadGo = 'admin-lead-' + l.id, userGo = 'admin-user-' + b.agent;
  const unit = pr.units.find((x: any) => x.id === b.unit) || {};
  let pay: Node = null;
  if (b.miles.length && ['approved', 'closed'].includes(b.status)) {
    pay = (
      <Card title="Buyer payment progress">
        <div className="row sb sm mb8"><span>Paid so far</span><b>{b.paidPct}%</b></div>
        <Bar p={b.paidPct} />
        <div className="tw mt16">
          <table className="tbl">
            <thead><tr><th>Milestone</th><th className="num">%</th><th className="num">Amount</th><th>Status</th></tr></thead>
            <tbody>
              {b.miles.map((m: any, i: number) => (
                <tr key={i}>
                  <C first l="Milestone">{m.n}</C>
                  <C l="%" className="num" text={m.pct + '%'}>{m.pct}%</C>
                  <C l="Amount" className="num">{eng.nf(m.amt)}</C>
                  <C l="Status" text={m.paid ? 'Paid' : 'Upcoming'}><Chip t={m.paid ? 'Paid' : 'Upcoming'} cls={m.paid ? 's6' : 's2'} /></C>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    );
  }
  return (
    <>
      <div className="card mb16">
        <div className="row top sb wrap g16">
          <div>
            <div className="row g6 wrap"><h1 className="h1" style={{ fontSize: 28 }}>{b.id}</h1><BkChip s={b.status} /></div>
            <div className="muted mt8">{pr.name} · Unit {b.unit} ({b.type}) · {eng.mfull(b.price, b.cur)}</div>
            <div className="muted sm mt8">Client: <a href={'#' + leadGo} data-go={leadGo}>{l.name}</a> · Agent: <a href={'#' + userGo} data-go={userGo}>{eng.uname(b.agent)}</a> · Raised {eng.ft(b.submitted)}</div>
          </div>
          <a className="btn" href={'#' + leadGo} data-go={leadGo}>Open lead</a>
        </div>
      </div>
      {hold ? (
        <div className="mb16">
          <Bn kind={b.holdUntil - eng.NOW() < 8 * HR ? 'warn' : 'info'} title={'Unit ' + b.unit + ' is held until ' + eng.ft(b.holdUntil)}
            body="If nobody decides by then, the hold expires and the unit goes back on sale." />
        </div>
      ) : null}
      <div className="grid g21">
        <div className="col g16">
          <Card title="Documents"><div className="col">{DOC_KEYS.map((k) => <DocSlot key={k} b={b} k={k} />)}</div></Card>
          <Card title="Booking terms">
            <Kvs items={[
              ['Agreed price', eng.mfull(b.price, b.cur)],
              ['Deposit', eng.mfull(b.depAmt) + ' · ' + b.depMode],
              ['Payment plan', b.plan],
              ['Offer or special terms', b.offer || 'None'],
              ['List price of unit', eng.mfull(unit.price || b.price)],
            ]} />
          </Card>
          {pay}
        </div>
        <div className="col g16">
          <Decide b={b} />
          <Card title="Deal tracker"><DealTracker b={b} /></Card>
          <Card title="History"><HistList arr={b.hist} /></Card>
        </div>
      </div>
    </>
  );
};
