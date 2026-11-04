/* Fix and resubmit a booking after Admin asked for changes (prototype modal bk-resubmit; args: [bookingId]). Save runs A.resubsave. */
import React from 'react';
import { eng } from '../../engine';
import { Bn, Fld, MTxa, Modal } from '../../ui';
import type { ModalComp } from '../../app/types';

export const BkResubmitModal: ModalComp = ({ args }) => {
  const b = eng.bkById(args[0]);
  const rej: string[] = Object.entries(b.docs).filter(([, d]: [string, any]) => d.s === 'rejected').map(([k]) => eng.DOCN[k]);
  const err = eng.UI.mf._e && eng.UI.mf._e.txt;
  return (
    <Modal title="Fix and resubmit" sub={b.id}
      foot={<><button className="btn" type="button" data-act="mclose">Cancel</button><button className="btn pri" type="button" data-act={`resubsave|${b.id}`}>Resubmit</button></>}>
      <Bn kind="warn" title="Admin said" body={b.reason} />
      {rej.length ? <p className="sm">Re-upload from the document list: <b>{rej.join(', ')}</b>. Then add a note here.</p> : null}
      <Fld label="Note to Admin" htmlFor="m_txt" err={err}><MTxa k="txt" bad={!!err} ph="What did you change?" /></Fld>
    </Modal>
  );
};
