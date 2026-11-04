/* Shared parts of the Admin review and commission screens. */
import React from 'react';
import { eng } from '../../engine';
import { Btn, Card, Empty, Icon, Td, isShort, type Node } from '../../ui';

export const DOC_KEYS = ['form', 'receipt', 'spa', 'dld', 'oqood'];

/** Table cell that keeps the prototype's labelTables output (data-l, nw for short text). */
export function C({ l, first, text, className, children }: { l: string; first?: boolean; text?: string; className?: string; children?: Node }) {
  const t = text != null ? text : typeof children === 'string' || typeof children === 'number' ? String(children) : '';
  return <Td l={l} first={first} nw={isShort(t)} className={className}>{children}</Td>;
}

/** prototype: lostBk(back) */
export function LostBk({ back }: { back: string }) {
  return <Card><Empty icn="file" t="Booking not found" d="No booking with that ID." act={<Btn t="Back to review" go={back} cls="pri" />} /></Card>;
}

/**
 * prototype: dealTracker(b). Same as the private DealTracker in features/deals/BookingDetail.tsx
 * (not exported there, so repeated here).
 */
export function DealTracker({ b }: { b: any }) {
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
