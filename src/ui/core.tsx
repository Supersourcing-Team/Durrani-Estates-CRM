/*
 * UI primitives. Each one matches a helper in the prototype (btn, chip, kpi, card ...), with the same
 * markup and class names, so the shared stylesheet (src/styles/app.css) applies unchanged.
 *
 * Clicks use the prototype's command attributes, handled once in src/app/events.ts:
 *   act="dial|1023"   runs actions().dial(['1023'])
 *   open="call-log|1023" opens the call-log modal with args ['1023']
 *   go="agent-lead-1023" navigates to #agent-lead-1023
 */
import React from 'react';
import { IC, AVC, avHash, ini, nf, eng, bump } from '../engine';

export type Node = React.ReactNode;

/* ---------- command attributes ---------- */
export interface Cmd { go?: string; open?: string; act?: string }
export const cmd = (o: Cmd): Record<string, string> => {
  const a: Record<string, string> = {};
  if (o.go != null) a['data-go'] = o.go;
  if (o.open != null) a['data-open'] = o.open;
  if (o.act != null) a['data-act'] = o.act;
  return a;
};

/* ---------- icons ---------- */
export function Icon({ n, s = 16, className }: { n: string; s?: number; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={s} height={s} fill="none" stroke="currentColor" strokeWidth={2}
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}
      dangerouslySetInnerHTML={{ __html: (IC as Record<string, string>)[n] || '' }} />
  );
}

/** Renders an HTML string that comes from engine data (flash prompts, notification text). */
export function Html({ html, as = 'span', className, style }: { html: string; as?: keyof JSX.IntrinsicElements; className?: string; style?: React.CSSProperties }) {
  const Tag = as as any;
  return <Tag className={className} style={style} dangerouslySetInnerHTML={{ __html: html || '' }} />;
}

/* ---------- buttons and links ---------- */
export interface BtnProps extends Cmd {
  t?: Node; children?: Node; cls?: string; ic?: string; is?: number; id?: string; title?: string;
  lbl?: string; dis?: boolean; on?: boolean; style?: React.CSSProperties; ariaLabel?: string;
}
/** prototype: btn({t, cls, go, open, act, ic, is, id, title, lbl, dis, on}) */
export function Btn(o: BtnProps) {
  const common = {
    className: 'btn ' + (o.cls || ''),
    ...cmd(o),
    id: o.id,
    title: o.title,
    'data-lbl': o.lbl,
    'aria-current': o.on ? ('true' as const) : undefined,
    'aria-label': o.ariaLabel,
    style: o.style,
  };
  const inner = <>{o.ic ? <Icon n={o.ic} s={o.is || 16} /> : null}{o.t}{o.children}</>;
  if (o.go != null) return <a href={'#' + o.go} {...common}>{inner}</a>;
  return <button type="button" {...common} disabled={o.dis || undefined}>{inner}</button>;
}

/** prototype: lnk(t, go, cls) */
export function Lnk({ go, cls, children, style }: { go: string; cls?: string; children: Node; style?: React.CSSProperties }) {
  return <a href={'#' + go} data-go={go} className={cls || ''} style={style}>{children}</a>;
}

/* ---------- chips, tags, avatars ---------- */
/** prototype: chip(t, cls, dot) */
export function Chip({ t, cls, dot, children }: { t?: Node; cls?: string; dot?: boolean; children?: Node }) {
  return <span className={'chip ' + (cls || 's2')}>{dot === false ? null : <i />}{t}{children}</span>;
}
/** prototype: tag(t, cls) */
export function Tag({ t, cls }: { t: Node; cls?: string }) {
  return <span className={'tag ' + (cls || '')}>{t}</span>;
}
/** prototype: av(name, cls). Background colour comes from the name. */
export function Av({ n, cls, style }: { n: string; cls?: string; style?: React.CSSProperties }) {
  return <span className={'av ' + (cls || '')} style={{ background: AVC[avHash(n) % AVC.length], ...style }}>{ini(n)}</span>;
}
/**
 * An avatar circle written without a colour, e.g. `<span class="av">${esc(ini(name))}</span>`.
 * The prototype painted these after render from their text (paintAv); pass that text as `t`.
 * Icon-only avatars (`<span class="av sm">${ic('bell')}</span>`) pass the icon as children and no `t`.
 */
