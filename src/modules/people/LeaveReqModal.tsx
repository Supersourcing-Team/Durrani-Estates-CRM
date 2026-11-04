/* A-L3-25 Request leave (prototype modal leave-req, with the 15a-att manager wording). Saves via data-act="leavesave". */
import React from 'react';
import { eng } from '../../engine';
import { Bn, Fld, MInput, MSel, MTxa, Modal } from '../../ui';
import type { ModalComp } from '../../app/types';

export const LeaveReqModal: ModalComp = () => {
  const e = eng.UI.mf._e || {};
  const note = eng.me().role === 'mgmt'
    ? 'Admin approves leave for managers. Your team still sees you as available until it is approved.'
    : 'Your manager approves leave. Pending leave does not block your leads, but tell your team who covers.';
  return (
    <Modal title="Request leave"
      foot={<><button className="btn" type="button" data-act="mclose">Cancel</button><button className="btn pri" type="button" data-act="leavesave">Send request</button></>}>
      <div className="frm">
        <Fld label="Type" htmlFor="m_type" err={e.type}><MSel k="type" opts={eng.LEAVE_TYPES} bad={!!e.type} blank="Choose type" /></Fld>
        <span></span>
        <Fld label="From" htmlFor="m_from" err={e.from}><MInput k="from" type="date" bad={!!e.from} /></Fld>
        <Fld label="To" htmlFor="m_to" err={e.to}><MInput k="to" type="date" bad={!!e.to} /></Fld>
      </div>
      <Fld label="Reason" htmlFor="m_why" err={e.why}><MTxa k="why" bad={!!e.why} ph="For example: family event" /></Fld>
      <Bn kind="info" body={note} />
    </Modal>
  );
};
