/* AD-L3-06 Reject a booking (prototype modal bk-reject, action rejsave). */
import React from 'react';
import { eng } from '../../engine';
import { Bn, BusyBtn, Fld, MTxa, Modal } from '../../ui';
import type { ModalComp } from '../../app/types';

export const BkRejectModal: ModalComp = ({ args }) => {
  const b = eng.bkById(args[0]), e = eng.UI.mf._e || {};
  const busy = !!eng.UI.mf._busy;
  return (
    <Modal title="Reject booking" sub={b.id + ' · unit ' + b.unit}
      foot={<><button className="btn" type="button" data-act="mclose" disabled={busy || undefined}>Cancel</button><BusyBtn busy={busy} cls="btn dng" act={`rejsave|${b.id}`} label="Reject booking" busyLabel="Rejecting…" /></>}>
      <Bn kind="warn" title="The unit goes back on sale straight away." body="The agent has to raise a new booking." />
      <Fld label="Reason (the agent sees this)" htmlFor="m_txt" err={e.txt}><MTxa k="txt" bad={!!e.txt} /></Fld>
    </Modal>
  );
};
