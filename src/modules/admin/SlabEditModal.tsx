/* AD-L3-20 Add or edit a commission slab (prototype modal slab-edit; errors in UI.mf._e, saved by slabsave). */
import { eng } from '../../engine';
import { Bn, Fld, MInput, Modal } from '../../ui';
import type { ModalComp } from '../../app/types';

export const SlabEditModal: ModalComp = ({ args }) => {
  const s = args[0] ? eng.S.set.slabs.find((x: any) => x.id === args[0]) : null;
  const e = eng.UI.mf._e || {};
  return (
    <Modal title={s ? 'Edit ' + s.name : 'Add a slab'} foot={<>
      <button className="btn" type="button" data-act="mclose">Cancel</button>
      <button className="btn pri" type="button" data-act={'slabsave|' + (s ? s.id : '')}>{s ? 'Save' : 'Add slab'}</button>
    </>}>
      <Fld label="Name" htmlFor="m_name" err={e.name}><MInput k="name" bad={!!e.name} /></Fld>
      <div className="frm">
        <Fld label="Revenue threshold (AED)" htmlFor="m_from" err={e.from} hint="Information for agents. Admin still assigns the slab."><MInput k="from" type="number" bad={!!e.from} /></Fld>
        <Fld label="Rate (% of developer commission)" htmlFor="m_rate" err={e.rate}><MInput k="rate" type="number" bad={!!e.rate} /></Fld>
      </div>
      {s ? <Bn kind="warn" body="Changing a rate re-prices incentives that are not yet released. Released ones stay as paid." /> : null}
    </Modal>
  );
};