export function AvBox({ cls, t, children, style }: { cls?: string; t?: string; children?: Node; style?: React.CSSProperties }) {
  const paint = t != null && /^[A-Z?]{1,3}$/.test(t) ? AVC[avHash(t + t.length) % AVC.length] : undefined;
  return <span className={'av ' + (cls || '')} style={paint ? { background: paint, ...style } : style}>{t}{children}</span>;
}

/* ---------- banners, empty states, KPI tiles, cards ---------- */
/** prototype: bn(kind, title, body, acts) */
export function Bn({ kind, title, body, acts, className }: { kind: string; title?: Node; body?: Node; acts?: Node; className?: string }) {
  const icn = kind === 'ok' ? 'check' : kind === 'info' ? 'info' : 'alert';
  return (
    <div className={'bn ' + kind + (className ? ' ' + className : '')}>
      <span><Icon n={icn} s={18} /></span>
      <div>{title ? <div className="t">{title}</div> : null}{body ? <div>{body}</div> : null}</div>
      {acts ? <div className="acts">{acts}</div> : null}
    </div>
  );
}
/** prototype: empty(icon, title, description, action) */
export function Empty({ icn, t, d, act }: { icn: string; t: Node; d?: Node; act?: Node }) {
  return (
    <div className="empty">
      <div className="ei"><Icon n={icn} s={22} /></div>
      <div className="et">{t}</div>
      <div style={{ maxWidth: 380 }}>{d || ''}</div>
      {act || null}
    </div>
  );
}
/** prototype: kpi(label, number, detail, {cls, dcls, go, open, act}) */
export function Kpi({ l, n, d, dcls, cls, go, open, act }: { l: Node; n: Node; d?: Node; dcls?: string; cls?: string } & Cmd) {
  const inner = <><span className="l">{l}</span><span className="n">{n}</span>{d ? <span className={'d ' + (dcls || '')}>{d}</span> : null}</>;
  const className = 'kpi ' + (cls || '');
  if (go != null) return <a className={className} href={'#' + go} data-go={go}>{inner}</a>;
  if (open != null || act != null) return <button type="button" className={className} {...cmd({ open, act })}>{inner}</button>;
  return <div className={className}>{inner}</div>;
}
/** prototype: card(title, body, {cls, right, bare}) */
export function Card({ title, right, cls, bare, children }: { title?: Node; right?: Node; cls?: string; bare?: boolean; children?: Node }) {
  return (
    <section className={'card flat ' + (cls || '')}>
      {title || right ? <div className="ch"><h2 className="h2">{title || ''}</h2>{right ? <div className="row g6 wrap">{right}</div> : null}</div> : null}
      <div className={bare ? '' : 'cb'}>{children}</div>
    </section>
  );
}
/** prototype: kvs([[k, v], ...]) */
export function Kvs({ items }: { items: [Node, Node][] }) {
  return <div className="kv">{items.map(([k, v], i) => <div className="kvi" key={i}><span className="k">{k}</span><span className="v">{v}</span></div>)}</div>;
}
/** prototype: dl([[k, v], ...]) */
export function Dl({ items }: { items: [Node, Node][] }) {
  return <div className="dl">{items.map(([k, v], i) => <div key={i}><span className="k">{k}</span><span style={{ textAlign: 'right' }}>{v}</span></div>)}</div>;
}
/** prototype: bar(percent, cls) */
export function Bar({ p, cls }: { p: number; cls?: string }) {
  return <div className={'bar ' + (cls || '')}><i style={{ width: Math.max(0, Math.min(100, p)) + '%' }} /></div>;
}
/** prototype: pghead(title, sub, right) */
export function PgHead({ t, sub, right }: { t: Node; sub?: Node; right?: Node }) {
  return (
    <div className="pghead">
      <div><h1 className="h1">{t}</h1>{sub ? <p className="sub">{sub}</p> : null}</div>
      <div className="row g6 wrap">{right || null}</div>
    </div>
  );
}
export interface TabItem { k: string; go: string; l: Node; i?: string; n?: Node }
/** prototype: tabs(items, cur) */
export function Tabs({ items, cur }: { items: TabItem[]; cur: string }) {
  return (
    <nav className="tabs" aria-label="Sections">
      {items.map((t) => (
        <a key={t.k} className={'tab ' + (t.k === cur ? 'on' : '')} href={'#' + t.go} data-go={t.go}>
          {t.i ? <Icon n={t.i} s={16} /> : null}{t.l}{t.n != null ? <span className="cnt">{t.n}</span> : null}
        </a>
      ))}
    </nav>
  );
}

