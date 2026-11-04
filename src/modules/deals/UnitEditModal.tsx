/* Add or edit a unit, Admin (prototype modal unit-edit; args: [projectId, unitId?]). Save runs A.unitsave. */
import React from 'react';
import { eng } from '../../engine';
import { Bn, Fld, MInput, MSel, Modal, Toggle } from '../../ui';
import type { ModalComp } from '../../app/types';

const TYPES = ['Studio', '1 Bedroom', '2 Bedroom', '3 Bedroom', '4 Bedroom', '3 Bedroom Villa', '4 Bedroom Villa'];

export const UnitEditModal: ModalComp = ({ args }) => {
  const p = eng.projById(args[0]);
  const u = args[1] ? p.units.find((x: any) => x.id === args[1]) : null;
  const f = eng.UI.mf, e = f._e || {};
  return (
    <Modal title={u ? 'Edit unit ' + u.id : 'Add a unit'} sub={p.name}
      foot={<>
        <button className="btn" type="button" data-act="mclose">Cancel</button>
        <button className="btn pri" type="button" data-act={`unitsave|${p.id}|${u ? u.id : ''}`}>{u ? 'Save' : 'Add unit'}</button>
      </>}>
      <Fld label="Unit number" htmlFor="m_id" err={e.id} req><MInput k="id" bad={!!e.id} dis={!!u} /></Fld>
      <div className="frm">
        <Fld label="Type" htmlFor="m_type"><MSel k="type" opts={TYPES} blank={false} /></Fld>
        <Fld label="Size (sqft)" htmlFor="m_size" err={e.size} req><MInput k="size" type="number" bad={!!e.size} /></Fld>
      </div>
      <Fld label="Price (AED)" htmlFor="m_price" err={e.price} req><MInput k="price" type="number" bad={!!e.price} /></Fld>
      {u && u.status === 'Held' ? (
        <Bn kind="warn" title={'Unit is held by ' + eng.uname(u.holdBy)} body="You can release the hold. The booking expires and the agent is told."
          acts={<button className="btn s" type="button" data-act={`holdrel|${p.id}|${u.id}`}>Release hold</button>} />
      ) : null}
      {u && ['Booked', 'Sold'].includes(u.status)
        ? <Bn kind="info" body="Booked and sold units cannot be switched off." />
        : <div className="row sb" style={{ padding: '8px 0' }}><span>Not available for sale (developer block)</span><Toggle on={!!f.off} act="mflip|off" /></div>}
    </Modal>
  );
};
