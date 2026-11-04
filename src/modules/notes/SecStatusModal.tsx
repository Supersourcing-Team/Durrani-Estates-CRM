/* Update a secondary request's status (prototype modal sec-status, args [requestId]). Saves with the secstat action. */
import React from 'react';
import { eng } from '../../engine';
import { Fld, MOpt, MTxa, Modal } from '../../ui';
import type { ModalComp } from '../../app/types';

export const SecStatusModal: ModalComp = ({ args }) => {
  const s = eng.secById(args[0]);
  const e = eng.UI.mf._e || {};
  const foot = (
    <>
      <button className="btn" type="button" data-act="mclose">Cancel</button>
      <button className="btn pri" type="button" data-act={`secstat|${s.id}`}>Save</button>
    </>
  );
  return (
    <Modal title="Update status" sub={s.id} foot={foot}>
      <Fld label="Status">
        <div className="optgrid">{['Follow-up', 'Matched', 'Negotiation', 'Closed', 'Lost'].map((x) => <MOpt key={x} k="st" v={x} t={x} />)}</div>
      </Fld>
      <Fld label="Note" htmlFor="m_txt" err={e.txt}><MTxa k="txt" bad={!!e.txt} ph="What happened?" /></Fld>
    </Modal>
  );
};
