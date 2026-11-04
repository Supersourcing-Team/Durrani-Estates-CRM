/* AD Add or edit a team (prototype modal team-form). args: [teamId?]. */
import React from 'react';
import { eng } from '../../engine';
import { Fld, MInput, MSel, Modal } from '../../ui';
import type { ModalComp } from '../../app/types';

export const TeamFormModal: ModalComp = ({ args }) => {
  const t = args[0] ? eng.teamById(args[0]) : null, e = eng.UI.mf._e || {};
  const mgrs: [string, string][] = eng.S.users.filter((u: any) => u.role === 'mgmt' && u.status !== 'removed').map((u: any) => [u.id, u.name]);
  return (
    <Modal title={t ? 'Edit team' : 'Add a team'}
      foot={<><button className="btn" type="button" data-act="mclose">Cancel</button><button className="btn pri" type="button" data-act={`teamsave|${t ? t.id : ''}`}>{t ? 'Save' : 'Create team'}</button></>}>
      <Fld label="Team name" htmlFor="m_name" err={e.name} req><MInput k="name" bad={!!e.name} /></Fld>
      <div className="frm">
        <Fld label="Office" htmlFor="m_office" err={e.office} req><MInput k="office" bad={!!e.office} /></Fld>
        <Fld label="Region" htmlFor="m_region"><MInput k="region" ph="UAE, India" /></Fld>
      </div>
      <Fld label="Manager" htmlFor="m_mgr" err={e.mgr} req><MSel k="mgr" opts={mgrs} bad={!!e.mgr} blank="Choose a manager" /></Fld>
    </Modal>
  );
};
