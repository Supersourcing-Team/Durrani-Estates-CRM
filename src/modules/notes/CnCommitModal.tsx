/* A-L3-19 Client wants to proceed (prototype modal cn-commit). Saves with the cncommit action. */
import React from 'react';
import { eng } from '../../engine';
import { Fld, MCheck, MInput, MSel, Modal } from '../../ui';
import type { ModalComp } from '../../app/types';

export const CnCommitModal: ModalComp = ({ args }) => {
  const S = eng.S;
  const l = eng.leadById(args[0]);
  const e = eng.UI.mf._e || {};
  const foot = (
    <>
      <button className="btn" type="button" data-act="mclose">Cancel</button>
      <button className="btn pri" type="button" data-act={`cncommit|${l.id}`}>Confirm</button>
    </>
  );
  return (
    <Modal title="Client wants to proceed" sub={l.name} foot={foot}>
      <div className="frm">
        <Fld label="Amount" htmlFor="m_amt" err={e.amt}><MInput k="amt" type="number" bad={!!e.amt} /></Fld>
        <Fld label="Currency" htmlFor="m_cur"><MSel k="cur" opts={['AED', 'INR']} blank={false} /></Fld>
      </div>
      <label className="chk">
        <MCheck k="ok" />{' '}
        <span>The client understands: {S.set.cn.tenure} months, {S.set.cn.rate}% a month, principal returned at maturity, payouts by post-dated cheque.</span>
      </label>
      {e.ok ? <span className="err" style={{ color: 'var(--tx-danger)', fontSize: 12 }}>{e.ok}</span> : null}
    </Modal>
  );
};
