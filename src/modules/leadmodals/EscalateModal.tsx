/* A-L3-04 Escalate to manager. */
import React from 'react';
import { eng } from '../../engine';
import { Bn, Fld, MOpt, MTxa, Modal } from '../../ui';
import type { ModalComp } from '../../app/types';
import { errs } from './parts';

export const EscalateModal: ModalComp = ({ args: a }) => {
  const l = eng.leadById(a[0]), e = errs();
  const tm = eng.teamById(eng.me().team);
  return (
    <Modal title="Escalate to manager" sub={l.name}
      foot={<><button className="btn" type="button" data-act="mclose">Cancel</button><button className="btn pri" type="button" data-act={`escsave|${l.id}`}>Send to manager</button></>}>
      <Fld label="What do you need?" err={e.kind}>
        <div className="optgrid">{['Discount request', 'Payment plan change', 'Client complaint', 'Other'].map((k) => <MOpt key={k} k="kind" v={k} t={k} />)}</div>
      </Fld>
      <Fld label="Details" htmlFor="m_txt" err={e.txt}><MTxa k="txt" bad={!!e.txt} ph="Give the manager what they need to decide" /></Fld>
      <Bn kind="info" body={'Goes to ' + eng.uname(tm.mgr) + '. You keep ownership and the client relationship. The manager replies here.'} />
    </Modal>
  );
};
