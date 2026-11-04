/* Small view helpers shared by the convertible-note and secondary-market screens. */
import React from 'react';
import { eng, ft, bump } from '../../engine';
import { Chip, Icon, LeadLinks, mv, pv } from '../../ui';

/** prototype: histList(arr). A vertical history timeline of [text, userId, time] rows. */
export function HistList({ arr }: { arr: any[] }) {
  return (
    <div className="tl">
      {arr.map((h, i) => (
        <div className="tli" key={i}>
          <div className="ico stage"><Icon n="check" s={14} /></div>
          <div><div className="tt"><LeadLinks text={h[0]} /></div><div className="tm">{eng.uname(h[1])} · {ft(h[2])}</div></div>
        </div>
      ))}
    </div>
  );
}

/** prototype: amtHelp(amt, cur). Amount in words plus quick-pick pills under the amount field. */
export function AmtHelp({ amt, cur }: { amt: number; cur: string }) {
  const q: [number, string][] = cur === 'INR'
    ? [[1000000, '10 L'], [2500000, '25 L'], [5000000, '50 L'], [10000000, '1 Cr']]
    : [[500000, '500K'], [1000000, '1M'], [2500000, '2.5M'], [5000000, '5M']];
  return (
    <div className="numhelp">
      <span className="muted sm">{amt ? cur + ' ' + eng.words(amt, cur) : 'Type the amount in numbers. Commas are added for you.'}</span>
      <div className="row g6 wrap">
        {q.map(([v, t]) => <button key={v} type="button" className={'pill ' + (+amt === v ? 'on' : '')} data-act={`pfset|amt|${v}`}>{t}</button>)}
        {amt ? <button type="button" className="pill" data-act="pfset|amt|">Clear</button> : null}
      </div>
    </div>
  );
}

/** prototype: pinp(k, {d, dis: true}). A read-only page field showing a fixed value. */
export function PfFixed({ k, d }: { k: string; d: string }) {
  return <input className="inp " id={'p_' + k} type="text" value={String(pv(k, d))} placeholder="" disabled
    onChange={(e) => { eng.UI.pf[k] = e.target.value; bump(); }} />;
}

/** prototype: chanPick(k). Channel picker (WhatsApp, Email, both) bound to UI.mf[k]. */
export function ChanPick({ k }: { k: string }) {
  const opts: [string, string][] = [['WhatsApp', 'msg'], ['Email', 'mail'], ['Both', 'send']];
  return (
    <div className="chanp">
      {opts.map(([v, i]) => (
        <button key={v} type="button" className={'chanb ' + (mv(k) === v ? 'on' : '')} data-act={`mset|${k}|${v}`}>
          <Icon n={i} s={16} />{v === 'Both' ? 'WhatsApp and email' : v}
        </button>
      ))}
    </div>
  );
}

/** prototype: cnDocLine(cn, k). Status line under a note document slot. */
export function CnDocLine({ cn, k }: { cn: any; k: string }) {
  const s = eng.cnDS(cn, k);
  const d = cn.dv && cn.dv[k];
  if (s === 'missing') return <>Not received</>;
  if (s === 'pending') return <>Received · waiting for verification</>;
  if (s === 'verified') return <>Verified by {eng.uname(d.by)}</>;
  return <span className="dangertx">Rejected: {d.why || ''}</span>;
}

/** Hint under a channel picker: who the message goes to. */
export const chanHint = (l: any, ch: string) =>
  ch === 'Email' ? 'To ' + l.email : ch === 'WhatsApp' ? 'To ' + l.phone : 'To ' + l.phone + ' and ' + l.email;

/** Role of a screen registered for several apps (agent / mgmt / admin). */
export type Role = 'agent' | 'mgmt' | 'admin';

/** Registers one screen component under a role-prefixed route key, passing the role as a prop. */
export function withRole<P extends { params: string[]; role?: Role }>(C: React.FC<P>, role: Role): React.FC<{ params: string[] }> {
  const W: React.FC<{ params: string[] }> = (p) => <C {...(p as P)} role={role} />;
  W.displayName = (C.displayName || C.name) + ':' + role;
  return W;
}

const NEXT_MA: Record<string, string> = {
  Qualified: 'Agent shares terms', 'Information shared': 'Client confirms', Interested: 'Agent collects documents',
  Documents: 'Agent uploads, you can check',
};

/** prototype: cnAppRows(leads, role). Note applications table for managers and Admin. */
export function CnAppRows({ ls, role }: { ls: any[]; role: Role }) {
  const CNDOCS: [string, string][] = eng.CNDOCS;
  return (
    <div className="tw"><table className="tbl">
      <thead><tr><th>Client</th><th>Agent</th><th>Stage</th><th className="num">Amount</th><th>Documents</th><th>Next step</th></tr></thead>
      <tbody>
        {ls.map((l) => {
          const v = CNDOCS.filter(([k]) => eng.cnDS(l.cn, k) === 'verified').length, r = CNDOCS.filter(([k]) => l.cn[k]).length;
          const go = role + '-cnapp-' + l.id;
          const nx = l.cn.stage === 'Admin review' ? (role === 'admin' ? <b>Your decision</b> : 'Admin decides') : NEXT_MA[l.cn.stage] || '';
          return (
            <tr key={l.id} className="click" data-go={go}>
              <td><a className="b" href={'#' + go} data-go={go}>{l.name}</a><div className="xs faint"><LeadLinks text={'LEAD-' + l.id} /></div></td>
              <td className="sm">{eng.uname(l.owner)}</td>
              <td><Chip t={l.cn.stage} cls={l.cn.stage === 'Admin review' ? 's5' : 's4'} /></td>
              <td className="num">{eng.mfull(l.cn.amount, l.cn.cur)}</td>
              <td className="sm">{r} received · {v} verified</td>
              <td className="sm">{nx}</td>
            </tr>
          );
        })}
      </tbody>
    </table></div>
  );
}
