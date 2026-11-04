/* Small parts shared by the Admin control screens (home, reports, audit, settings, sources). */
import React from 'react';
import { eng } from '../../engine';
import { Fld, Icon, MOpt, MSel, Td, isShort, type Node } from '../../ui';

/**
 * Table cell (prototype labelTables: data-l label, nowrap when the text is 20 characters or fewer,
 * content wrapped in .tdv after the first column). Pass the cell's plain text as `t` when the
 * children are not a plain string.
 */
export function Tc({ l, first, t, className, children, colSpan }:
  { l: string; first?: boolean; t?: string; className?: string; children?: Node; colSpan?: number }) {
  const txt = t ?? (typeof children === 'string' || typeof children === 'number' ? String(children) : '');
  return <Td l={l} first={first} nw={isShort(txt)} className={className} colSpan={colSpan}>{children ?? ''}</Td>;
}

/**
 * prototype: dlBtn(label, text, fileName). Stores the CSV in the engine download buffer (DLBUF) and
 * renders the button that runs the dlcsv action. The buffer key is stable per file name.
 */
export function DlBtn({ label, text, name }: { label: string; text: string; name: string }) {
  const k = 'adm-' + name;
  eng.DLBUF[k] = [text, name];
  return <button className="btn" type="button" data-act={'dlcsv|' + k}><Icon n="dl" s={16} />{label}</button>;
}

/**
 * prototype: fillTpl(text, values, true). Template text with each {field} replaced by its sample value
 * in a highlighted <mark class="tv">; unknown fields stay as {field} in <mark class="tv miss">.
 */
export function TplFill({ txt, v }: { txt: string; v: Record<string, string> }) {
  const out: React.ReactNode[] = [];
  let last = 0;
  String(txt || '').replace(/\{([a-z_]+)\}/g, (m: string, k: string, i: number) => {
    out.push(txt.slice(last, i));
    out.push(v[k] != null && v[k] !== '' ? <mark key={i} className="tv">{v[k]}</mark> : <mark key={i} className="tv miss">{m}</mark>);
    last = i + m.length;
    return m;
  });
  out.push(txt.slice(last));
  return <>{out}</>;
}

/** Routing choices used by src-connect (step 4) and src-route: three option cards. */
const ROUTE_OPTS: [string, string, string][] = [
  ['pool', 'Admin pool', 'You place each lead'],
  ['team', 'A team queue', 'The manager places them'],
  ['auto', 'Spread to a team automatically', 'Same number each, ceiling respected'],
];

/** Routing fields shared by src-connect (step 4) and src-route. */
export function RouteFields({ projLabel, projHint }: { projLabel: string; projHint?: string }) {
  const S = eng.S;
  return (
    <>
      <Fld label="New leads go to"><div className="col g6">{ROUTE_OPTS.map(([v, t, d]) => <MOpt key={v} k="route" v={v} t={t} d={d} />)}</div></Fld>
      {eng.UI.mf.route !== 'pool' ? <Fld label="Team" htmlFor="m_team"><MSel k="team" opts={S.teams.map((x: any) => [x.id, x.name])} blank={false} /></Fld> : null}
      <Fld label={projLabel} htmlFor="m_proj" hint={projHint}><MSel k="proj" opts={S.projects.map((p: any) => [p.id, p.name])} blank="Any project" /></Fld>
    </>
  );
}
