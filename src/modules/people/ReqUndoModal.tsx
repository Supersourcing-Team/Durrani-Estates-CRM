/* Withdraw, cancel, revoke or reopen a leave / regularisation request (prototype modal req-undo). args: [kind, id, mode]. */
import React from 'react';
import { eng, fd, fds, fhm } from '../../engine';
import { Bn, Dl, Fld, MTxa, Modal } from '../../ui';
import type { ModalComp } from '../../app/types';
import { ReqChip } from './parts';

export const ReqUndoModal: ModalComp = ({ args }) => {
  const [kind, id, mode] = args;
  const x = (kind === 'leave' ? eng.S.leave : eng.S.reg).find((y: any) => y.id === id);
  const e = eng.UI.mf._e || {};
  const [t, cta, eff] = eng.UNDO[mode];
  const who = eng.uname(x.user);

  const rows: [React.ReactNode, React.ReactNode][] = kind === 'leave'
    ? [['Person', who], ['Type', x.type], ['Dates', fds(x.from) + (x.days > 1 ? ' to ' + fds(x.to) : '') + ' · ' + x.days + ' day' + (x.days > 1 ? 's' : '')], ['Status', <ReqChip x={x} />]]
    : [['Person', who], ['Date', fd(x.date)], ['Asked for', (x.in ? 'In ' + fhm(x.in) : '') + (x.in && x.out ? ', ' : '') + (x.out ? 'Out ' + fhm(x.out) : '') || 'Mark present'], ['Status', <ReqChip x={x} />]];

  let effect: string = eff;
  if (mode === 'revoke' && kind === 'reg') {
    const p = x._prev;
    effect = 'The attendance record goes back to what it was before' + (p ? ' (' + p.st + (p.in ? ', in ' + fhm(p.in) : '') + (p.out ? ', out ' + fhm(p.out) : '') + ')' : '') + '. ' + who + ' is told.';
  }
  if (mode === 'revoke' && kind === 'leave') effect = 'The leave is removed. Any day already passed shows from the punch record instead. ' + who + ' is told.';

  return (
    <Modal title={t} sub={kind === 'leave' ? 'Leave request' : 'Regularisation request'}
      foot={<>
        <button className="btn" type="button" data-act="mclose">Keep as is</button>
        <button className={'btn ' + (mode === 'revoke' || mode === 'cancel' ? 'dng' : 'pri')} type="button" data-act={`requndo|${kind}|${id}|${mode}`}>{cta}</button>
      </>}>
      <Dl items={rows} />
      <Fld label="Reason" htmlFor="m_why" err={e.why} req hint="Saved on the request and in the audit log.">
        <MTxa k="why" bad={!!e.why} ph={mode === 'revoke' ? 'For example: client meeting moved, leave no longer needed' : 'Why are you doing this?'} />
      </Fld>
      <Bn kind={mode === 'revoke' ? 'warn' : 'info'} body={effect} />
    </Modal>
  );
};
