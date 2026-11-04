/* S-L3-12 How lead assignment works (prototype modal assign-info, 15b-leads.js). */
import React from 'react';
import { eng } from '../../engine';
import { Icon, Modal } from '../../ui';
import type { ModalComp } from '../../app/types';

const FLOW: [string, string][] = [
  ['Lead comes in', 'From Meta or Google Ads, an Excel upload, or added by hand. The phone number is checked for duplicates first.'],
  ['Routing rule decides where it lands', "Each source has a rule set by Admin: the Admin pool, a team queue, or spread to a team's agents automatically. A lead an agent adds stays with that agent."],
  ['Admin assigns from the pool', 'To an agent directly, or to a team queue for the manager to place.'],
  ['Manager assigns from the team queue', 'One by one, selected leads, or spread evenly across the team. The lead ceiling is checked every time.'],
  ['Agent is told', 'The lead shows in My Leads with a notification. The inactivity clock starts.'],
];

export const AssignInfoModal: ModalComp = () => {
  const set = eng.S.set;
  return (
    <Modal title="How lead assignment works" size="w" foot={<button className="btn pri" type="button" data-act="mclose">Got it</button>}>
      <div className="ov mb8">New leads</div>
      <div className="stp mb16">
        {FLOW.map(([t, d], i) => (
          <div key={t} className="stpi"><span className="dot2">{i + 1}</span><div className="bd"><div className="b">{t}</div><div className="muted sm">{d}</div></div></div>
        ))}
      </div>
      <div className="ov mb8">Leads already being worked</div>
      <div className="col g6 sm">
        <div><Icon n="repeat" s={14} /> <b>Manager</b> moves leads between agents in their own team, or back to the team queue.</div>
        <div><Icon n="repeat" s={14} /> <b>Admin</b> moves any lead to any agent, any team queue or back to the pool.</div>
        <div><Icon n="clock" s={14} /> <b>No progress for {set.inactX} days</b> marks a lead at risk. After {set.inactY} more days it returns to the Admin pool by itself.</div>
        <div><Icon n="link" s={14} /> <b>Linked leads</b> (same number, new campaign) stay with the original agent while that lead is active.</div>
        <div><Icon n="lock" s={14} /> <b>Deactivating an agent</b> asks Admin where every one of their leads goes first.</div>
        <div><Icon n="edit" s={14} /> <b>A reason is always required.</b> It is saved in the lead history and the audit log, and the old and new owner are told.</div>
      </div>
    </Modal>
  );
};
