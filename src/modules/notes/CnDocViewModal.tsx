/* View a note application document (prototype modal cn-docview, args [leadId, docKey], 15c-deals). Verify with cnv, reject via cnrejfrom. */
import React from 'react';
import { eng, fd } from '../../engine';
import { Chip, Icon, Modal } from '../../ui';
import type { ModalComp } from '../../app/types';

export const CnDocViewModal: ModalComp = ({ args }) => {
  const S = eng.S;
  const l = eng.leadById(args[0]);
  const k = args[1];
  const cn = l.cn;
  const t = (eng.CNDOCS as [string, string][]).find((x) => x[0] === k)![1];
  const s = eng.cnDS(cn, k);
  const CNDS = eng.CNDS;
  const role = eng.me().role;
  const can = ['mgmt', 'admin'].includes(role) && ['Documents', 'Admin review'].includes(cn.stage) && s === 'pending';
  const checkFor = ({
    kyc: 'Name and photo match the client. Document not expired.',
    nominee: 'Nominee name, relation and ID filled and signed.',
    bank: "Account is in the client's name. IBAN or IFSC readable.",
    agreement: 'Every page signed. Amount and tenure match the application.',
    pdc: 'One cheque per month, ' + S.set.cn.tenure + ' cheques, amounts match the payout.',
    receipt: 'Amount received matches the registration fee.',
  } as Record<string, string>)[k];
  const foot = (
    <>
      <button className="btn" type="button" data-act="mclose">Close</button>
      {can ? (
        <>
          <button className="btn" type="button" data-act={`cnrejfrom|${l.id}|${k}`}>Reject</button>
          <button className="btn pri" type="button" data-act={`cnv|${l.id}|${k}`}><Icon n="check" s={16} />Verify</button>
        </>
      ) : null}
    </>
  );
  return (
    <Modal title={t} sub={l.name + ' · LEAD-' + l.id} size="w" foot={foot}>
      <div className="docprev">
        <Icon n={k === 'pdc' ? 'list' : 'file'} s={40} />
        <div className="b mt8">{eng.cnFile(cn, k)}</div>
        <div className="xs muted">Uploaded by {eng.uname(l.owner)} · {cn.submitted ? fd(cn.submitted) : 'this week'}</div>
        <div className="xs faint mt8">The live product shows the file here, with zoom and download.</div>
      </div>
      {/* prototype: dl(...) with the extra mt16 class */}
      <div className="dl mt16">
        <div><span className="k">Status</span><span style={{ textAlign: 'right' }}><Chip t={CNDS[s][0]} cls={CNDS[s][1]} dot={false} /></span></div>
        <div><span className="k">Check for</span><span style={{ textAlign: 'right' }}>{checkFor}</span></div>
      </div>
    </Modal>
  );
};
