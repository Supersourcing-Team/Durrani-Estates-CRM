/* Small pieces shared by the lead pop-ups (prototype helpers chanPick, tempPick, fillTpl and the inline error line). */
import React from 'react';
import { eng } from '../../engine';
import { Icon, mv } from '../../ui';

/** prototype: `<span class="err">${ic('alert',14)}${msg}</span>` written inline (not through fld) */
export function ErrLine({ e }: { e?: string }) {
  return e ? <span className="err"><Icon n="alert" s={14} />{e}</span> : null;
}

/** prototype: chanPick(k, opts): WhatsApp / Email / Both buttons that set UI.mf[k] */
export function ChanPick({ k, opts }: { k: string; opts?: [string, string][] }) {
  const list = opts || [['WhatsApp', 'msg'], ['Email', 'mail'], ['Both', 'send']];
  return (
    <div className="chanp">
      {list.map(([v, i]) => (
        <button key={v} type="button" className={'chanb ' + (mv(k) === v ? 'on' : '')} data-act={`mset|${k}|${v}`}>
          <Icon n={i} s={16} />{v === 'Both' ? 'WhatsApp and email' : v}
        </button>
      ))}
    </div>
  );
}

/** prototype: tempPick(cur, act, {lg}): hot / warm / cold radio buttons */
export function TempPick({ cur, act, lg }: { cur?: string; act: string; lg?: boolean }) {
  return (
    <div className={'tpick ' + (lg ? 'lg' : '')} role="radiogroup" aria-label="Lead temperature">
      {(eng.TEMPS as [string, string, string, string][]).map(([k, t, i, d]) => (
        <button key={k} type="button" role="radio" aria-checked={cur === k} className={'tp tp-' + k + ' ' + (cur === k ? 'on' : '')} data-act={act + k}>
          <Icon n={i} s={lg ? 18 : 16} /><span className="tp-t">{t}</span>{lg ? <span className="tp-d">{d}</span> : null}
        </button>
      ))}
    </div>
  );
}

/** prototype: fillTpl(text, values, true): template text with {placeholders} highlighted (missing ones marked) */
export function FillTpl({ txt, v }: { txt: string; v: Record<string, any> }) {
  const out: React.ReactNode[] = [];
  const re = /\{([a-z_]+)\}/g;
  let last = 0, m: RegExpExecArray | null;
  while ((m = re.exec(txt))) {
    out.push(txt.slice(last, m.index));
    const k = m[1];
    out.push(v[k] != null && v[k] !== ''
      ? <mark key={m.index} className="tv">{String(v[k])}</mark>
      : <mark key={m.index} className="tv miss">{m[0]}</mark>);
    last = m.index + m[0].length;
  }
  out.push(txt.slice(last));
  return <>{out}</>;
}

/** Modal form errors (prototype: UI.mf._e) */
export const errs = (): Record<string, string> => eng.UI.mf._e || {};
