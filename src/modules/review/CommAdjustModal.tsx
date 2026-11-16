/* AD-L3-11 Adjust an incentive (prototype modal comm-adjust, action adjsave). */
import React from 'react';
import { eng } from '../../engine';
import { BusyBtn, Fld, MInput, MTxa, Modal } from '../../ui';
import type { ModalComp } from '../../app/types';

export const CommAdjustModal: ModalComp = ({ args }) => {
  const b = eng.bkById(args[0]), e = eng.UI.mf._e || {};
  const busy = !!eng.UI.mf._busy;
  return (
    <Modal title="Adjust incentive" sub={b.id}
      foot={<><button className="btn" type="button" data-act="mclose" disabled={busy || undefined}>Cancel</button><BusyBtn busy={busy} act={`adjsave|${b.id}`} label="Save" busyLabel="Saving…" /></>}>
      <Fld label="Amount to add or subtract (AED)" htmlFor="m_amt" err={e.amt}
        hint={'Currently ' + (b.adj ? eng.mfull(b.adj) : 'no adjustment') + '. This replaces it.'}>
        <MInput k="amt" type="number" bad={!!e.amt} ph="-5000 or 5000" />
      </Fld>
      <Fld label="Reason" htmlFor="m_txt" err={e.txt}><MTxa k="txt" bad={!!e.txt} /></Fld>
    </Modal>
  );
};
