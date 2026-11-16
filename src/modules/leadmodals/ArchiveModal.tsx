/* A-L3-05 Close (archive) this lead. */
import React from 'react';
import { eng } from '../../engine';
import { Bn, BusyBtn, Fld, MOpt, MTxa, Modal } from '../../ui';
import type { ModalComp } from '../../app/types';
import { errs } from './parts';

export const ArchiveModal: ModalComp = ({ args: a }) => {
  const l = eng.leadById(a[0]), e = errs();
  const busy = !!eng.UI.mf._busy;
  return (
    <Modal title="Close this lead" sub={l.name}
      foot={<><button className="btn" type="button" data-act="mclose" disabled={busy || undefined}>Cancel</button><BusyBtn busy={busy} cls="btn dng" act={`archsave|${l.id}`} label="Archive lead" busyLabel="Archiving…" /></>}>
      <Fld label="Reason" err={e.why}>
        <div className="optgrid">{['Not interested', 'Bought elsewhere', 'Budget too low', 'Cannot reach client'].map((k) => <MOpt key={k} k="why" v={k} t={k} />)}</div>
      </Fld>
      <Fld label="Note"><MTxa k="txt" ph="Optional detail" /></Fld>
      <Bn kind="warn" body="The lead is archived and leaves your active list. It does not return to the pool." />
    </Modal>
  );
};
