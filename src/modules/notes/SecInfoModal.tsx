/* S-L3-16 Primary and secondary market explainer (prototype modal sec-info). */
import React from 'react';
import { eng } from '../../engine';
import { Modal } from '../../ui';
import type { ModalComp } from '../../app/types';

const SELLER: [string, string][] = [
  ['Agent raises a listing request', 'With title deed or Oqood, unit documents and photos. It shows under Requests I raised as Requested.'],
  ['Admin reviews', 'Checks documents, sets the commission and assigns a Secondary agent. Or declines with a reason.'],
  ['Listing goes live', 'Status Active. Every agent now sees it under Live listings and can match a buyer.'],
  ['Deal', 'Matched, Negotiation, then Closed. Admin approves the closing documents and releases the commission.'],
];
const BUYER: [string, string][] = [
  ['Agent raises a buyer request', 'From a lead that wants a ready unit or a resale. The lead stays linked.'],
  ['Admin accepts', 'Assigns a Secondary agent to find a match.'],
  ['Matched', 'The Secondary agent links it to a live listing.'],
  ['Deal', 'Negotiation, then Closed. The raising agent stays credited on the lead history.'],
];
const WHO: [string, string, string, string, string, string][] = [
  ['Agent', ' (tag None)', 'Yes', 'Yes', 'No', 'No'],
  ['Agent', ' (tag Secondary)', 'Yes', 'Yes', 'Yes, when Admin assigns it', 'No'],
  ['Manager', '', 'No', "Team's requests", 'No', 'No'],
  ['Admin', '', 'Creates listings', 'All', 'Assigns the owner', 'Yes, sets commission'],
];

function Steps({ items }: { items: [string, string][] }) {
  return (
    <div className="stp">
      {items.map(([t, d], i) => (
        <div className="stpi" key={i}><span className="dot2">{i + 1}</span><div className="bd"><div className="b">{t}</div><div className="muted sm">{d}</div></div></div>
      ))}
    </div>
  );
}

export const SecInfoModal: ModalComp = () => {
  const withComm = eng.S.sec.find((s: any) => s.comm);
  const foot = <button className="btn pri" type="button" data-act="mclose">Got it</button>;
  return (
    <Modal title="Primary and secondary market" size="w" foot={foot}>
      <div className="grid g2 mb16">
        <div className="card soft"><div className="b">Primary (off-plan)</div><div className="sm mt8">A developer sells new units. Inventory is in the Project Catalogue. The developer pays the commission. Flow: lead, shortlist, booking, Admin approval, closure.</div></div>
        <div className="card soft"><div className="b">Secondary (resale)</div><div className="sm mt8">An owner sells a unit they already own, ready or off-plan. The buyer pays the brokerage, usually {withComm ? withComm.comm : 2}%. Inventory is the Live listings list here.</div></div>
      </div>
      <div className="ov mb8">Who does what</div>
      <div className="tw mb16"><table className="tbl">
        <thead><tr><th></th><th>Raise a request</th><th>See live listings</th><th>Work a deal</th><th>Approve and publish</th></tr></thead>
        <tbody>
          {WHO.map((r, i) => <tr key={i}><td><b>{r[0]}</b>{r[1]}</td><td>{r[2]}</td><td>{r[3]}</td><td>{r[4]}</td><td>{r[5]}</td></tr>)}
        </tbody>
      </table></div>
      <div className="grid g2">
        <div><div className="ov mb8">Seller listing</div><Steps items={SELLER} /></div>
        <div><div className="ov mb8">Buyer request</div><Steps items={BUYER} /></div>
      </div>
    </Modal>
  );
};
