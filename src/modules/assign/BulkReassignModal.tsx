/* S-L3-07 Assign / reassign selected leads (prototype modal bulk-reassign, final version in 15b-leads.js). Saves with bulksave. */
import React from 'react';
import { eng } from '../../engine';
import { Bn, Fld, Modal } from '../../ui';
import { AgentOpts, ReasonFld, TeamOpts, selIds } from './parts';
import type { ModalComp } from '../../app/types';

export const BulkReassignModal: ModalComp = () => {
  const S = eng.S, f = eng.UI.mf, e = f._e || {};
  const ids = selIds();
  const role = eng.me().role;
  const ag: any[] = (role === 'admin' ? S.users.filter((x: any) => x.role === 'agent' && x.status === 'active') : eng.myTeam())
    .sort((x: any, y: any) => eng.capInfo(y.id).left - eng.capInfo(x.id).left);
  const tgt = f.tgt || 'agent';

  return (
    <Modal title={(role === 'admin' ? 'Assign ' : 'Reassign ') + ids.length + ' lead' + (ids.length > 1 ? 's' : '')}
      foot={<>
        <button className="btn" type="button" data-act="mclose">Cancel</button>
        <button className="btn pri" type="button" data-act="bulksave">Assign {ids.length}</button>
      </>}>
      {/* Admin chooses between an agent and a team queue */}
      {role === 'admin' ? (
        <div className="seg mb8">
          {([['agent', 'An agent'], ['team', "A team's queue"]] as [string, string][]).map(([k, t]) =>
            <button key={k} type="button" className={tgt === k ? 'on' : ''} data-act={`mset|tgt|${k}`}>{t}</button>)}
        </div>
      ) : null}
      <Fld label="Send to" err={e.to}>
        {f.tgt === 'team' ? <TeamOpts cur={f.to} /> : <AgentOpts ag={ag} cur={f.to} n={1} />}
      </Fld>
      <ReasonFld e={e} first={role === 'admin' || ids.every((id) => !eng.leadById(id).owner)} />
      <Bn kind="info" body="If the agent runs out of room, the rest stay where they are and you see how many were skipped." />
    </Modal>
  );
};
