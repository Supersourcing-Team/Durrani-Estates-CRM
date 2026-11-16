/*
 * A-L3-10 Add a lead (manual), with the duplicate-check result screen.
 * Opened by an agent (My Leads) and by Admin (Leads, Lead Sources). The form is the same for both;
 * the "Open LEAD-x" link goes to the lead screen of the signed-in role (the prototype always linked
 * #agent-lead-x, which shows "access denied" to Admin).
 */
import React from 'react';
import { eng } from '../../engine';
import { Bn, BusyBtn, Fld, MInput, MSel, MTxa, Modal } from '../../ui';
import type { ModalComp } from '../../app/types';
import { errs } from './parts';

export const AddLeadModal: ModalComp = () => {
  const f = eng.UI.mf, e = errs();
  const res = f._res;
  const busy = !!f._busy;
  const lk = `${eng.me().role}-lead-${res && res.lead}`;
  const close = <button className="btn" type="button" data-act="mclose">Close</button>;
  if (res) {
    return (
      <Modal title={res.title} foot={close}>
        <Bn kind={res.kind} body={res.text} />
        {res.lead ? <a className="btn pri blk" href={'#' + lk} data-go={lk}>Open LEAD-{res.lead}</a> : null}
      </Modal>
    );
  }
  return (
    <Modal title="Add a lead" sub="For clients who came to you directly. Campaign leads arrive through Admin."
      foot={<><button className="btn" type="button" data-act="mclose" disabled={busy || undefined}>Cancel</button><BusyBtn busy={busy} act="addlead" label="Check and add" busyLabel="Adding…" /></>}>
      <div className="frm">
        <Fld label="Full name" htmlFor="m_name" err={e.name}><MInput k="name" bad={!!e.name} /></Fld>
        <Fld label="Source" htmlFor="m_src" err={e.src}><MSel k="src" opts={['Walk-in', 'Referral', 'Exhibition', 'Own network']} bad={!!e.src} blank="Choose source" /></Fld>
        <Fld label="Country code" htmlFor="m_cc"><MSel k="cc" opts={['+971', '+91', '+65', '+966', '+44']} blank={false} /></Fld>
        <Fld label="Phone number" htmlFor="m_ph" err={e.ph}><MInput k="ph" type="tel" bad={!!e.ph} ph="50 123 4567" /></Fld>
        <div className="full"><Fld label="Email (optional)" htmlFor="m_email" err={e.email}><MInput k="email" type="email" bad={!!e.email} /></Fld></div>
        <div className="full"><Fld label="Notes"><MTxa k="txt" ph="Anything useful from the first conversation" /></Fld></div>
      </div>
      <Bn kind="info" title="Duplicate rules" body="Same number and same source is discarded. Same number from another campaign becomes a linked lead that stays with the original agent while it is active." />
    </Modal>
  );
};
