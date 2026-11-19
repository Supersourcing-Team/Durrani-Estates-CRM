/* A-L3-18 Share note details (prototype modal cn-share, plus the channel picker layer). */
import React from 'react';
import { eng, mfull } from '../../engine';
import { BusyBtn, Fld, Icon, Modal } from '../../ui';
import type { ModalComp } from '../../app/types';
import { ChanPick, chanHint } from './parts';
import { resolveCnCalc } from './cnBootstrap';

export const CnShareModal: ModalComp = ({ args }) => {
  const l = eng.leadById(args[0]);
  const c = resolveCnCalc(l.cn.amount);
  const ch = eng.UI.mf.ch;
  const busy = !!eng.UI.mf._busy;
  const msg = `Hi ${l.name.split(' ')[0]}, the Durrani Convertible Note pays ${mfull(c.m, l.cn.cur)} a month for ${c.n} months on ${mfull(l.cn.amount, l.cn.cur)}, with your principal returned at maturity.`;
  const foot = (
    <>
      <button className="btn" type="button" data-act="mclose" disabled={busy || undefined}>Cancel</button>
      <BusyBtn busy={busy} act={`cnshare|${l.id}`} label={<><Icon n="send" s={16} />Send {ch === 'Both' ? 'on both' : 'by ' + (ch === 'Email' ? 'email' : 'WhatsApp')}</>} busyLabel="Sending…" />
    </>
  );
  return (
    <Modal title="Share note details" sub={l.name} foot={foot}>
      <div className="card soft">
        <div className="ov">Preview</div>
        <div className="mt8">{msg}</div>
        <div className="xs faint mt8">Attachment: Convertible Note terms.pdf</div>
      </div>
      <Fld label="Send by" hint={chanHint(l, ch)}><ChanPick k="ch" /></Fld>
    </Modal>
  );
};
