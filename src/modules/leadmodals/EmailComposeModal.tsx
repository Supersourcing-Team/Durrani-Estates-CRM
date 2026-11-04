/* A-L3-26 Send email from an Admin-approved template (Arabic templates render right-to-left). */
import React from 'react';
import { eng } from '../../engine';
import { Bn, Fld, Icon, MSel, Modal } from '../../ui';
import type { ModalComp } from '../../app/types';
import { FillTpl, errs } from './parts';

export const EmailComposeModal: ModalComp = ({ args: a }) => {
  const S = eng.S, f = eng.UI.mf, e = errs();
  const l = eng.leadById(a[0]);
  const u = eng.me();
  const t = f.tpl ? eng.tplById(f.tpl) : null;
  const list: any[] = S.tpls.filter((x: any) => x.active);
  const close = <button className="btn" type="button" data-act="mclose">Close</button>;

  if (l.dnd || eng.isDnd(l.phone)) {
    return <Modal title="Email blocked" foot={close}><Bn kind="err" title="This client is on the Do Not Call list" body="No calls, messages or emails can be sent to them." /></Modal>;
  }
  if (!l.email) {
    return <Modal title="No email address" foot={close}><Bn kind="warn" title="This lead has no email address" body="Ask the client for their email and add it to the lead first." /></Modal>;
  }

  const v = eng.tplVals(l, { p: f.p, m: f.m });
  const needP = t && t.needs.includes('project');
  const missing: string[] = t ? (t.subject + t.body).match(/\{([a-z_]+)\}/g) || [] : [];
  const miss = missing.map((x) => x.slice(1, -1)).filter((k) => v[k] == null || v[k] === '');
  const ar = t && t.lang === 'ar' ? 'rtl' : undefined;
  const TPLCAT = eng.TPLCAT as Record<string, string>;

  const picker = (
    <div className="tplgrid">
      {Object.keys(TPLCAT).map((c) => list.filter((x) => x.cat === c).map((x) => (
        <button key={x.id} type="button" className={'tplb ' + (f.tpl === x.id ? 'on' : '')} data-act={`mset|tpl|${x.id}`}>
          <span className="tb-c">{TPLCAT[c]}{x.lang === 'ar' ? ' · Arabic' : ''}</span><span className="tb-n">{x.name}</span>
        </button>
      )))}
    </div>
  );

  const prev = t ? (
    <div className="mailprev">
      <div className="mp-h">
        <div className="mp-r"><span>From</span><b>{u.name}</b> <span className="faint">&lt;{u.email || 'agent@durraniestates.com'}&gt;</span></div>
        <div className="mp-r"><span>To</span><b>{l.name}</b> <span className="faint">&lt;{l.email}&gt;</span></div>
        <div className="mp-r"><span>Subject</span><b dir={ar}><FillTpl txt={t.subject} v={v} /></b></div>
      </div>
      <div className="mp-b" dir={ar}><FillTpl txt={t.body} v={v} /></div>
      {t.attach ? <div className="mp-a"><Icon n="clip" s={14} />{t.attach}{v.project ? ' · ' + v.project : ''}.pdf</div> : null}
    </div>
  ) : (
    <div className="pv" style={{ minHeight: 150 }}><Icon n="mail" s={24} /><b>Choose a template</b><span>The email preview appears here.</span></div>
  );

  const missLabel = (k: string) => ((eng.TPLVARS as [string, string][]).find((x) => x[0] === k) || [k, k])[1];

  return (
    <Modal title="Send email" sub={l.name + ' · ' + l.email} size="w"
      foot={<>
        <span className="clsum">Sent from the CRM and logged on the lead</span>
        <button className="btn" type="button" data-act="mclose">Cancel</button>
        <button className="btn pri" type="button" data-act={`emailsend|${l.id}`} disabled={t && !miss.length ? undefined : true}><Icon n="send" s={16} />Send email</button>
      </>}>
      <Fld label="Template" err={e.tpl} hint="Templates are written and approved by Admin, so every client gets the same quality. The text cannot be edited here.">{picker}</Fld>
      {needP ? (
        <Fld label="Project" htmlFor="m_p" err={e.p}>
          <MSel k="p" opts={S.projects.filter((x: any) => x.active).map((x: any) => [x.id, x.name] as [string, string])} bad={!!e.p} blank="Choose a project" />
        </Fld>
      ) : null}
      {prev}
      {miss.length && t ? (
        <Bn kind="warn" title="Some details are missing" body={miss.map(missLabel).join(', ') + (needP ? '. Choose a project above.' : '. This template does not fit this lead yet.')} />
      ) : null}
    </Modal>
  );
};
