/*
 * Form controls. Values live in engine UI state, exactly where the prototype kept them:
 *   modal fields      -> UI.mf[key]   (prototype: minp / mtxa / msel / mopt, attribute data-m)
 *   page fields       -> UI.pf[key]   (prototype: attribute data-pf)
 *   list filters      -> UI.f[key]    (prototype: sel / search, attribute data-bind; also resets paging)
 * Controls are controlled React inputs: each change writes the value and re-renders.
 */
import React from 'react';
import { eng, bump } from '../engine';
import { Icon, type Node } from './core';

type Opt = string | [string | number, Node];
const optV = (x: Opt) => (Array.isArray(x) ? x[0] : x);
const optL = (x: Opt) => (Array.isArray(x) ? x[1] : x);

/** prototype: mv(k): the current modal field value as a string-friendly value */
export const mv = (k: string): any => (eng.UI.mf[k] == null ? '' : eng.UI.mf[k]);
const setMf = (k: string, v: any) => { eng.UI.mf[k] = v; bump(); };
/** prototype: pfv-style read of a page field */
export const pv = (k: string, d: any = ''): any => (eng.UI.pf[k] == null ? d : eng.UI.pf[k]);
const setPf = (k: string, v: any) => { eng.UI.pf[k] = v; bump(); };
const setF = (k: string, v: any) => { eng.UI.f[k] = v; eng.UI.pg = {}; bump(); };

/** prototype: fld(label, inner, {cls, for, req, hint, err}) */
export function Fld({ label, children, cls, htmlFor, req, hint, err }:
  { label: Node; children: Node; cls?: string; htmlFor?: string; req?: boolean; hint?: Node; err?: Node }) {
  return (
    <div className={'fld ' + (cls || '')}>
      <label htmlFor={htmlFor}>{label}{req ? <> <span className="dangertx">*</span></> : null}</label>
      {children}
      {hint ? <span className="hint">{hint}</span> : null}
      {err ? <span className="err"><Icon n="alert" s={14} />{err}</span> : null}
    </div>
  );
}

/* ---------- modal fields (UI.mf) ---------- */
/** prototype: minp(k, {type, ph, min, bad, dis}) */
export function MInput({ k, type = 'text', ph, min, max, step, bad, dis, autoFocus, cls, style }:
  { k: string; type?: string; ph?: string; min?: number | string; max?: number | string; step?: number | string; bad?: boolean; dis?: boolean; autoFocus?: boolean; cls?: string; style?: React.CSSProperties }) {
  return <input className={'inp ' + (bad ? 'bad ' : '') + (cls || '')} id={'m_' + k} type={type} value={mv(k)} placeholder={ph || ''}
    min={min} max={max} step={step} disabled={dis || undefined} autoFocus={autoFocus} style={style}
    onChange={(e) => setMf(k, e.target.value)} />;
}
/** prototype: mtxa(k, {ph, bad}) */
export function MTxa({ k, ph, bad, rows, style }: { k: string; ph?: string; bad?: boolean; rows?: number; style?: React.CSSProperties }) {
  return <textarea className={'txa ' + (bad ? 'bad' : '')} id={'m_' + k} placeholder={ph || ''} value={mv(k)} rows={rows} style={style}
    onChange={(e) => setMf(k, e.target.value)} />;
}
/** prototype: msel(k, opts, {blank, bad, rr}) */
export function MSel({ k, opts, blank, bad, dis, style }: { k: string; opts: Opt[]; blank?: string | false; bad?: boolean; dis?: boolean; style?: React.CSSProperties }) {
  return (
    <select className={'sel ' + (bad ? 'bad' : '')} id={'m_' + k} value={String(mv(k))} disabled={dis || undefined} style={style}
      onChange={(e) => setMf(k, e.target.value)}>
      {blank !== false ? <option value="">{blank || 'Select'}</option> : null}
      {opts.map((x) => <option key={String(optV(x))} value={String(optV(x))}>{optL(x)}</option>)}
    </select>
  );
}
/** Checkbox bound to UI.mf[k] (prototype: <input type="checkbox" data-m="k">) */
export function MCheck({ k, id }: { k: string; id?: string }) {
  return <input type="checkbox" id={id || 'm_' + k} checked={!!eng.UI.mf[k]} onChange={(e) => setMf(k, e.target.checked)} />;
}
/** prototype: mopt(k, v, title, desc, {dg}): a selectable option card that sets UI.mf[k] = v */
export function MOpt({ k, v, t, d, dg }: { k: string; v: string | number; t: Node; d?: Node; dg?: boolean }) {
  const on = String(mv(k)) === String(v);
  return (
    <button type="button" className={'opt ' + (on ? 'on' : '') + ' ' + (dg ? 'dg' : '')} data-act={`mset|${k}|${v}`}>
      <span><span className="t">{t}</span>{d ? <span className="d" style={{ display: 'block' }}>{d}</span> : null}</span>
    </button>
  );
}

