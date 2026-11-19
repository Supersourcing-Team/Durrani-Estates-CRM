/* PDC register (prototype modal cn-pdc, args [leadId, 'pdc']). Saves with the cnpdc action. */
import React from 'react';
import { eng, fd } from '../../engine';
import { BusyBtn, Fld, MInput, Modal } from '../../ui';
import type { ModalComp } from '../../app/types';

export const CnPdcModal: ModalComp = ({ args }) => {
  const S = eng.S;
  const l = eng.leadById(args[0]);
  const e = eng.UI.mf._e || {};
  const busy = !!eng.UI.mf._busy;
  const foot = (
    <>
      <button className="btn" type="button" data-act="mclose" disabled={busy || undefined}>Cancel</button>
      <BusyBtn busy={busy} act={`cnpdc|${l.id}`} label="Save register" busyLabel="Saving…" />
    </>
  );
  return (
    <Modal title="PDC register" sub={l.name + ' · ' + S.set.cn.tenure + ' monthly cheques'} foot={foot}>
      <div className="frm">
        <Fld label="Bank" htmlFor="m_bank" err={e.bank}><MInput k="bank" bad={!!e.bank} ph="HDFC Bank" /></Fld>
        <Fld label="First cheque number" htmlFor="m_first" err={e.first}><MInput k="first" bad={!!e.first} ph="104401" /></Fld>
        <Fld label="Number of cheques" htmlFor="m_n" err={e.n} hint="One for each month of the term."><MInput k="n" type="number" bad={!!e.n} /></Fld>
      </div>
      <p className="muted sm">Cheque dates follow the payout schedule: {fd(eng.addMonths(eng.NOW(), 1))} onward.</p>
    </Modal>
  );
};
