/* AD-L3-24 Connect Meta / Google lead ads (prototype modal src-connect, steps in UI.mf.st). */
import React from 'react';
import { eng } from '../../engine';
import { Dl, Fld, Icon, MSel, Modal } from '../../ui';
import type { ModalComp } from '../../app/types';
import { RouteFields } from './parts';

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
  else if (st === 3) body = <>
    <p className="muted sm">We matched the form questions to CRM fields. Change any that are wrong.</p>
    <Dl items={[['Full name', 'Name'], ['Phone number', 'Phone'], ['Email', 'Email'], ['City', 'City'], ['Custom: budget', 'Budget']]} />
  </>;
  else body = <RouteFields projLabel="Project (optional)" projHint="Sets the project interest on each new lead." />;

  return (
    <Modal title={'Connect ' + t} size="w" foot={<>
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
