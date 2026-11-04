/* AD Deactivate a person (prototype modal deactivate). Agents with active leads must choose where the leads go. args: [userId]. */
import React from 'react';
import { eng } from '../../engine';
import { Bn, Fld, MOpt, Modal } from '../../ui';
import type { ModalComp } from '../../app/types';

export const DeactivateModal: ModalComp = ({ args }) => {
  const S = eng.S, u = eng.userById(args[0]);
  const ls: any[] = eng.leadsOf(u.id);
  const e = eng.UI.mf._e || {};
  const others: any[] = eng.agentsAll().filter((x: any) => x.id !== u.id && x.status === 'active');
  const bk: any[] = S.bookings.filter((b: any) => b.agent === u.id && ['pending', 'changes'].includes(b.status));
  return (
    <Modal title={'Deactivate ' + u.name}
      foot={<><button className="btn" type="button" data-act="mclose">Cancel</button><button className="btn dng" type="button" data-act={`deactsave|${u.id}`}>Deactivate</button></>}>
      <Bn kind="warn" title="They will not be able to sign in." body="Their approved and closed bookings stay credited to them." />
      {u.role === 'agent' && ls.length ? (
        <Fld label={'What happens to their ' + ls.length + ' active leads?'} err={e.to}>
          <div className="col g6">
            <MOpt k="to" v="pool" t="Return all to the Admin pool" d="Assign them again from Assignments" />
            {others.map((x) => {
              const c = eng.capInfo(x.id);
              return c.left < ls.length ? (
                <button key={x.id} type="button" className="opt" disabled style={{ opacity: 0.55, cursor: 'not-allowed' }}>
                  <span><span className="t">Move to {x.name}</span><span className="d" style={{ display: 'block' }}>Only {c.left} free, needs {ls.length}</span></span>
                </button>
              ) : <MOpt key={x.id} k="to" v={x.id} t={'Move all to ' + x.name} d={c.left + ' slots free'} />;
            })}
          </div>
        </Fld>
      ) : null}
      {bk.length ? <Bn kind="info" body={bk.length + ' booking' + (bk.length > 1 ? 's are' : ' is') + ' still waiting for review. They stay with Admin.'} /> : null}
    </Modal>
  );
};
