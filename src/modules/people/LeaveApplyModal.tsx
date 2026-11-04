/* M Apply leave for an employee (prototype modal leave-apply). Managers pick from their team, Admin from all agents. */
import React from 'react';
import { eng } from '../../engine';
import { Bn, Fld, MInput, MSel, MTxa, Modal } from '../../ui';
import type { ModalComp } from '../../app/types';

export const LeaveApplyModal: ModalComp = () => {
  const e = eng.UI.mf._e || {};
  const people: any[] = eng.me().role === 'admin' ? eng.agentsAll() : eng.myTeam();
  return (
    <Modal title="Apply leave for an employee"
      foot={<><button className="btn" type="button" data-act="mclose">Cancel</button><button className="btn pri" type="button" data-act="leaveapply">Apply</button></>}>
      <Fld label="Employee" htmlFor="m_who" err={e.who}><MSel k="who" opts={people.map((a) => [a.id, a.name] as [string, string])} bad={!!e.who} blank="Choose an agent" /></Fld>
      <div className="frm">
        <Fld label="Type" htmlFor="m_type" err={e.type}><MSel k="type" opts={eng.LEAVE_TYPES} bad={!!e.type} blank="Choose type" /></Fld>
        <span></span>
        <Fld label="From" htmlFor="m_from" err={e.from}><MInput k="from" type="date" bad={!!e.from} /></Fld>
        <Fld label="To" htmlFor="m_to" err={e.to}><MInput k="to" type="date" bad={!!e.to} /></Fld>
      </div>
      <Fld label="Reason" htmlFor="m_why" err={e.why}><MTxa k="why" bad={!!e.why} /></Fld>
      <Bn kind="info" body="Applied as approved, and the agent is told." />
    </Modal>
  );
};
