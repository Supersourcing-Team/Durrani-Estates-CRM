/* A-L3-09 Share project details (WhatsApp / email, English / Arabic preview). */
import React from 'react';
import { eng, money } from '../../engine';
import { Fld, Icon, MSel, Modal } from '../../ui';
import type { ModalComp } from '../../app/types';
import { ChanPick, errs } from './parts';

export const ShareModal: ModalComp = ({ args: a }) => {
  const S = eng.S, f = eng.UI.mf, e = errs();
  const l = eng.leadById(a[0]);
  const p = f.p ? eng.projById(f.p) : null;
  const first = l.name.split(' ')[0];
  const ar = f.lang === 'ar';
  const txt = !p ? '' : ar
    ? `مرحباً ${first}، يسعدنا مشاركة تفاصيل ${p.name} في ${p.area}. الأسعار من ${money(p.from)} إلى ${money(p.to)}. خطة الدفع: ${p.plan}. التسليم: ${p.ho}. هل يناسبك موعد للحديث؟ ${eng.me().name}، دوراني العقارية`
    : `Hi ${first}, here are the details for ${p.name} in ${p.area}. Prices from ${money(p.from)} to ${money(p.to)}. Payment plan: ${p.plan}. Handover: ${p.ho}. Would a quick call work? ${eng.me().name}, Durrani Estates`;
  const ch = f.ch;
  return (
    <Modal title="Share project details" sub={l.name}
      foot={<>
        <button className="btn" type="button" data-act="mclose">Cancel</button>
        <button className="btn pri" type="button" data-act={`sharesave|${l.id}`}><Icon n="send" s={16} />Send {ch === 'Both' ? 'on both' : 'by ' + (ch === 'Email' ? 'email' : 'WhatsApp')}</button>
      </>}>
      <Fld label="Project" htmlFor="m_p" err={e.p}>
        <MSel k="p" opts={S.projects.filter((x: any) => x.active).map((x: any) => [x.id, x.name] as [string, string])} bad={!!e.p} blank="Choose a project" />
      </Fld>
      <Fld label="Send by" hint={ch === 'WhatsApp' ? 'To ' + l.phone : ch === 'Email' ? 'To ' + l.email : 'To ' + l.phone + ' and ' + l.email}>
        <ChanPick k="ch" />
      </Fld>
      <div className="frm">
        <Fld label="Language" htmlFor="m_lang" hint={l.arabic ? 'This client speaks Arabic.' : ''}>
          <MSel k="lang" opts={[['en', 'English'], ['ar', 'Arabic']]} blank={false} />
        </Fld>
      </div>
      {p ? (
        <div className="card soft">
          <div className="ov">Preview</div>
          <div className="mt8" dir={ar ? 'rtl' : undefined} style={{ whiteSpace: 'pre-wrap' }}>{txt}</div>
          <div className="xs faint mt8">Attachment: {p.name} brochure.pdf</div>
        </div>
      ) : null}
    </Modal>
  );
};
