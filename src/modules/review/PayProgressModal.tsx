/* AD-L3-09 Record buyer payments per milestone (prototype modal pay-progress, actions paytog / paysave).
   UI.mf.paid holds a comma list of 1/0 flags, one per milestone. */
import React from 'react';
import { eng } from '../../engine';
import { Chip, Modal } from '../../ui';
import type { ModalComp } from '../../app/types';

export const PayProgressModal: ModalComp = ({ args }) => {
  const b = eng.bkById(args[0]);
  const pd: boolean[] = String(eng.UI.mf.paid || '').split(',').map((x) => x === '1');
  const tot = eng.sum(b.miles.filter((_m: any, i: number) => pd[i]), (m: any) => m.pct);
  return (
    <Modal title="Record buyer payments" sub={b.id + ' · from the developer statement'}
      foot={<><button className="btn" type="button" data-act="mclose">Cancel</button><button className="btn pri" type="button" data-act={`paysave|${b.id}`}>Save</button></>}>
      <div className="col g6">
        {b.miles.map((m: any, i: number) => (
          <button key={i} type="button" className={'opt ' + (pd[i] ? 'on' : '')} data-act={`paytog|${i}`}>
            <span style={{ flex: 1 }}><span className="t">{m.n}</span><span className="d" style={{ display: 'block' }}>{m.pct}% · {eng.nf(m.amt)}</span></span>
            {pd[i] ? <Chip t="Paid" cls="s6" /> : <Chip t="Not yet" cls="s2" />}
          </button>
        ))}
      </div>
      <p className="sm mt16">Buyer has paid <b>{tot}%</b>. Commission releases at {eng.projById(b.project).relPct}%.</p>
    </Modal>
  );
};
