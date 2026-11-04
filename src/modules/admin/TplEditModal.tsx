/* AD-L3-22 Email template editor with live preview (prototype modal tpl-edit; English and Arabic templates). */
import React from 'react';
import { eng } from '../../engine';
import { Fld, Icon, MInput, MSel, MTxa, Modal } from '../../ui';
import type { ModalComp } from '../../app/types';
import { TplFill } from './parts';

export const TplEditModal: ModalComp = ({ args }) => {
  const f = eng.UI.mf, e = f._e || {};
  const vars: [string, string, string][] = eng.TPLVARS;
  const sample: Record<string, string> = Object.fromEntries(vars.map((x) => [x[0], x[2]]));
  const used: string[] = ((f.subject || '') + (f.body || '')).match(/\{([a-z_]+)\}/g) || [];
  const bad = used.map((x) => x.slice(1, -1)).filter((k) => !sample[k]);
  const rtl = f.lang === 'ar' ? 'rtl' : undefined;
  const bodyErr = e.body || (bad.length ? 'Unknown fields: ' + bad.map((x) => '{' + x + '}').join(', ') : '');

  return (
    <Modal title={args[0] ? 'Edit template' : 'New template'} size="xw" foot={<>
      <button className="btn" type="button" data-act="mclose">Cancel</button>
      <button className="btn pri" type="button" data-act={'tplsave|' + (args[0] || '')}>Save template</button>
    </>}>
      <div className="tpled">
        <div className="col g16">
          <div className="frm">
            <Fld label="Name" htmlFor="m_name" err={e.name}><MInput k="name" bad={!!e.name} ph="Project details" /></Fld>
            <Fld label="Category" htmlFor="m_cat"><MSel k="cat" opts={Object.entries(eng.TPLCAT) as [string, string][]} blank={false} /></Fld>
            <Fld label="Language" htmlFor="m_lang"><MSel k="lang" opts={[['en', 'English'], ['ar', 'Arabic']]} blank={false} /></Fld>
            <Fld label="Attachment" htmlFor="m_attach"><MSel k="attach" opts={[['', 'None'], 'Project brochure', 'Price list', 'Convertible Note terms']} blank={false} /></Fld>
          </div>
          <Fld label="Subject" htmlFor="m_subject" err={e.subject}><MInput k="subject" bad={!!e.subject} ph="{project} in {area}" /></Fld>
          <Fld label="Body" htmlFor="m_body" err={bodyErr} hint="Tap a field to add it at the end. The CRM fills these in for each client."><MTxa k="body" bad={!!e.body} /></Fld>
          {/* Field chips: the tplvar action inserts {field} at the caret of #m_body */}
          <div className="row g6 wrap">
            {vars.map(([k, t]) => <button key={k} type="button" className="pill sm" data-act={'tplvar|' + k} title={t}>{'{' + k + '}'}</button>)}
          </div>
        </div>
        <div className="col g6">
          <div className="lbl">Preview with sample data</div>
          <div className="mailprev">
            <div className="mp-h"><div className="mp-r"><span>Subject</span><b dir={rtl}><TplFill txt={f.subject || ''} v={sample} /></b></div></div>
            <div className="mp-b" dir={rtl}><TplFill txt={f.body || ''} v={sample} /></div>
            {f.attach ? <div className="mp-a"><Icon n="clip" s={14} />{f.attach}.pdf</div> : null}
          </div>
          <button type="button" className="btn s" data-act="rr"><Icon n="refresh" s={14} />Refresh preview</button>
        </div>
      </div>
    </Modal>
  );
};
