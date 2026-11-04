/* AD-L3-07 Reject one booking document (prototype modal doc-reject, action docrej). */
import React from 'react';
import { eng } from '../../engine';
import { Fld, MTxa, Modal } from '../../ui';
import type { ModalComp } from '../../app/types';

export const DocRejectModal: ModalComp = ({ args }) => {
  const b = eng.bkById(args[0]);
  const err = eng.UI.mf._e && eng.UI.mf._e.txt;
  return (
    <Modal title={'Reject ' + eng.DOCN[args[1]].toLowerCase()} sub={b.id}
      foot={<><button className="btn" type="button" data-act="mclose">Cancel</button><button className="btn dng" type="button" data-act={`docrej|${b.id}|${args[1]}`}>Reject document</button></>}>
      <Fld label="What is wrong with it?" htmlFor="m_txt" err={err} hint="The agent re-uploads it."><MTxa k="txt" bad={!!err} /></Fld>
    </Modal>
  );
};
