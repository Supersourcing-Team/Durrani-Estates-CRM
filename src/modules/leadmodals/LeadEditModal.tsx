/* Admin: edit a lead's Profile (customer details), saved with PUT /v1/leads/{id}/profile/. */
import React from 'react';
import { eng } from '../../engine';
import { Bn, BusyBtn, Fld, MInput, Modal } from '../../ui';
import type { ModalComp } from '../../app/types';
import { errs } from './parts';

export const LeadEditModal: ModalComp = ({ args: a }) => {
  const l = eng.leadById(a[0]), e = errs();
  const busy = !!eng.UI.mf._busy;
  return (
    <Modal title="Edit profile" sub={l.name + ' · LEAD-' + l.id} drawer
      foot={<><button className="btn" type="button" data-act="mclose" disabled={busy || undefined}>Cancel</button><BusyBtn busy={busy} act={`leadeditsave|${l.id}`} label="Save changes" busyLabel="Saving…" /></>}>
      <Bn kind="info" title="Every edit is logged" body="Changes appear in this lead's timeline and in the audit log. Use Reassign to change the owner." />
      <div className="frm">
        <Fld label="First name" htmlFor="m_first" err={e.first} req><MInput k="first" bad={!!e.first} /></Fld>
        <Fld label="Last name" htmlFor="m_last"><MInput k="last" /></Fld>
        <Fld label="Phone number" htmlFor="m_phone" err={e.phone} req><MInput k="phone" type="tel" bad={!!e.phone} ph="+971 50 123 4567" /></Fld>
        <Fld label="Email" htmlFor="m_email" err={e.email}><MInput k="email" type="email" bad={!!e.email} /></Fld>
        <Fld label="City" htmlFor="m_city"><MInput k="city" /></Fld>
        <Fld label="Country" htmlFor="m_country"><MInput k="country" /></Fld>
        <div className="full"><Fld label="Nationality" htmlFor="m_nat"><MInput k="nat" /></Fld></div>
      </div>
    </Modal>
  );
};
