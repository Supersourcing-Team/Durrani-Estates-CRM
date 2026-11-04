/* How convertible notes work (prototype modal cn-info, 15c-deals). */
import React from 'react';
import { eng } from '../../engine';
import { Chip, Modal } from '../../ui';
import type { ModalComp } from '../../app/types';

const STEPS: [string, string, string][] = [
  ['Agent qualifies the lead', 'Sets the lead track to Convertible Note and shows the calculator to the client.', 'Agent'],
  ['Terms shared', 'Payout schedule sent by WhatsApp or email from the CRM.', 'Agent'],
  ['Client says yes', 'Agent confirms amount and currency (AED or INR).', 'Agent'],
  ['Six documents collected', 'KYC, nominee, bank details, signed agreement, post-dated cheque register, registration receipt.', 'Agent'],
  ['Documents checked', 'Manager can check first. Admin verifies every document and rejects with a reason if needed.', 'Manager, Admin'],
  ['Admin approves', 'The note and its monthly payout schedule are created. Agent and manager are told.', 'Admin'],
  ['Monthly payouts', 'Admin marks each cheque paid, or bounced and resolves it. Missed payouts are never hidden.', 'Admin'],
  ['Maturity', 'Principal returned, note closed. Renewal terms are still open with Durrani.', 'Admin'],
];

export const CnInfoModal: ModalComp = () => {
  const S = eng.S;
  const foot = <button className="btn pri" type="button" data-act="mclose">Got it</button>;
  return (
    <Modal title="How convertible notes work" size="w" foot={foot}>
      <p className="sm">A client lends a fixed amount to Durrani for {S.set.cn.tenure} months. They get {S.set.cn.rate}% of it every month by post-dated cheque, and the full amount back at the end. Any agent can sell it. No tag is needed.</p>
      <div className="stp mt16">
        {STEPS.map(([t, d, w], i) => (
          <div className="stpi" key={i}>
            <span className="dot2">{i + 1}</span>
            <div className="bd"><div className="row sb"><span className="b">{t}</span><Chip t={w} cls="s2" dot={false} /></div><div className="muted sm">{d}</div></div>
          </div>
        ))}
      </div>
    </Modal>
  );
};
