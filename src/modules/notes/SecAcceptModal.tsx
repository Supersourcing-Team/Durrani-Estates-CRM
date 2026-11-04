/* Admin review or reassign of a secondary request (prototype modal sec-accept, plus the reassign-reason layer). Saves with secdecide. */
import React from 'react';
import { eng } from '../../engine';
import { Fld, MInput, MOpt, MSel, MTxa, Modal } from '../../ui';
import type { ModalComp } from '../../app/types';

const WHY = ['Agent on leave', 'Agent left the team', 'Client asked for someone else', 'Better area knowledge', 'Rebalancing workload'];

export const SecAcceptModal: ModalComp = ({ args }) => {
  const s = eng.secById(args[0]), f = eng.UI.mf, e = f._e || {};
  const isReq = s.status === 'Requested';
  const reassign = !isReq && f.dec === 're';
  const ag = eng.agentsAll().filter((u: any) => u.status === 'active')
    .sort((x: any, y: any) => (y.tag === 'Secondary' ? 1 : 0) - (x.tag === 'Secondary' ? 1 : 0))
    .map((u: any) => [u.id, u.name + (u.tag ? ' · ' + u.tag + ' agent' : '')] as [string, string]);
  const foot = (
    <>
      <button className="btn" type="button" data-act="mclose">Cancel</button>
      <button className="btn pri" type="button" data-act={`secdecide|${s.id}`}>Confirm</button>
    </>
  );
  return (
    <Modal title={reassign ? 'Reassign ' + s.id : isReq ? 'Review request' : 'Reassign'}
      sub={reassign ? s.prop + ' · now with ' + (s.owner ? eng.uname(s.owner) : 'nobody') : s.id + ' · ' + s.prop} foot={foot}>
      {isReq ? (
        <Fld label="Decision" err={e.dec}>
          <div className="optgrid"><MOpt k="dec" v="ok" t="Accept and assign" /><MOpt k="dec" v="no" t="Decline" /></div>
        </Fld>
      ) : null}
      {f.dec === 'ok' || f.dec === 're' ? (
        <>
          <Fld label="Assign to" htmlFor="m_owner" err={e.owner} hint="Secondary-tag agents are listed first.">
            <MSel k="owner" opts={ag} bad={!!e.owner} blank="Choose an agent" />
          </Fld>
          <Fld label="Commission %" htmlFor="m_comm" err={e.comm}><MInput k="comm" type="number" bad={!!e.comm} /></Fld>
        </>
      ) : null}
      {f.dec === 'no' ? <Fld label="Reason (the requester sees it)" htmlFor="m_txt" err={e.txt}><MTxa k="txt" bad={!!e.txt} /></Fld> : null}
      {reassign ? (
        <Fld label="Reason for reassigning" htmlFor="m_why" err={e.why} req hint="Saved in the listing history and the audit log. The old and new agent are told.">
          <div className="row g6 wrap mb8">
            {WHY.map((t) => <button key={t} type="button" className={'pill sm ' + (f.why === t ? 'on' : '')} data-act={`mset|why|${t}`}>{t}</button>)}
          </div>
          <MTxa k="why" bad={!!e.why} ph="Or write your own reason" />
        </Fld>
      ) : null}
    </Modal>
  );
};
