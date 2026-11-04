/* Admin creates a resale listing (prototype modal sec-new). Saves with the secnew action. */
import React from 'react';
import { eng } from '../../engine';
import { Fld, MInput, MSel, Modal } from '../../ui';
import type { ModalComp } from '../../app/types';

export const SecNewModal: ModalComp = () => {
  const e = eng.UI.mf._e || {};
  const ag = eng.agentsAll().filter((u: any) => u.status === 'active').map((u: any) => [u.id, u.name + (u.tag ? ' · ' + u.tag : '')] as [string, string]);
  const foot = (
    <>
      <button className="btn" type="button" data-act="mclose">Cancel</button>
      <button className="btn pri" type="button" data-act="secnew">Create listing</button>
    </>
  );
  return (
    <Modal title="Create a listing" drawer foot={foot}>
      <Fld label="Seller name" htmlFor="m_name" err={e.name} req><MInput k="name" bad={!!e.name} /></Fld>
      <Fld label="Property" htmlFor="m_prop" err={e.prop} req><MInput k="prop" bad={!!e.prop} ph="Marina Views 1204, 2BR" /></Fld>
      <div className="frm">
        <Fld label="Location" htmlFor="m_loc" err={e.loc} req><MInput k="loc" bad={!!e.loc} /></Fld>
        <Fld label="Asking price (AED)" htmlFor="m_ask" err={e.ask} req><MInput k="ask" type="number" bad={!!e.ask} /></Fld>
      </div>
      <div className="frm">
        <Fld label="Assign to" htmlFor="m_owner" err={e.owner} req><MSel k="owner" opts={ag} bad={!!e.owner} blank="Choose an agent" /></Fld>
        <Fld label="Commission %" htmlFor="m_comm" err={e.comm}><MInput k="comm" type="number" bad={!!e.comm} /></Fld>
      </div>
    </Modal>
  );
};
