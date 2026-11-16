/* AD-L3-07 Reject one booking document (prototype modal doc-reject, action docrej). */
import React from 'react';
import { eng } from '../../engine';
import { BusyBtn, Fld, MTxa, Modal } from '../../ui';
import type { ModalComp } from '../../app/types';

export const DocRejectModal: ModalComp = ({ args }) => {
  const b = eng.bkById(args[0]);
  const err = eng.UI.mf._e && eng.UI.mf._e.txt;
  const busy = !!eng.UI.mf._busy;
  return (
    <Modal title={'Reject ' + eng.DOCN[args[1]].toLowerCase()} sub={b.id}
      foot={<><button className="btn" type="button" data-act="mclose" disabled={busy || undefined}>Cancel</button><BusyBtn busy={busy} cls="btn dng" act={`docrej|${b.id}|${args[1]}`} label="Reject document" busyLabel="Rejecting…" /></>}>
      <Fld label="What is wrong with it?" htmlFor="m_txt" err={err} hint="The agent re-uploads it."><MTxa k="txt" bad={!!err} /></Fld>
    </Modal>
  );
};
