/*
 * Admin: "Assign lead" drawer on the Assignments page. Pick one or more leads (Unassigned / All active,
 * with search), choose an agent (Team + Agent dropdowns) or a team's queue, give a reason.
 * Saves through the existing bulk assignment (bulksave) so capacity checks, history and audit stay the same.
 */
import React from 'react';
import { eng } from '../../engine';
import { Bn, BusyBtn, Fld, Modal } from '../../ui';
import type { ModalComp } from '../../app/types';
import { AgentPicker, LeadsField, ReasonFld, TeamOpts } from '../leadmodals/assignParts';

export const AssignLeadModal: ModalComp = () => {
  const S = eng.S, f = eng.UI.mf, e: Record<string, string> = f._e || {};
  const tgt: string = f.tgt || 'agent';
  const picked = String(f.lids || '').split(',').filter(Boolean);
  const ag = S.users
    .filter((x: any) => x.role === 'agent' && x.status === 'active')
    .sort((x: any, y: any) => eng.capInfo(y.id).left - eng.capInfo(x.id).left);
  const n = picked.length;
  const busy = !!f._busy;

  return (
    <Modal title="Assign lead" sub="Pick the leads, then choose who gets them." drawer
      foot={<>
        <button className="btn" type="button" data-act="mclose" disabled={busy || undefined}>Cancel</button>
        <BusyBtn busy={busy} act="alsave" label={n > 1 ? `Assign ${n} leads` : 'Assign lead'} busyLabel="Assigning…" />
      </>}>
      <LeadsField e={e} />

      <Fld label="Assign to">
        <div className="seg">
          {([['agent', 'An agent'], ['team', "A team's queue"]] as [string, string][]).map(([k, t]) =>
            <button key={k} type="button" className={tgt === k ? 'on' : ''} data-act={`mset|tgt|${k}`}>{t}</button>)}
        </div>
      </Fld>
      {tgt === 'team'
        ? <Fld label="Team queue" req err={e.to}><TeamOpts cur={f.to} /></Fld>
        : <AgentPicker ag={ag} e={e} />}

      <ReasonFld e={e} first={picked.every((id) => !eng.leadById(id)?.owner)} />
      <Bn kind="info" body="If an agent runs out of room, the rest stay where they are and you see how many were skipped." />
    </Modal>
  );
};
