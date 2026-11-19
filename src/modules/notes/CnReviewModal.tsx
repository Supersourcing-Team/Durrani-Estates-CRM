/* Admin decision on a note application (prototype modal cn-review as replaced in 15c-deals). Saves with the cndecide action. */
import React from 'react';
import { eng, mfull } from '../../engine';
import { Bn, BusyBtn, Dl, Fld, MOpt, MTxa, Modal } from '../../ui';
import type { ModalComp } from '../../app/types';

export const CnReviewModal: ModalComp = ({ args }) => {
  const S = eng.S, UI = eng.UI;
  const CNDOCS: [string, string][] = eng.CNDOCS;
  const l = eng.leadById(args[0]), c = l.cn, e = UI.mf._e || {};
  const busy = !!UI.mf._busy;
  const mo = Math.round(c.amount * S.set.cn.rate / 100);
  const v = CNDOCS.filter(([k]) => eng.cnDS(c, k) === 'verified').length;
  const rej = CNDOCS.filter(([k]) => eng.cnDS(c, k) === 'rejected');
  const foot = (
    <>
      <button className="btn" type="button" data-act="mclose" disabled={busy || undefined}>Cancel</button>
      <BusyBtn busy={busy} act={`cndecide|${l.id}`} label="Confirm decision" busyLabel="Saving…" />
    </>
  );
  return (
    <Modal title="Decide on this application" sub={l.name + ' · ' + eng.uname(l.owner)} drawer foot={foot}>
      <Dl items={[
        ['Principal', mfull(c.amount, c.cur)], ['Term', S.set.cn.tenure + ' months'], ['Monthly payout', mfull(mo, c.cur) + ' (' + S.set.cn.rate + '%)'],
        ['Principal returned', 'At maturity'], ['Documents verified', <b className={v === CNDOCS.length ? 'oktx' : 'warntx'}>{v} of {CNDOCS.length}</b>],
      ]} />
      {v < CNDOCS.length ? (
        <Bn kind="warn" title="Not every document is verified"
          body={'Verify or reject each one on the application page first.' + (rej.length ? ' Rejected: ' + rej.map((x) => x[1]).join(', ') + '.' : '')}
          acts={<a className="btn s" href={`#admin-cnapp-${l.id}`} data-go={`admin-cnapp-${l.id}`}>Open documents</a>} />
      ) : null}
      <Fld label="Decision" err={e.dec} cls="mt16">
        <div className="optgrid">
          <MOpt k="dec" v="ok" t="Approve" d="Creates the active note and the payout schedule" />
          <MOpt k="dec" v="back" t="Send back" d="Agent fixes and resubmits" />
        </div>
      </Fld>
      {UI.mf.dec === 'back' ? (
        <Fld label="What should change?" htmlFor="m_txt" err={e.txt}>
          <MTxa k="txt" bad={!!e.txt} ph={rej.length ? 'Please replace: ' + rej.map((x) => x[1]).join(', ') : ''} />
        </Fld>
      ) : null}
    </Modal>
  );
};
