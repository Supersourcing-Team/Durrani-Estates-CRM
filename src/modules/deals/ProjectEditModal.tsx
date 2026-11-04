/* Add or edit a project, Admin (prototype modal project-edit; args: [projectId?]). Save runs A.projsave. */
import React from 'react';
import { eng } from '../../engine';
import { Fld, MInput, MSel, MTxa, Modal, Toggle } from '../../ui';
import type { ModalComp } from '../../app/types';

export const ProjectEditModal: ModalComp = ({ args }) => {
  const p = args[0] ? eng.projById(args[0]) : null;
  const f = eng.UI.mf, e = f._e || {};
  return (
    <Modal title={p ? 'Edit ' + p.name : 'Add a project'} drawer
      foot={<>
        <button className="btn" type="button" data-act="mclose">Cancel</button>
        <button className="btn pri" type="button" data-act={`projsave|${p ? p.id : ''}`}>{p ? 'Save' : 'Create project'}</button>
      </>}>
      <Fld label="Project name" htmlFor="m_name" err={e.name} req><MInput k="name" bad={!!e.name} /></Fld>
      <div className="frm">
        <Fld label="Developer" htmlFor="m_dev" err={e.dev} req><MInput k="dev" bad={!!e.dev} /></Fld>
        <Fld label="RERA number" htmlFor="m_rera"><MInput k="rera" /></Fld>
      </div>
      <div className="frm">
        <Fld label="Area" htmlFor="m_area" err={e.area} req><MInput k="area" bad={!!e.area} /></Fld>
        <Fld label="City" htmlFor="m_city"><MInput k="city" /></Fld>
      </div>
      <div className="frm">
        <Fld label="Type" htmlFor="m_type"><MSel k="type" opts={['Apartment', 'Villa']} blank={false} /></Fld>
        <Fld label="Status" htmlFor="m_status"><MSel k="status" opts={['Pre-launch', 'Launched', 'Under construction', 'Near completion', 'Ready']} blank={false} /></Fld>
      </div>
      <div className="frm">
        <Fld label="Handover" htmlFor="m_ho"><MInput k="ho" ph="Q4 2028" /></Fld>
        <Fld label="Payment plan" htmlFor="m_plan" err={e.plan} req><MInput k="plan" bad={!!e.plan} ph="60/40" /></Fld>
      </div>
      <div className="frm">
        <Fld label="Developer commission %" htmlFor="m_comm" err={e.comm} req><MInput k="comm" type="number" bad={!!e.comm} /></Fld>
        <Fld label="Buyer must pay (%) before incentive releases" htmlFor="m_rel" err={e.rel} req><MInput k="rel" type="number" bad={!!e.rel} /></Fld>
      </div>
      <Fld label="Description" htmlFor="m_desc"><MTxa k="desc" /></Fld>
      <div className="row sb" style={{ padding: '8px 0' }}><span>Show in the agent catalogue</span><Toggle on={!!f.active} act="mflip|active" /></div>
      <div className="row sb" style={{ padding: '8px 0' }}><span>Mark as priority</span><Toggle on={!!f.pri} act="mflip|pri" /></div>
    </Modal>
  );
};
