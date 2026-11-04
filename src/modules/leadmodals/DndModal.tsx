/* A-L3-06 Add to Do Not Call list. */
import React from 'react';
import { eng } from '../../engine';
import { Bn, Fld, MTxa, Modal } from '../../ui';
import type { ModalComp } from '../../app/types';

export const DndModal: ModalComp = ({ args: a }) => {
  const l = eng.leadById(a[0]);
  return (
    <Modal title="Add to Do Not Call list" sub={l.name + ' · ' + l.phone}
      foot={<><button className="btn" type="button" data-act="mclose">Cancel</button><button className="btn dng" type="button" data-act={`dndsave|${l.id}`}>Add to DND</button></>}>
      <Bn kind="err" title="This blocks the number for everyone" body="No agent can call or message it again, including through a new campaign. Only Admin can remove it." />
      <Fld label="Reason"><MTxa k="txt" ph="Optional" /></Fld>
    </Modal>
  );
};
