/* A-L3 Blocked action: DND number, unlogged previous call, or active lead ceiling.
   Opened as blocked|<leadId>|dnd and blocked|<leadId>|unlogged (A.dial) or blocked|x|cap (My Leads, Add lead). */
import React from 'react';
import { eng } from '../../engine';
import { Bn, Modal } from '../../ui';
import type { ModalComp } from '../../app/types';

export const BlockedModal: ModalComp = ({ args: a }) => {
  const k = a[1] || 'cap';
  const u = eng.me();
  const un = eng.S.unlogged[u.id];
  const ul = un ? eng.leadById(un.lead) : null;
  let c: [string, string, React.ReactNode];
  if (k === 'dnd') c = ['This number is on the Do Not Call list', 'The client asked not to be contacted. Calling or messaging is blocked for every agent. Ask Admin if you think this is a mistake.', null];
  else if (k === 'unlogged') c = ['Log your last call first', 'You called ' + (ul ? ul.name : 'a lead') + ' and have not logged the result. Log it to unlock your next call.',
    ul ? <button className="btn pri" type="button" data-open={`call-log|${ul.id}`}>Log that call</button> : null];
  else { const ci = eng.capInfo(u.id); c = ['You are at your active lead ceiling', 'You hold ' + ci.used + ' of ' + ci.cap + ' leads. Close, archive or return leads to make room. Ask your manager if you need a higher ceiling.', null]; }
  return (
    <Modal title={c[0]} foot={<><button className="btn" type="button" data-act="mclose">Close</button>{c[2]}</>}>
      <Bn kind={k === 'cap' ? 'warn' : 'err'} body={c[1]} />
    </Modal>
  );
};
