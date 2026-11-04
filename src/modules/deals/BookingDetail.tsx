/*
 * Booking detail (prototype routes agent-booking and mgmt-booking, bookingPage(role, p)).
 * The manager sees the same page read only: no upload / resubmit / SPA buttons and no commission card.
 */
import React from 'react';
import { eng, HR } from '../../engine';
import { Bar, BkChip, Bn, Btn, Card, Chip, CommChip, Dl, DocChip, Empty, Icon, Kvs, type Node } from '../../ui';
import type { ScreenComp } from '../../app/types';
import { HistList, nw } from './shared';

const DOC_KEYS = ['form', 'receipt', 'spa', 'dld', 'oqood'];
const LATE = ['spa', 'dld', 'oqood'];

/** prototype: dealTracker(b) */
function DealTracker({ b }: { b: any }) {
  const d = b.docs;
  const st: [string, string, boolean][] = [
    ['Booking submitted', 'Raised by agent', true],
    ['Admin approval', 'Unit booked, deal is PENDING', ['approved', 'closed'].includes(b.status)],
    ['SPA issued by developer', 'Agent marks the date', !!b.spaIssued],
    ['Signed SPA approved', 'Uploaded by agent, approved by Admin', d.spa.s === 'approved'],
    ['DLD and Oqood fee receipt approved', 'Buyer paid 4% DLD plus Oqood fee', d.dld.s === 'approved'],
    ['Oqood certificate approved', 'From the developer', d.oqood.s === 'approved'],
    ['Closure approved by Admin', 'Revenue and commission start', b.status === 'closed'],
  ];
  const dead = b.status === 'rejected' || b.status === 'expired';
  const cur = dead ? -1 : st.findIndex((x) => !x[2]);
  return (
    <div className="stp">
      {st.map((x, i) => (
        <div key={i} className={`stpi ${x[2] ? 'done' : i === cur ? 'cur' : ''} ${dead && i === 1 ? 'blk' : ''}`}>
          <span className="dot2">{x[2] ? <Icon n="check" s={14} /> : i + 1}</span>
          <div className="bd"><div className="b">{x[0]}</div><div className="muted sm">{x[1]}</div></div>
        </div>
      ))}
    </div>
  );
}

/** One document row (prototype: slots in bookingPage) */
function DocSlot({ b, k, mine }: { b: any; k: string; mine: boolean }) {
  const d = b.docs[k];
  const can = mine && ['approved'].includes(b.status) && LATE.includes(k) && (k !== 'spa' || b.spaIssued) && ['missing', 'rejected'].includes(d.s);
  const lock = LATE.includes(k) && b.status !== 'approved' && b.status !== 'closed';
  const why = k === 'spa' && !b.spaIssued && b.status === 'approved' ? 'Mark the SPA as issued first' : lock ? 'Available after Admin approves' : '';
  return (
    <div className={'slot ' + (d.s === 'approved' ? 'okd' : d.s === 'rejected' ? 'rej' : d.s === 'uploaded' ? 'up' : '')}>
      <span className="ic"><Icon n="file" s={16} /></span>
      <div className="m"><div className="b">{eng.DOCN[k]}</div><div className="xs faint">{d.name ? d.name + ' · ' + eng.fd(d.at) : why || 'Not uploaded'}</div></div>
      <DocChip s={d.s} />
      {can ? <button className="btn s pri" type="button" data-open={`bk-doc|${b.id}|${k}`}>{d.s === 'rejected' ? 'Re-upload' : 'Upload'}</button> : null}
      {mine && b.status === 'changes' && ['form', 'receipt'].includes(k) && d.s === 'rejected'
        ? <button className="btn s pri" type="button" data-open={`bk-doc|${b.id}|${k}`}>Re-upload</button> : null}
    </div>
  );
}

const Ck = ({ ok, children }: { ok: boolean; children: Node }) => (
  <div className={'ck ' + (ok ? 'ok' : 'no')}><Icon n={ok ? 'check' : 'x'} s={14} />{children}</div>
);

/** "Your commission" card (prototype: cmCard in bookingPage) */
function CommissionCard({ b, pr }: { b: any; pr: any }) {
  const cm = eng.comm(b);
  if (b.status === 'rejected' || b.status === 'expired') return <Card title="Your commission"><p className="muted">No commission on a {b.status} booking.</p></Card>;
  return (
    <Card title="Your commission">
      <Dl items={[
        ['Price', eng.mfull(b.price)],
        ['Developer commission (' + pr.comm + '%)', eng.mfull(cm.brokerage)],
        ['Your slab', cm.slab ? cm.slab.name + ' · ' + cm.rate + '%' : 'None assigned'],
        ['Your incentive', <b>{eng.mfull(cm.inc)}</b>],
        ['Status', <CommChip s={cm.st} />],
      ]} />
      {cm.reason ? <div className={'bn ' + (cm.st === 'blocked' ? 'warn' : 'info') + ' mt16'}><span><Icon n="info" s={16} /></span><div>{cm.reason}</div></div> : null}
      {cm.st === 'pending' || cm.st === 'blocked' ? (
        <div className="col g6 mt16 sm">
          <Ck ok={b.status === 'closed'}>Booking closed by Admin</Ck>
          <Ck ok={!!b.devRec}>Developer commission received</Ck>
          <Ck ok={b.paidPct >= pr.relPct}>Buyer has paid {pr.relPct}% (now {b.paidPct}%)</Ck>
        </div>
      ) : null}
    </Card>
  );
}

