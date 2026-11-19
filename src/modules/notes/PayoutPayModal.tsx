/* Mark a note payout as paid (prototype modal payout-pay, args [noteId, payoutNo]). Saves with the paypaid action. */
import React from 'react';
import { eng, mfull } from '../../engine';
import { BusyBtn, Fld, MInput, Modal } from '../../ui';
import type { ModalComp } from '../../app/types';

export const PayoutPayModal: ModalComp = ({ args }) => {
  const n = eng.noteById(args[0]), p = n.payouts[+args[1] - 1], e = eng.UI.mf._e || {};
  const busy = !!eng.UI.mf._busy;
  const foot = (
    <>
      <button className="btn" type="button" data-act="mclose" disabled={busy || undefined}>Cancel</button>
      <BusyBtn busy={busy} act={`paypaid|${n.id}|${p.n}`} label="Mark paid" busyLabel="Saving…" />
    </>
  );
  return (
    <Modal title={'Mark payout ' + p.n + ' as paid'} sub={n.id + ' · ' + mfull(p.amt, n.cur)} foot={foot}>
      <Fld label="Bank reference" htmlFor="m_ref" err={e.ref}><MInput k="ref" bad={!!e.ref} ph="TXN or cheque number" /></Fld>
    </Modal>
  );
};
