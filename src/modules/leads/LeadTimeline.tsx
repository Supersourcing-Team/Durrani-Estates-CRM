/*
 * A04 Lead detail, Timeline tab (prototype: leadTimeline(role, l) in 06-leads.js; 14-journey.js gives
 * "Email sent" events the mail icon).
 */
import React from 'react';
import { eng, ft } from '../../engine';
import { Card, Empty, Icon, LeadLinks } from '../../ui';
import type { LeadTabProps } from './LeadScreen';

const ICO_CLS: Record<string, string> = { call: 'call', wa: 'wa', meet: 'meet', stage: 'stage', owner: 'owner', doc: 'doc', warn: 'warn', sys: 'owner', note: 'doc' };
const ICO: Record<string, string> = { call: 'phone', wa: 'msg', meet: 'cal', stage: 'flag', owner: 'repeat', doc: 'file', warn: 'alert', note: 'edit' };
const FILTERS: [string, string][] = [['all', 'All'], ['contact', 'Contact'], ['system', 'Stage and ownership'], ['note', 'Notes']];

export function LeadTimeline({ l }: LeadTabProps) {
  const f = eng.UI.f.tf || 'all';
  const ev = [...l.ev].sort((a: any, b: any) => b.t - a.t).filter((e: any) => f === 'all'
    || (f === 'contact' && ['call', 'wa', 'meet'].includes(e.k))
    || (f === 'system' && ['owner', 'stage', 'sys', 'doc', 'warn'].includes(e.k))
    || (f === 'note' && e.k === 'note'));
  return (
    <>
      <div className="seg mb16">
        {FILTERS.map(([k, t]) => <button key={k} className={f === k ? 'on' : ''} type="button" data-act={`ui|tf|${k}`}>{t}</button>)}
      </div>
      <Card title="">
        {ev.length ? (
          <div className="tl">
            {ev.map((e: any, i: number) => {
              const mail = !ICO_CLS[e.k] && String(e.txt).startsWith('Email sent');
              return (
                <div className="tli" key={i}>
                  <div className={'ico ' + (mail ? 'mail' : ICO_CLS[e.k] || '')}><Icon n={mail ? 'mail' : ICO[e.k] || 'info'} s={14} /></div>
                  <div>
                    <div className="tt"><LeadLinks text={e.txt} /></div>
                    <div className="tm">{ft(e.t)} · {e.by ? (e.by === 'client' ? 'Client' : eng.uname(e.by)) : 'System'}</div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : <Empty icn="hist" t="No activity" d="Events appear here as the lead moves." />}
      </Card>
    </>
  );
}
