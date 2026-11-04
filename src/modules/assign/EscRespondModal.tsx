/* M-L3-01 Respond to escalation (prototype modal esc-respond, args [leadId]). Saves with escreply. */
import React from 'react';
import { eng } from '../../engine';
import { Fld, MOpt, MTxa, Modal } from '../../ui';
import type { ModalComp } from '../../app/types';

export const EscRespondModal: ModalComp = ({ args }) => {
  const l = eng.leadById(args[0]), f = eng.UI.mf, e = f._e || {};
  return (
    <Modal title="Respond to escalation" sub={l.name + ' · from ' + eng.uname(l.esc.by)}
      foot={<>
        <button className="btn" type="button" data-act="mclose">Cancel</button>
        <button className="btn pri" type="button" data-act={`escreply|${l.id}`}>Send reply</button>
      </>}>
      <div className="card soft"><div className="ov">Request</div><div className="mt8">{l.esc.reason}</div></div>
      <Fld label="Your decision" err={e.dec}>
        <div className="optgrid">{['Approved', 'Declined', 'Need more information'].map((d) => <MOpt key={d} k="dec" v={d} t={d} />)}</div>
      </Fld>
      <Fld label="Message to the agent" htmlFor="m_txt" err={e.txt}>
        <MTxa k="txt" bad={!!e.txt} ph="Explain so they can tell the client" />
      </Fld>
    </Modal>
  );
};
