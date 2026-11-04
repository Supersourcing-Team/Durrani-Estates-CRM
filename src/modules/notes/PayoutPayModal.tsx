/* Mark a note payout as paid (prototype modal payout-pay, args [noteId, payoutNo]). Saves with the paypaid action. */
import React from 'react';
import { eng, mfull } from '../../engine';
import { Fld, MInput, Modal } from '../../ui';
import type { ModalComp } from '../../app/types';

export const PayoutPayModal: ModalComp = ({ args }) => {
  const n = eng.noteById(args[0]), p = n.payouts[+args[1] - 1], e = eng.UI.mf._e || {};
  const foot = (
    <>
      <button className="btn" type="button" data-act="mclose">Cancel</button>
      <button className="btn pri" type="button" data-act={`paypaid|${n.id}|${p.n}`}>Mark paid</button>
    </>
  );
  return (
    <Modal title={'Mark payout ' + p.n + ' as paid'} sub={n.id + ' · ' + mfull(p.amt, n.cur)} foot={foot}>
      <Fld label="Bank reference" htmlFor="m_ref" err={e.ref}><MInput k="ref" bad={!!e.ref} ph="TXN or cheque number" /></Fld>
    </Modal>
  );
};
