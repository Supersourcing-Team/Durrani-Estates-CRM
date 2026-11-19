/* Reject a note application document (prototype modal cn-docrej, args [leadId, docKey], 15c-deals). Saves with cnrej. */
import React from 'react';
import { eng } from '../../engine';
import { BusyBtn, Fld, MTxa, Modal } from '../../ui';
import type { ModalComp } from '../../app/types';

const WHY = ['Blurry or unreadable', 'Expired', 'Name does not match', 'Page missing', 'Not signed'];

export const CnDocRejModal: ModalComp = ({ args }) => {
  const UI = eng.UI;
  const t = (eng.CNDOCS as [string, string][]).find((x) => x[0] === args[1])![1];
  const e = UI.mf._e || {};
  const busy = !!UI.mf._busy;
  const foot = (
    <>
      <button className="btn" type="button" data-act="mclose" disabled={busy || undefined}>Cancel</button>
      <BusyBtn busy={busy} cls="btn dng" act={`cnrej|${args[0]}|${args[1]}`} label="Reject document" busyLabel="Rejecting…" />
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
