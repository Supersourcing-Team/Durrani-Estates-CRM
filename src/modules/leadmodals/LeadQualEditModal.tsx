/* Admin: edit a lead's Qualification, saved with PUT /v1/leads/{id}/qualification/. */
import React from 'react';
import { eng } from '../../engine';
import { Bn, BusyBtn, Fld, MInput, MSel, MTxa, Modal } from '../../ui';
import type { ModalComp } from '../../app/types';
import { errs } from './parts';

export const LeadQualEditModal: ModalComp = ({ args: a }) => {
  const l = eng.leadById(a[0]), e = errs();
  const busy = !!eng.UI.mf._busy;
  return (
    <Modal title="Edit qualification" sub={l.name + ' · LEAD-' + l.id} drawer
      foot={<><button className="btn" type="button" data-act="mclose" disabled={busy || undefined}>Cancel</button><BusyBtn busy={busy} act={`leadqualsave|${l.id}`} label="Save changes" busyLabel="Saving…" /></>}>
      <Bn kind="info" title="Every edit is logged" body="Changes appear in this lead's timeline and in the audit log." />
      <div className="frm">
        <div className="full"><Fld label="Track" htmlFor="m_trk" err={e.trk} hint="Decides where this lead goes next."><MSel k="trk" opts={[['property', 'Property Sale'], ['cn', 'Convertible Notes'], ['secondary', 'Secondary Market']]} blank="Choose a track" bad={!!e.trk} /></Fld></div>
        <Fld label="Budget from" htmlFor="m_bmin" err={e.bmin}><MInput k="bmin" type="number" min={0} bad={!!e.bmin} /></Fld>
        <Fld label="Budget to" htmlFor="m_bmax" err={e.bmax}><MInput k="bmax" type="number" min={0} bad={!!e.bmax} /></Fld>
        <Fld label="Currency" htmlFor="m_cur"><MSel k="cur" opts={['AED', 'INR']} blank={false} /></Fld>
        <Fld label="Property type" htmlFor="m_ptype"><MSel k="ptype" opts={['Off-plan apartment', 'Ready apartment', 'Villa', 'Townhouse', 'Commercial']} blank="Select" /></Fld>
        <Fld label="Buying timeline" htmlFor="m_tline"><MSel k="tline" opts={['0 to 3 months', '3 to 6 months', '6 to 12 months', 'Just exploring']} blank="Select" /></Fld>
        <Fld label="Payment method" htmlFor="m_pay"><MSel k="pay" opts={['Cash', 'Mortgage', 'Payment plan']} blank="Select" /></Fld>
        <Fld label="Purpose" htmlFor="m_purp"><MSel k="purp" opts={['Investment', 'Own use', 'Both']} blank="Select" /></Fld>
        <Fld label="Visa interest" htmlFor="m_visa"><MSel k="visa" opts={['Interested', 'Not needed', 'Already has']} blank="Select" /></Fld>
      </div>
      <Fld label="Notes" htmlFor="m_qnotes"><MTxa k="qnotes" ph="Anything worth knowing about this qualification" /></Fld>
    </Modal>
  );
};