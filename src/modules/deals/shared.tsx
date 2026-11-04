/* Shared parts of the project catalogue and bookings screens (prototype: projCard, projToolbar, bookingTable, histList, psel, pinp). */
import React from 'react';
import { eng, bump, money } from '../../engine';
import { BkChip, Chip, Empty, Icon, Search, Sel, Td, paged, pv, type Node } from '../../ui';

type Opt = string | [string | number, Node];
const optV = (x: Opt) => (Array.isArray(x) ? x[0] : x);
const optL = (x: Opt) => (Array.isArray(x) ? x[1] : x);
const setPf = (k: string, v: any) => { eng.UI.pf[k] = v; bump(); };

/** prototype: psel(k, opts, {d, blank, bad, dis}). Page select bound to UI.pf[k]; supports `dis` (PfSel does not). */
export function PSel({ k, opts, d, blank, bad, dis }: { k: string; opts: Opt[]; d?: any; blank?: string | false; bad?: boolean; dis?: boolean }) {
  return (
    <select className={'sel ' + (bad ? 'bad' : '')} id={'p_' + k} value={String(pv(k, d ?? ''))} disabled={dis || undefined}
      onChange={(e) => setPf(k, e.target.value)}>
      {blank !== false ? <option value="">{blank || 'Select'}</option> : null}
      {opts.map((x) => <option key={String(optV(x))} value={String(optV(x))}>{optL(x)}</option>)}
    </select>
  );
}

/** prototype: pinp(k, {type, d, min, bad, dis}). Page input bound to UI.pf[k]; supports `dis` (PfInput does not). */
export function PInp({ k, type = 'text', d, min, bad, dis, ph }: { k: string; type?: string; d?: any; min?: number; bad?: boolean; dis?: boolean; ph?: string }) {
  return (
    <input className={'inp ' + (bad ? 'bad' : '')} id={'p_' + k} type={type} value={String(pv(k, d ?? ''))} placeholder={ph || ''}
      min={min} disabled={dis || undefined} onChange={(e) => setPf(k, e.target.value)} />
  );
}

/**
 * prototype: labelTables() added class "nw" (no wrap) to every table cell whose text is 20 characters or less.
 * Pass the cell's visible text; returns the class to add.
 */
export const nw = (text: string, cls = ''): string => (cls ? cls + ' ' : '') + (String(text).trim().length <= 20 ? 'nw' : '');

/** prototype: projCard(p, role). `hidden` adds the Admin list's "Hidden" chip before the name. */
export function ProjCard({ p, role, hidden }: { p: any; role: string; hidden?: boolean }) {
  const free = p.units.filter((u: any) => u.status === 'Available').length;
  const go = `${role}-project-${p.id}`;
  return (
    <a className="card proj" href={'#' + go} data-go={go} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div className={'img i' + p.img}><span className="chip s3">{p.status}</span></div>
      <div className="pb">
        <div className="row sb"><span className="h2">{hidden ? <span className="chip s2" style={{ marginRight: 6 }}>Hidden</span> : null}{p.name}</span>{p.pri ? <Chip t="Priority" cls="s3" /> : null}</div>
        <div className="muted sm">{p.area}, {p.city} · {p.dev}</div>
        <div className="row sb"><span className="b">{money(p.from)} to {money(p.to)}</span><span className="sm muted">{free} available</span></div>
        <div className="xs faint">Handover {p.ho} · {p.plan}</div>
      </div>
    </a>
  );
}

/** prototype: projToolbar() */
export function ProjToolbar() {
  const UI = eng.UI;
  return (
    <div className="row g6 wrap mb16 fbar">
      <div style={{ flex: 1, minWidth: 200 }}><Search bind="pq" val={UI.f.pq} ph="Search projects, developers, areas" /></div>
      <Sel bind="pt" cur={UI.f.pt || 'all'} opts={[['all', 'All types'], 'Apartment', 'Villa']} />
      <Sel bind="pc" cur={UI.f.pc || 'all'} opts={[['all', 'All cities'], 'Dubai']} />
    </div>
  );
}

/** prototype: bookingTable(list, role, key) (agent columns only) */
export function BookingTable({ list, role, pageKey }: { list: any[]; role: string; pageKey: string }) {
  const P = paged(list, pageKey, 8);
  if (!list.length) return <Empty icn="file" t="No bookings here" d="Bookings appear here once an agent raises one." />;
  return (
    <>
      <div className="tw">
        <table className="tbl">
          <thead><tr><th>Booking</th><th>Client</th><th>Unit</th><th className="num">Price</th>{role !== 'agent' ? <th>Agent</th> : null}<th>Status</th><th>Deal stage</th></tr></thead>
          <tbody>
            {P.items.map((b: any) => {
              const l = eng.leadById(b.lead);
              const g = role + '-booking-' + eng.bkP(b.id);
              return (
                <tr key={b.id} className="click" data-go={g}>
                  <Td first l="Booking" className={nw(b.id + eng.fds(b.submitted))}><a className="b" href={'#' + g} data-go={g}>{b.id}</a><div className="xs faint">{eng.fds(b.submitted)}</div></Td>
                  <Td l="Client" className={nw(l ? l.name : '')}>{l ? l.name : ''}</Td>
                  <Td l="Unit" className={nw(b.unit + eng.projById(b.project).name)}>{b.unit}<div className="xs faint">{eng.projById(b.project).name}</div></Td>
                  <Td l="Price" className={nw(eng.mfull(b.price, b.cur), 'num')}>{eng.mfull(b.price, b.cur)}</Td>
                  {role !== 'agent' ? <Td l="Agent" className={nw(eng.uname(b.agent))}>{eng.uname(b.agent)}</Td> : null}
                  <Td l="Status" className="nw"><BkChip s={b.status} /></Td>
                  <Td l="Deal stage" className={nw(eng.dealStage(b), 'sm')}>{eng.dealStage(b)}</Td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {P.foot}
    </>
  );
}

/** prototype: histList(arr) */
export function HistList({ arr }: { arr: any[] }) {
  return (
    <div className="tl">
      {arr.map((h, i) => (
        <div className="tli" key={i}>
          <div className="ico stage"><Icon n="check" s={14} /></div>
          <div><div className="tt">{h[0]}</div><div className="tm">{eng.uname(h[1])} · {eng.ft(h[2])}</div></div>
        </div>
      ))}
    </div>
  );
}
