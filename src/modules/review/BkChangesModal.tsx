/* AD-L3-05 Ask the agent for changes (prototype modal bk-changes, action chgsave). */
import React from 'react';
import { eng } from '../../engine';
import { Bn, Fld, MOpt, MTxa, Modal } from '../../ui';
import type { ModalComp } from '../../app/types';

const OPTS: [string, string][] = [['none', 'Neither, just details'], ['form', 'Booking form'], ['receipt', 'Deposit receipt'], ['both', 'Both']];

export const BkChangesModal: ModalComp = ({ args }) => {
  const b = eng.bkById(args[0]), e = eng.UI.mf._e || {};
  return (
    <Modal title="Ask for changes" sub={b.id}
      foot={<><button className="btn" type="button" data-act="mclose">Cancel</button><button className="btn pri" type="button" data-act={`chgsave|${b.id}`}>Send back</button></>}>
      <Fld label="Which document needs fixing?" err={e.doc}>
        <div className="optgrid">{OPTS.map(([k, t]) => <MOpt key={k} k="doc" v={k} t={t} />)}</div>
      </Fld>
      <Fld label="What should the agent fix?" htmlFor="m_txt" err={e.txt}><MTxa k="txt" bad={!!e.txt} ph="Be specific so they can fix it in one go" /></Fld>
      <Bn kind="info" body="The unit stays held. The agent has until the hold ends to fix and resubmit." />
    </Modal>
  );
};
