/* M Reject a regularisation (prototype modal reg-reject) or a leave request (leave-reject). args: [request id]. */
import React from 'react';
import { eng } from '../../engine';
import { Fld, MTxa, Modal } from '../../ui';
import type { ModalComp } from '../../app/types';

function RejectModal({ title, user, act }: { title: string; user: string; act: string }) {
  const e = eng.UI.mf._e || {};
  return (
    <Modal title={title} sub={eng.uname(user)}
      foot={<><button className="btn" type="button" data-act="mclose">Cancel</button><button className="btn dng" type="button" data-act={act}>Reject</button></>}>
      <Fld label="Reason" htmlFor="m_why" err={e.why} hint="The agent sees this."><MTxa k="why" bad={!!e.why} /></Fld>
    </Modal>
  );
}

export const RegRejectModal: ModalComp = ({ args }) =>
  <RejectModal title="Reject request" user={eng.S.reg.find((x: any) => x.id === args[0]).user} act={`regrej|${args[0]}`} />;

export const LeaveRejectModal: ModalComp = ({ args }) =>
  <RejectModal title="Reject leave" user={eng.S.leave.find((x: any) => x.id === args[0]).user} act={`leaverej|${args[0]}`} />;
