/* M-L3-03 Nudge the agent who owns a lead (preset message plus optional words). */
import React from 'react';
import { eng } from '../../engine';
import { Fld, Icon, MOpt, MTxa, Modal } from '../../ui';
import type { ModalComp } from '../../app/types';

const MSGS = ['Please schedule the next step on this lead today.', 'This client has been waiting. Can you call today?', 'Check the lead notes before your next call.'];

export const NudgeModal: ModalComp = ({ args: a }) => {
  const l = eng.leadById(a[0]);
  return (
    <Modal title="Nudge agent" sub={`${l.name} · ${eng.uname(l.owner)}`}
      foot={<><button className="btn" type="button" data-act="mclose">Cancel</button><button className="btn pri" type="button" data-act={`nudgesave|${l.id}`}><Icon n="send" s={16} />Send nudge</button></>}>
      <Fld label="Message"><div className="col g6">{MSGS.map((m) => <MOpt key={m} k="msg" v={m} t={m} />)}</div></Fld>
      <Fld label="Add your own words (optional)" htmlFor="m_txt"><MTxa k="txt" /></Fld>
    </Modal>
  );
};
