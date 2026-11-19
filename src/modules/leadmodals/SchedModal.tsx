/* A-L3-02 Schedule next action / Reschedule. */
import React from 'react';
import { eng, dtl, startOfDay, NOW, HR, DAY } from '../../engine';
import { Bn, BusyBtn, Fld, MInput, MOpt, MTxa, Modal } from '../../ui';
import type { ModalComp } from '../../app/types';
import { errs } from './parts';

export const SchedModal: ModalComp = ({ args: a }) => {
  const l = eng.leadById(a[0]), f = eng.UI.mf, e = errs();
  const busy = !!f._busy;
  const sod = startOfDay(NOW());
  const quick: [string, string][] = [['Today 17:00', dtl(sod + 13 * HR)], ['Tomorrow 11:00', dtl(sod + DAY + 7 * HR)], ['In 3 days 11:00', dtl(sod + 3 * DAY + 7 * HR)]];
  const virt = f.mkind === 'virtual';
  return (
    <Modal title={a[1] === 're' ? 'Reschedule' : 'Schedule next action'} sub={l.name}
      foot={<><button className="btn" type="button" data-act="mclose" disabled={busy || undefined}>Cancel</button><BusyBtn busy={busy} act={`schedsave|${l.id}`} label="Save" busyLabel="Saving…" /></>}>
      <Fld label="Type">
        <div className="optgrid"><MOpt k="type" v="Follow-up" t="Follow-up" d="Call or message" /><MOpt k="type" v="Meeting" t="Meeting" d="In person or online" /></div>
      </Fld>
      <Fld label="Date and time (Dubai)" htmlFor="m_nat" err={e.nat}><MInput k="nat" type="datetime-local" bad={!!e.nat} /></Fld>
      <div className="row g6 wrap">
        {quick.map((x) => <button key={x[0]} className="pill" type="button" data-act={`mset|nat|${x[1]}`}>{x[0]}</button>)}
      </div>
      {f.type === 'Meeting' ? (
        <>
          <Fld label="Meeting type"><div className="optgrid"><MOpt k="mkind" v="in-person" t="In person" /><MOpt k="mkind" v="virtual" t="Online" /></div></Fld>
          <Fld label={virt ? 'Meeting link or app' : 'Place'} htmlFor="m_mplace" err={e.mplace}>
            <MInput k="mplace" bad={!!e.mplace} ph={virt ? 'Google Meet' : 'Marina Views sales gallery'} />
          </Fld>
        </>
      ) : null}
      <Fld label="Note"><MTxa k="note" ph="What will you cover?" /></Fld>
      <Bn kind="info" body="A dated follow-up or meeting resets the inactivity clock on this lead." />
    </Modal>
  );
};
