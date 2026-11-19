/* S-L3-05 Add a note. */
import React from 'react';
import { eng } from '../../engine';
import { BusyBtn, Fld, MTxa, Modal } from '../../ui';
import type { ModalComp } from '../../app/types';
import { errs } from './parts';

export const NoteModal: ModalComp = ({ args: a }) => {
  const l = eng.leadById(a[0]), e = errs();
  const busy = !!eng.UI.mf._busy;
  return (
    <Modal title="Add a note" sub={l.name}
      foot={<><button className="btn" type="button" data-act="mclose" disabled={busy || undefined}>Cancel</button><BusyBtn busy={busy} act={`notesave|${l.id}`} label="Save note" busyLabel="Saving…" /></>}>
      <Fld label="Note" htmlFor="m_txt" err={e.txt} hint="Notes do not reset the inactivity clock.">
        <MTxa k="txt" ph="Visible to the agent, manager and Admin" bad={!!e.txt} />
      </Fld>
    </Modal>
  );
};
