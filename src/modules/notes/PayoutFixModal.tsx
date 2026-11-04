/* Resolve a bounced payout (prototype modal payout-fix, args [noteId, payoutNo]). Saves with the payfixed action. */
import React from 'react';
import { eng, mfull } from '../../engine';
import { Fld, MInput, MOpt, Modal } from '../../ui';
import type { ModalComp } from '../../app/types';

export const PayoutFixModal: ModalComp = ({ args }) => {
  const n = eng.noteById(args[0]), p = n.payouts[+args[1] - 1], e = eng.UI.mf._e || {};
  const foot = (
    <>
      <button className="btn" type="button" data-act="mclose">Cancel</button>
      <button className="btn pri" type="button" data-act={`payfixed|${n.id}|${p.n}`}>Mark resolved</button>
    </>
  );
  return (
    <Modal title={'Resolve bounced payout ' + p.n} sub={n.id + ' · ' + mfull(p.amt, n.cur)} foot={foot}>
      <Fld label="How was it settled?" err={e.how}>
        <div className="optgrid">
          <MOpt k="how" v="rep" t="Cheque re-presented and cleared" />
          <MOpt k="how" v="bank" t="Paid by bank transfer" />
        </div>
      </Fld>
      <Fld label="Reference" htmlFor="m_ref" err={e.ref}><MInput k="ref" bad={!!e.ref} /></Fld>
    </Modal>
  );
};
