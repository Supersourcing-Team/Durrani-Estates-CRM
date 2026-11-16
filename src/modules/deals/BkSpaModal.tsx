/* Mark the SPA as issued (prototype modal bk-spa; args: [bookingId]). Save runs A.spasave. */
import React from 'react';
import { eng } from '../../engine';
import { BusyBtn, Fld, MInput, Modal } from '../../ui';
import type { ModalComp } from '../../app/types';

export const BkSpaModal: ModalComp = ({ args }) => {
  const b = eng.bkById(args[0]);
  const err = eng.UI.mf._e && eng.UI.mf._e.d;
  const busy = !!eng.UI.mf._busy;
  return (
    <Modal title="Mark SPA issued" sub={b.id}
      foot={<><button className="btn" type="button" data-act="mclose" disabled={busy || undefined}>Cancel</button><BusyBtn busy={busy} act={`spasave|${b.id}`} label="Save" busyLabel="Saving…" /></>}>
      <Fld label="Date the developer issued the SPA" htmlFor="m_d" err={err} hint="This unlocks the signed SPA upload.">
        <MInput k="d" type="date" bad={!!err} />
      </Fld>
    </Modal>
  );
};
