/* AD-L3-24 Connect Meta / Google lead ads (prototype modal src-connect, steps in UI.mf.st). */
import React from 'react';
import { eng, renderOverlay } from '../../engine';
import { Bn, Fld, Icon, MSel, Modal } from '../../ui';
import type { ModalComp } from '../../app/types';
import { RouteFields } from './parts';
import { CRM_FIELDS, FORM_QUESTIONS, checkMapping } from './sourceMapping';

/** CRM-field picker for form question #i (stored in UI.mf.mp<i>); re-renders so the check updates live. */
const MapSel = ({ i, bad }: { i: number; bad: boolean }) => (
  <select className={'sel ' + (bad ? 'bad' : '')} id={'m_mp' + i} value={String(eng.UI.mf['mp' + i] || '')}
    onChange={(ev) => {
      eng.UI.mf['mp' + i] = ev.target.value;
      if (eng.UI.mf._e) { delete eng.UI.mf._e['mp' + i]; }
      renderOverlay();
    }}>
    <option value="">Choose a CRM field</option>
    {CRM_FIELDS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
  </select>
);

/** prototype: <input type="checkbox" data-act="srcform|name">; the srcform action toggles UI.mf.forms. */
const FormCheck = ({ name, on }: { name: string; on: boolean }) => (
  <input type="checkbox" data-act={'srcform|' + name} checked={on} readOnly />
);

/* AD-L3-24 Connect Meta / Google lead ads: 4-step wizard (UI.mf.st) */
export const SrcConnectModal: ModalComp = ({ args }) => {
  const k = args[0];
  const [t] = eng.SRCN[k];
  const f = eng.UI.mf, e = f._e || {};
  const st: number = f.st;
  const steps = ['Sign in', 'Choose forms', 'Map fields', 'Routing'];
  const g = k === 'google';
  const acc = g ? ['Durrani Estates · 482-119-3307', 'Durrani Estates India · 911-204-5521'] : ['Durrani Estates (Business Manager)'];
  const forms = g ? ['Palm Crest Launch · Search lead form', 'Palm Crest Launch · YouTube lead form', 'Brand search · Enquiry form']
    : ['Marina Views · Sept lead form', 'Creekside · Oct form', 'Palm Crest · Nov form'];
  const pick = String(f.forms || '').split('|').filter(Boolean);

  let body: React.ReactNode;
  if (st === 1) body = <>
    <p className="sm">You are sent to {g ? 'Google' : 'Facebook'} to approve read access to lead forms. The CRM never sees the password and cannot change ads or spend.</p>
    <button className="btn pri mt8" type="button" data-act="mset|st|2"><Icon n={g ? 'search' : 'msg'} s={16} />Continue with {g ? 'Google' : 'Facebook'}</button>
  </>;
  else if (st === 2) body = <>
    <Fld label="Ad account" htmlFor="m_acct" err={e.acct}><MSel k="acct" opts={acc} blank="Choose an account" bad={!!e.acct} /></Fld>
    <Fld label="Forms to sync" err={e.forms}>
      <div className="col g6">{forms.map((x) => <label key={x} className="row g6 sm"><FormCheck name={x} on={pick.includes(x)} /> {x}</label>)}</div>
    </Fld>
  </>;
  else if (st === 3) {
    const qs = FORM_QUESTIONS[k] || [];
    const chk = checkMapping(k, f);
    const shown = !!e.map; // errors are shown inline after a failed Next / Connect
    body = <>
      <div className="row sb">
        <p className="muted sm">We matched each form question to a CRM field. Change any that are wrong.</p>
        <button className="btn s" type="button" data-act={'srcmapreset|' + k}>Re-match</button>
      </div>
      {shown ? <Bn kind="err" title="Mapping needs a fix" body={e.map} /> : null}
      {qs.map((x, i) => (
        <Fld key={x.q} label={x.q} htmlFor={'m_mp' + i} hint={'Sample answer: ' + x.sample} err={e['mp' + i]}>
          <MapSel i={i} bad={!!e['mp' + i]} />
        </Fld>
      ))}
      <div className="card soft">
        <div className="h3 mb8">Mapping check</div>
        <div className="col g6">
          {chk.list.map((c) => (
            <div key={c.text} className={'row g6 sm ' + (c.ok ? 'oktx' : 'dangertx')}>
              <Icon n={c.ok ? 'check' : 'alert'} s={14} />{c.text}
            </div>
          ))}
        </div>
        <div className="muted sm mt8">{chk.mapped} mapped · {chk.skipped} not imported</div>
      </div>
    </>;
  }
  else body = <RouteFields projLabel="Project (optional)" projHint="Sets the project interest on each new lead." />;

  return (
    <Modal title={'Connect ' + t} drawer foot={<>
      <button className="btn" type="button" data-act={st > 1 ? 'mset|st|' + (st - 1) : 'mclose'}>{st > 1 ? 'Back' : 'Cancel'}</button>
      {st === 1 ? null : st < 4
        ? <button className="btn pri" type="button" data-act={'srcnext|' + k}>Next</button>
        : <button className="btn pri" type="button" data-act={'srcsave|' + k}>Connect</button>}
    </>}>
      <div className="stp h mb16">
        {steps.map((s, i) => (
          <div key={s} className={'stpi ' + (i + 1 < st ? 'done' : i + 1 === st ? 'cur' : '')}>
            <span className="dot2">{i + 1 < st ? <Icon n="check" s={12} /> : i + 1}</span><div className="bd">{s}</div>
          </div>
        ))}
      </div>
      {body}
    </Modal>
  );
};
