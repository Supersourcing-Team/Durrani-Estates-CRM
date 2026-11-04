/* Reject a note application document (prototype modal cn-docrej, args [leadId, docKey], 15c-deals). Saves with cnrej. */
import React from 'react';
import { eng } from '../../engine';
import { Fld, MTxa, Modal } from '../../ui';
import type { ModalComp } from '../../app/types';

const WHY = ['Blurry or unreadable', 'Expired', 'Name does not match', 'Page missing', 'Not signed'];

export const CnDocRejModal: ModalComp = ({ args }) => {
  const UI = eng.UI;
  const t = (eng.CNDOCS as [string, string][]).find((x) => x[0] === args[1])![1];
  const e = UI.mf._e || {};
  const foot = (
    <>
      <button className="btn" type="button" data-act="mclose">Cancel</button>
      <button className="btn dng" type="button" data-act={`cnrej|${args[0]}|${args[1]}`}>Reject document</button>
    </>
  );
  return (
    <Modal title={'Reject: ' + t} foot={foot}>
      <div className="row g6 wrap mb8">
        {WHY.map((x) => <button key={x} type="button" className={'pill sm ' + (UI.mf.why === x ? 'on' : '')} data-act={`mset|why|${x}`}>{x}</button>)}
      </div>
      <Fld label="What is wrong?" htmlFor="m_why" err={e.why} req hint="The agent sees this and uploads a new file."><MTxa k="why" bad={!!e.why} /></Fld>
    </Modal>
  );
};
