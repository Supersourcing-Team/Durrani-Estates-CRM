/*
 * A04 Lead detail, Documents tab (prototype: leadDocs(role, l) and docRow in 13-polish.js, which replaced
 * the 06-leads.js version). Category pills (UI.f.dcat), the client ID checklist and the grouped document list.
 */
import React from 'react';
import { eng, fd } from '../../engine';
import { Card, Chip, Empty, Icon } from '../../ui';
import type { LeadTabProps } from './LeadScreen';

const CATS: [string, string, string][] = [['all', 'All documents', 'folder'], ['client', 'Client documents', 'idcard'], ['finance', 'Financial', 'wallet'], ['property', 'Property and offers', 'building'], ['booking', 'Booking', 'file'], ['cn', 'Convertible Note', 'clip'], ['other', 'Other', 'folder']];
const GROUPS: [string, string][] = [['client', 'Client documents'], ['finance', 'Financial'], ['property', 'Property and offers'], ['booking', 'Booking documents'], ['cn', 'Convertible Note'], ['other', 'Other']];

/** prototype: docRow(d, role, l, mine) */
function DocRow({ d, role, l, mine }: { d: any; role: string; l: any; mine: boolean }) {
  const DOCCAT = eng.DOCCAT;
  const g = d.go === 'booking' ? role + '-booking-' + eng.bkP(d.bk) : '';
  return (
    <div className="drow">
      <span className={'dr-ic dr-' + d.src}><Icon n={d.src === 'booking' ? 'file' : d.src === 'cn' ? 'clip' : (DOCCAT[d.src] || DOCCAT.other).i} s={16} /></span>
      <div className="dr-m">
        <div className="b trunc">{d.type}</div>
        <div className="xs muted trunc">{d.name} · {d.by ? eng.uname(d.by) + ' · ' : ''}{d.at ? fd(d.at) : ''}</div>
      </div>
      <span className="dr-src">{d.srcT}</span>
      <Chip t={d.st} cls={eng.DSTC[d.st] || 's2'} />
      <span className="dr-a">
        {g ? <a className="btn s" href={'#' + g} data-go={g}>Open</a>
          : <button className="btn s" type="button" data-open={`doc-view-lead|${l.id}|${d.id || ''}|${d.type}`}>View</button>}
        {mine && d.own ? <button className="iconbtn sm" type="button" aria-label={'Remove ' + d.type} data-act={`docdel|${l.id}|${d.id}`}><Icon n="x" s={15} /></button> : null}
      </span>
    </div>
  );
}

export function LeadDocs({ role, l }: LeadTabProps) {
  const DOCCAT = eng.DOCCAT;
  const mine = role === 'agent' && !l.archived;
  const all: any[] = eng.leadAllDocs(l);
  const f = eng.UI.f.dcat || 'all';
  const cnt = (k: string) => (k === 'all' ? all.length : all.filter((d) => d.src === k).length);
  const cats = CATS.filter(([k]) => k === 'all' || k === 'client' || cnt(k) > 0 || ['finance', 'property'].includes(k));
  const catName = (cats.find((c) => c[0] === f) || ['', ''])[1];

  const up = mine
    ? <button className="btn pri s" type="button" data-open={`doc-upload|${l.id}${f !== 'all' && DOCCAT[f] ? '|' + f : ''}`}><Icon n="upload" s={14} />Upload document</button>
    : null;

  const cl = DOCCAT.client;
  const have = (t: string) => l.docs.find((d: any) => eng.docCat(d) === 'client' && eng.docType(d) === t);
  const checklist = (
    <Card title="Client documents" right={f === 'client' ? up : null}>
      <p className="muted sm mb8">Identity documents for this client. Emirates ID and passport are needed before a booking.</p>
      <div className="dslots">
        {cl.types.map((t: string) => {
          const d = have(t);
          const req = cl.req.includes(t);
          return (
            <div className={'dslot ' + (d ? 'ok' : '')} key={t}>
              <span className="dr-ic dr-client"><Icon n={d ? 'check' : 'idcard'} s={16} /></span>
              <div className="dr-m">
                <div className="b">{t}{req ? null : <>{' '}<span className="faint xs">Optional</span></>}</div>
                <div className="xs muted trunc">{d ? d.name + ' · ' + fd(d.at) : 'Not uploaded'}</div>
              </div>
              {d ? <Chip t="Uploaded" cls="s6" />
                : mine ? <button className={'btn s ' + (req ? 'pri' : '')} type="button" data-open={`doc-upload|${l.id}|client|${t}`}><Icon n="upload" s={14} />Upload</button>
                : <Chip t="Missing" cls="s2" />}
            </div>
          );
        })}
      </div>
    </Card>
  );

  let list: React.ReactNode = null;
  if (f !== 'client') {
    const items = f === 'all' ? all : all.filter((d) => d.src === f);
    const groups: [string, any[]][] = f === 'all'
      ? GROUPS.map(([k, t]): [string, any[]] => [t, items.filter((d) => d.src === k)]).filter((g) => g[1].length)
      : [[catName, items]];
    list = (
      <Card title={f === 'all' ? 'All documents' : catName} right={up} bare={!!items.length}>
        {items.length ? groups.map(([t, ds]) => (
          <React.Fragment key={t}>
            {f === 'all' ? <div className="dgroup">{t} <span className="faint">{ds.length}</span></div> : null}
            <div className="dlist">{ds.map((d, i) => <DocRow key={i} d={d} role={role} l={l} mine={mine} />)}</div>
          </React.Fragment>
        )) : (
          <Empty icn="file" t="No documents here yet"
            d={f === 'booking' ? 'Booking documents are added on the booking itself.' : f === 'cn' ? 'Convertible Note documents are collected in the note application.' : 'Upload the first one when the client shares it.'}
            act={mine && DOCCAT[f] ? <button className="btn pri" type="button" data-open={`doc-upload|${l.id}|${f}`}><Icon n="upload" s={16} />Upload</button> : null} />
        )}
      </Card>
    );
  }
  const side = eng.S.bookings.filter((b: any) => b.lead === l.id);

  return (
    <>
      <div className="pills mb16">
        {cats.map(([k, t]) => <button key={k} type="button" className={'pill ' + (f === k ? 'on' : '')} data-act={`ui|dcat|${k}`}>{t} <b>{cnt(k)}</b></button>)}
      </div>
      {f === 'all' || f === 'client'
        ? <div className={f === 'all' ? 'grid g12' : ''}>{checklist}{f === 'all' ? list : null}</div>
        : list}
      {side.length && (f === 'all' || f === 'booking')
        ? <p className="muted sm mt16"><Icon n="info" s={14} /> Booking and closure documents are reviewed by Admin on the booking. Open the booking to upload or replace them.</p>
        : null}
    </>
  );
}