/* ---------- pagination ---------- */
/** prototype: pager(total, per, pageKey, cur) */
export function Pager({ total, per, pageKey, cur }: { total: number; per: number; pageKey: string; cur: number }) {
  const pages = Math.max(1, Math.ceil(total / per));
  cur = Math.min(cur || 1, pages);
  const from = total ? (cur - 1) * per + 1 : 0, to = Math.min(total, cur * per);
  const nums: (number | '…')[] = [];
  for (let i = 1; i <= pages; i++) {
    if (i === 1 || i === pages || Math.abs(i - cur) <= 1) nums.push(i);
    else if (nums[nums.length - 1] !== '…') nums.push('…');
  }
  return (
    <div className="pg">
      <span className="muted sm">Showing {from}-{to} of {nf(total)}</span>
      <div className="pgb">
        <button type="button" data-act={`page|${pageKey}|${cur - 1}`} aria-label="Previous page" disabled={cur <= 1 || undefined}><Icon n="back" s={14} /></button>
        {nums.map((n, i) => n === '…'
          ? <span className="faint" key={'e' + i}>…</span>
          : <button type="button" key={n} className={n === cur ? 'on' : ''} data-act={`page|${pageKey}|${n}`}>{n}</button>)}
        <button type="button" data-act={`page|${pageKey}|${cur + 1}`} aria-label="Next page" disabled={cur >= pages || undefined}><Icon n="chev" s={14} /></button>
      </div>
    </div>
  );
}
/** prototype: paged(arr, key, per) -> { items, html }. Here `foot` is the pager or record count. */
export function paged<T>(arr: T[], key: string, per: number): { items: T[]; foot: Node } {
  const UI = eng.UI;
  const cur = Math.min(UI.pg[key] || 1, Math.max(1, Math.ceil(arr.length / per)));
  return {
    items: arr.slice((cur - 1) * per, cur * per),
    foot: arr.length > per
      ? <Pager total={arr.length} per={per} pageKey={key} cur={cur} />
      : <div className="pg"><span className="muted sm">{arr.length} {arr.length === 1 ? 'record' : 'records'}</span></div>,
  };
}

export { bump };

/* ---------- table cells ---------- */
/** True when a cell's text is short enough to keep on one line (prototype labelTables: 20 characters or fewer). */
export const isShort = (text: unknown): boolean => String(text ?? '').trim().length <= 20;
/**
 * Table cell with its column label (prototype: labelTables). On phones the stylesheet stacks each row into a card:
 * the label shows on the left from data-l and the content (wrapped in .tdv) on the right. On desktop .tdv is
 * display: contents, so nothing changes. Mark the first column with `first`.
 */
export function Td({ l, first, nw, className, children, ...rest }:
  React.TdHTMLAttributes<HTMLTableCellElement> & { l?: string; first?: boolean; nw?: boolean }) {
  const cls = [className, nw ? 'nw' : ''].filter(Boolean).join(' ') || undefined;
  const wrap = !first && !!l && children != null && children !== false && children !== '';
  return <td data-l={l ?? ''} className={cls} {...rest}>{wrap ? <span className="tdv">{children}</span> : children}</td>;
}
