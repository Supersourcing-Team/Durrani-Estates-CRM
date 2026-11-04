/*
 * S-L3-06 Reassign / assign a lead (manager and Admin; also opened from the assignment screens).
 * Final prototype render: MD['reassign'].render in the "assignment model" block (overrides the mdef in 07-mgmt).
 * Manager: pick an agent in the team or send the lead back to the team queue.
 * Admin: target switch (an agent / a team's queue / Admin pool), then the matching picker.
 */
import React from 'react';
import { eng } from '../../engine';
import { Bn, Fld, Modal, mv } from '../../ui';
import type { ModalComp } from '../../app/types';
import { errs } from './parts';
import { AgentOpts, ReasonFld, TeamOpts } from './assignParts';

const TARGETS: [string, string][] = [['agent', 'An agent'], ['team', "A team's queue"]];

export const ReassignModal: ModalComp = ({ args: a }) => {
  const S = eng.S, f = eng.UI.mf, e = errs();
  const l = eng.leadById(a[0]);
  const role = eng.me().role;
  const admin = role === 'admin';
  const where = l.owner ? eng.uname(l.owner) : l.team ? eng.teamName(l.team) + ' queue' : 'the Admin pool';
  const ag = (admin ? S.users.filter((x: any) => x.role === 'agent' && x.status === 'active') : eng.myTeam())
    .filter((x: any) => x.id !== l.owner)
    .sort((x: any, y: any) => eng.capInfo(y.id).left - eng.capInfo(x.id).left);
  const tgt = f.tgt || 'agent';
  const targets = l.owner || l.team ? [...TARGETS, ['pool', 'Admin pool']] : TARGETS;

  let who: React.ReactNode;
  if (admin && f.tgt === 'team') who = <TeamOpts cur={f.to} exclude={l.owner ? null : l.team} />;
  else if (admin && f.tgt === 'pool') who = <Bn kind="info" body="The lead goes back to the Admin pool, unassigned, until you place it again." />;
  else who = (
    <>
      <AgentOpts ag={ag} cur={f.to} />
      {role === 'mgmt' && l.owner ? (
        <button type="button" className={'opt mt8 ' + (mv('to') === 'queue' ? 'on' : '')} data-act="mset|to|queue">
          <span><span className="t">Back to the team queue</span><span className="d" style={{ display: 'block' }}>Unassigned inside your team until you pick an agent</span></span>
        </button>
      ) : null}
    </>
  );

  return (
    <Modal title={l.owner ? 'Reassign lead' : 'Assign lead'} sub={`${l.name} · LEAD-${l.id} · now with ${where}`}
      foot={<><button className="btn" type="button" data-act="mclose">Cancel</button><button className="btn pri" type="button" data-act={`reassave|${l.id}`}>{l.owner ? 'Reassign' : 'Assign'}</button></>}>
      {admin ? (
        <div className="seg mb8">
          {targets.map(([k, t]) => <button key={k} type="button" className={tgt === k ? 'on' : ''} data-act={`mset|tgt|${k}`}>{t}</button>)}
        </div>
      ) : null}
      <Fld label={admin ? 'Send to' : 'New owner'} err={e.to}>{who}</Fld>
      <ReasonFld e={e} first={!l.owner} />
      {l.esc && l.esc.status === 'open' ? <Bn kind="warn" title="Open escalation" body="The escalation moves with the lead." /> : null}
    </Modal>
  );
};
