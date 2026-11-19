/* A-L3-04 Escalate to manager. */
import React from 'react';
import { eng } from '../../engine';
import { Bn, BusyBtn, Fld, MOpt, MTxa, Modal } from '../../ui';
import type { ModalComp } from '../../app/types';
import { errs } from './parts';

export const EscalateModal: ModalComp = ({ args: a }) => {
  const l = eng.leadById(a[0]), e = errs();
  const tm = eng.teamById(eng.me().team);
  const busy = !!eng.UI.mf._busy;
  return (
    <Modal title="Escalate to manager" sub={l.name}
      foot={<><button className="btn" type="button" data-act="mclose" disabled={busy || undefined}>Cancel</button><BusyBtn busy={busy} act={`escsave|${l.id}`} label="Send to manager" busyLabel="Sending…" /></>}>
      <Fld label="What do you need?" err={e.kind}>
        <div className="optgrid">{['Discount request', 'Payment plan change', 'Client complaint', 'Other'].map((k) => <MOpt key={k} k="kind" v={k} t={k} />)}</div>
      </Fld>
      <Fld label="Details" htmlFor="m_txt" err={e.txt}><MTxa k="txt" bad={!!e.txt} ph="Give the manager what they need to decide" /></Fld>
      <Bn kind="info" body={'Goes to ' + eng.uname(tm.mgr) + '. You keep ownership and the client relationship. The manager replies here.'} />
    </Modal>
  );
};
