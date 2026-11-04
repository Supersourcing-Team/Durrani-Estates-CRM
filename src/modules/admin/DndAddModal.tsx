/* AD-L3-21 Add a number to the Do Not Call list (prototype modal dnd-add, saved by dndadd). */
import { eng } from '../../engine';
import { Bn, Fld, MInput, MTxa, Modal } from '../../ui';
import type { ModalComp } from '../../app/types';

export const DndAddModal: ModalComp = () => {
  const e = eng.UI.mf._e || {};
  return (
    <Modal title="Add to Do Not Call" foot={<>
      <button className="btn" type="button" data-act="mclose">Cancel</button>
      <button className="btn dng" type="button" data-act="dndadd">Add to list</button>
    </>}>
      <Bn kind="err" title="This blocks the number for everyone." body="No agent can call it, and imports skip it." />
      <Fld label="Phone number" htmlFor="m_no" err={e.no}><MInput k="no" bad={!!e.no} ph="+971 50 000 0000" /></Fld>
      <Fld label="Name (optional)" htmlFor="m_name"><MInput k="name" /></Fld>
      <Fld label="Reason" htmlFor="m_txt" err={e.txt}><MTxa k="txt" bad={!!e.txt} /></Fld>
    </Modal>
  );
};
