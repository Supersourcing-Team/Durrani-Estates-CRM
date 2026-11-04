/* A-L3-24 Request regularisation (prototype modal regularise, with the 15a-att manager wording). args: [day timestamp]. */
import React from 'react';
import { eng, f2 } from '../../engine';
import { Bn, Fld, MInput, MTxa, Modal } from '../../ui';
import type { ModalComp } from '../../app/types';

export const RegulariseModal: ModalComp = ({ args }) => {
  const day = +args[0];
  const r = eng.S.att.find((x: any) => x.u === eng.me().id && x.date === day);
  const e = eng.UI.mf._e || {};
  const who = eng.me().role === 'mgmt' ? 'Admin' : 'Your manager';
  return (
    <Modal title="Request regularisation" sub={f2(day, { weekday: 'long', day: 'numeric', month: 'long' }) + ' · ' + r.st}
      foot={<><button className="btn" type="button" data-act="mclose">Cancel</button><button className="btn pri" type="button" data-act={`regsave|${args[0]}`}>Send request</button></>}>
      <div className="frm">
        <Fld label="Correct punch in" htmlFor="m_tin" hint="Leave blank if unchanged"><MInput k="tin" type="time" /></Fld>
        <Fld label="Correct punch out" htmlFor="m_tout" hint="Leave blank if unchanged"><MInput k="tout" type="time" /></Fld>
      </div>
      <Fld label="Reason" htmlFor="m_why" err={e.why}><MTxa k="why" bad={!!e.why} ph="What happened?" /></Fld>
      <Bn kind="info" body={`${who} approves or rejects this. The record changes only after approval.`} />
    </Modal>
  );
};