/* ---------- page fields (UI.pf) ---------- */
export function PfInput({ k, type = 'text', ph, bad, id, cls, d, min, style }:
  { k: string; type?: string; ph?: string; bad?: boolean; id?: string; cls?: string; d?: any; min?: number | string; style?: React.CSSProperties }) {
  return <input className={'inp ' + (bad ? 'bad ' : '') + (cls || '')} id={id || 'p_' + k} type={type} value={pv(k, d ?? '')} placeholder={ph || ''} min={min} style={style}
    onChange={(e) => setPf(k, e.target.value)} />;
}
export function PfTxa({ k, ph, bad, id }: { k: string; ph?: string; bad?: boolean; id?: string }) {
  return <textarea className={'txa ' + (bad ? 'bad' : '')} id={id || 'p_' + k} placeholder={ph || ''} value={pv(k)} onChange={(e) => setPf(k, e.target.value)} />;
}
export function PfSel({ k, opts, d, bad, id, blank, cls, style }: { k: string; opts: Opt[]; d?: any; bad?: boolean; id?: string; blank?: string; cls?: string; style?: React.CSSProperties }) {
  return (
    <select className={'sel ' + (bad ? 'bad ' : '') + (cls || '')} id={id || 'p_' + k} value={String(pv(k, d ?? ''))} style={style} onChange={(e) => setPf(k, e.target.value)}>
      {blank != null ? <option value="">{blank}</option> : null}
      {opts.map((x) => <option key={String(optV(x))} value={String(optV(x))}>{optL(x)}</option>)}
    </select>
  );
}
export function PfCheck({ k, id }: { k: string; id?: string }) {
  return <input type="checkbox" id={id || 'p_' + k} checked={!!eng.UI.pf[k]} onChange={(e) => setPf(k, e.target.checked)} />;
}

/* ---------- list filters (UI.f) ---------- */
/** prototype: sel(bindKey, cur, opts, cls) */
export function Sel({ bind, cur, opts, cls, ariaLabel }: { bind: string; cur: any; opts: Opt[]; cls?: string; ariaLabel?: string }) {
  return (
    <select className={'sel ' + (cls || '')} value={String(cur)} aria-label={ariaLabel} onChange={(e) => setF(bind, e.target.value)}>
      {opts.map((x) => <option key={String(optV(x))} value={String(optV(x))}>{optL(x)}</option>)}
    </select>
  );
}
/** prototype: search(bindKey, val, placeholder) */
export function Search({ bind, val, ph }: { bind: string; val?: string; ph?: string }) {
  return (
    <div className="inw">
      <Icon n="search" s={16} />
      <input className="inp" id={'s_' + bind} value={val || ''} placeholder={ph || 'Search'} aria-label={ph || 'Search'}
        onChange={(e) => setF(bind, e.target.value)} />
    </div>
  );
}

/** prototype: toggle(on, act): a switch that runs an action */
export function Toggle({ on, act }: { on: boolean; act: string }) {
  return <button type="button" className={'sw ' + (on ? 'on' : '')} role="switch" aria-checked={!!on} data-act={act} />;
}

/**
 * prototype: numInp(k, default, currency, bad). Amount field with live thousands separators.
 * Stores the raw digits in UI.pf[k] and keeps the caret after the same digit while typing.
 */
export function NumInput({ k, d, cur = 'AED', bad }: { k: string; d?: any; cur?: string; bad?: boolean }) {
  const ref = React.useRef<HTMLInputElement>(null);
  const caret = React.useRef<number | null>(null);
  const raw = String(pv(k, d ?? '') || '').replace(/[^\d]/g, '');
  const shown = eng.fmtNum(raw, cur);
  React.useLayoutEffect(() => {
    const n = ref.current; const before = caret.current;
    if (!n || before == null) return;
    caret.current = null;
    let c = 0, i = 0; const v = n.value;
    while (i < v.length && c < before) { if (/\d/.test(v[i])) c++; i++; }
    try { n.setSelectionRange(i, i); } catch (_) { /* ignore */ }
  });
  return (
    <div className="numw">
      <span className="numcur">{cur}</span>
      <input ref={ref} className={'inp ' + (bad ? 'bad' : '')} id={'p_' + k} type="text" inputMode="numeric" autoComplete="off"
        value={shown} placeholder={cur === 'INR' ? '25,00,000' : '2,500,000'} aria-label={'Amount in ' + cur}
        onChange={(e) => {
          const t = e.target;
          const pos = t.selectionStart == null ? t.value.length : t.selectionStart;
          caret.current = t.value.slice(0, pos).replace(/[^\d]/g, '').length;
          const next = t.value.replace(/[^\d]/g, '').replace(/^0+(?=\d)/, '').slice(0, 12);
          eng.UI.pf[k] = next;
          if (eng.UI.pf._e) delete eng.UI.pf._e[k];
          bump();
        }} />
    </div>
  );
}