function BookingPage({ role, params }: { role: 'agent' | 'mgmt'; params: string[] }) {
  const b = eng.bkById(eng.bkF(params[0]));
  const back = role + '-bookings';
  if (!b) return <Card><Empty icn="file" t="Booking not found" d="No booking with that ID." act={<Btn t="Back to bookings" go={back} cls="pri" />} /></Card>;
  if (role === 'mgmt' && eng.teamOf(b.agent) !== eng.me().team) return <Card><Empty icn="lock" t="Outside your team" d="This booking belongs to another team." act={<Btn t="Back to bookings" go={back} cls="pri" />} /></Card>;
  const mine = role === 'agent';
  if (mine && b.agent !== eng.me().id) return <Card><Empty icn="lock" t="This is not your booking" d="Only the agent who raised it can open it." act={<Btn t="Back to bookings" go={back} cls="pri" />} /></Card>;
  const l = eng.leadById(b.lead), pr = eng.projById(b.project);
  const NOW = eng.NOW();
  const hold = ['pending', 'changes'].includes(b.status) && b.holdUntil;
  const raise = `agent-bookingnew-${b.lead}-${b.project}`;

  const bnrs: Node[] = [];
  if (hold) bnrs.push(<Bn kind={b.holdUntil - NOW < 8 * HR ? 'warn' : 'info'} title={'Unit ' + b.unit + ' is held until ' + eng.ft(b.holdUntil)}
    body={(b.holdUntil > NOW ? 'About ' + eng.rel(b.holdUntil).replace('in ', '') + ' left. ' : '') + 'If Admin has not decided by then, the hold expires and the unit goes back on sale.'} />);
  if (b.status === 'changes') bnrs.push(<Bn kind="warn" title="Admin asked for changes" body={b.reason}
    acts={mine ? <button className="btn pri s" type="button" data-open={`bk-resubmit|${b.id}`}>Fix and resubmit</button> : null} />);
  if (b.status === 'rejected') bnrs.push(<Bn kind="err" title="Rejected" body={b.reason}
    acts={mine ? <a className="btn pri s" href={'#' + raise} data-go={raise}>Raise a new booking</a> : null} />);
  if (b.status === 'expired') bnrs.push(<Bn kind="err" title="Hold expired" body={b.reason}
    acts={mine ? <a className="btn pri s" href={'#' + raise} data-go={raise}>Raise it again</a> : null} />);

  const leadGo = `${role}-lead-${l.id}`;
  return (
    <>
      <div className="card mb16">
        <div className="row top sb wrap g16">
          <div>
            <div className="row g6 wrap"><h1 className="h1" style={{ fontSize: 28 }}>{b.id}</h1><BkChip s={b.status} /></div>
            <div className="muted mt8">{pr.name} · Unit {b.unit} ({b.type}) · {eng.mfull(b.price, b.cur)}</div>
            <div className="muted sm mt8">Client: <a href={'#' + leadGo} data-go={leadGo}>{l.name}</a> · Agent: {eng.uname(b.agent)} · Raised {eng.ft(b.submitted)}</div>
          </div>
          <div className="row g6 wrap">
            {b.status === 'approved' && mine && !b.spaIssued ? <button className="btn pri" type="button" data-open={`bk-spa|${b.id}`}>Mark SPA issued</button> : null}
            <a className="btn" href={'#' + leadGo} data-go={leadGo}>Open lead</a>
          </div>
        </div>
      </div>
      {bnrs.map((x, i) => <div className="mb16" key={i}>{x}</div>)}
      <div className="grid g21">
        <div className="col g16">
          <Card title="Documents">
            <div className="col">{DOC_KEYS.map((k) => <DocSlot key={k} b={b} k={k} mine={mine} />)}</div>
            <p className="muted sm mt8">Admin reviews each document. The booking closes only when all five are approved.</p>
          </Card>
          <Card title="Booking terms">
            <Kvs items={[['Agreed price', eng.mfull(b.price, b.cur)], ['Deposit', eng.mfull(b.depAmt) + ' · ' + b.depMode], ['Payment plan', b.plan], ['Offer or special terms', b.offer || 'None']]} />
          </Card>
          {b.miles.length && ['approved', 'closed'].includes(b.status) ? (
            <Card title="Buyer payment progress">
              <div className="row sb sm mb8"><span>Paid so far</span><b>{b.paidPct}%</b></div>
              <Bar p={b.paidPct} />
              <div className="tw mt16">
                <table className="tbl">
                  <thead><tr><th>Milestone</th><th className="num">%</th><th className="num">Amount</th><th>Status</th></tr></thead>
                  <tbody>
                    {b.miles.map((m: any, i: number) => (
                      <tr key={i}><td className={nw(m.n)}>{m.n}</td><td className="num nw">{m.pct}%</td><td className="num nw">{eng.nf(m.amt)}</td><td className="nw"><Chip t={m.paid ? 'Paid' : 'Upcoming'} cls={m.paid ? 's6' : 's2'} /></td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="muted sm mt8">Updated by Admin from the developer statement.</p>
            </Card>
          ) : null}
        </div>
        <div className="col g16">
          <Card title="Deal tracker"><DealTracker b={b} /></Card>
          {mine ? <CommissionCard b={b} pr={pr} /> : null}
          <Card title="History"><HistList arr={b.hist} /></Card>
        </div>
      </div>
    </>
  );
}

/** Screen for one role (registered as agent-booking and mgmt-booking). */
const bookingDetail = (role: 'agent' | 'mgmt'): ScreenComp => {
  const C: ScreenComp = ({ params }) => <BookingPage role={role} params={params} />;
  C.displayName = `BookingDetail(${role})`;
  return C;
};
export const BookingDetail = bookingDetail('agent');
export const MgmtBookingDetail = bookingDetail('mgmt');
