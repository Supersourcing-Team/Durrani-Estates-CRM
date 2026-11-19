/* M-L3-02 Place a lead on manager hold (pauses the inactivity clock). */
import React from 'react';
import { eng } from '../../engine';
import { Bn, BusyBtn, Fld, MTxa, Modal } from '../../ui';
import type { ModalComp } from '../../app/types';
import { errs } from './parts';

export const HoldModal: ModalComp = ({ args: a }) => {
  const l = eng.leadById(a[0]), e = errs();
  const busy = !!eng.UI.mf._busy;
  return (
    <Modal title="Place on hold" sub={l.name}
      foot={<><button className="btn" type="button" data-act="mclose" disabled={busy || undefined}>Cancel</button><BusyBtn busy={busy} act={`holdsave|${l.id}`} label="Place on hold" busyLabel="Saving…" /></>}>
      <Bn kind="info" title="What a hold does" body="Pauses the inactivity clock so the lead is not auto-returned. The agent keeps the lead. Use it for travel, bereavement or a deal you agreed to wait on." />
      <Fld label="Reason" htmlFor="m_why" err={e.why}><MTxa k="why" bad={!!e.why} ph="For example: buyer travelling until 5 Nov" /></Fld>
    </Modal>
  );
};
