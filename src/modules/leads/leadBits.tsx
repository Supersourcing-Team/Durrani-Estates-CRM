/*
 * Small lead view helpers shared by the lead list and the lead detail screen.
 * prototype: nextTxt, leadTags, leadFlag, tempPick, pipeline (05-shared.js, 06-leads.js, 13-polish.js).
 */
import React from 'react';
import { eng, fhm, fds } from '../../engine';
import { Chip, Icon, Tag, RiskChip, TrackChip } from '../../ui';

/** prototype: nextTxt(l): the next follow-up, red when overdue */
export function NextTxt({ l }: { l: any }) {
  const n = eng.nextOf(l);
  if (!n) return l.next && l.next.done ? <span className="faint">Done today</span> : <span className="faint">None set</span>;
  const od = n.at < eng.startOfDay(eng.NOW());
  const when = eng.sameDay(n.at, eng.NOW()) ? 'Today ' + fhm(n.at) : fds(n.at) + ' ' + fhm(n.at);
  return <><span className={od ? 'dangertx b' : ''}>{n.type} · {when}</span>{od ? <>{' '}<span className="xs dangertx">overdue</span></> : null}</>;
}

/** prototype: leadTags(l) is non-empty */
export const hasLeadTags = (l: any): boolean => !!(l.arabic || l.linked || (l.track && l.track !== 'property'));

/** prototype: leadTags(l): Arabic / Linked tags and a non-property track chip */
export function LeadTags({ l }: { l: any }) {
  return (
    <>
      {l.arabic ? <><Tag t="Arabic" cls="ar" />{' '}</> : null}
      {l.linked ? <><Tag t="Linked" cls="lk" />{' '}</> : null}
      {l.track && l.track !== 'property' ? <><TrackChip t={l.track} />{' '}</> : null}
    </>
  );
}

/** prototype: leadFlag(l) is non-empty */
export function hasLeadFlag(l: any): boolean {
  const r = eng.leadRisk(l);
  return r.state === 'risk' || r.state === 'hold' || !!(l.esc && l.esc.status === 'open') || !!l.archived;
}

/** Plain text of LeadFlag, used to decide whether the table cell stays on one line (prototype labelTables). */
export function leadFlagText(l: any): string {
  const r = eng.leadRisk(l);
  let t = '';
  if (r.state === 'risk') t += 'At risk · ' + r.left + (r.left === 1 ? ' day' : ' days') + ' left ';
  if (r.state === 'hold') t += 'On hold ';
  if (l.esc && l.esc.status === 'open') t += 'Escalated ';
  if (l.archived) t += (l.dnd ? 'DND' : l.wrong ? 'Wrong number' : 'Archived') + ' ';
  return t;
}

/** prototype: leadFlag(l): risk, hold, escalation and archived chips */
export function LeadFlag({ l }: { l: any }) {
  const r = eng.leadRisk(l);
  return (
    <>
      {r.state === 'risk' || r.state === 'hold' ? <><RiskChip l={l} />{' '}</> : null}
      {l.esc && l.esc.status === 'open' ? <><Chip t="Escalated" cls="s5" />{' '}</> : null}
      {l.archived ? <><Chip t={l.dnd ? 'DND' : l.wrong ? 'Wrong number' : 'Archived'} cls="s2" />{' '}</> : null}
    </>
  );
}

/** prototype: tempPick(cur, act, {lg}): hot / warm / cold radio buttons running `${act}${k}` */
export function TempPick({ cur, act, lg }: { cur: string; act: string; lg?: boolean }) {
  return (
    <div className={'tpick ' + (lg ? 'lg' : '')} role="radiogroup" aria-label="Lead temperature">
      {eng.TEMPS.map(([k, t, i, d]: string[]) => (
        <button key={k} type="button" role="radio" aria-checked={cur === k} className={`tp tp-${k} ${cur === k ? 'on' : ''}`} data-act={act + k}>
          <Icon n={i} s={lg ? 18 : 16} /><span className="tp-t">{t}</span>{lg ? <span className="tp-d">{d}</span> : null}
        </button>
      ))}
    </div>
  );
}

const STEPS = ['New', 'Contacted', 'Qualified', 'Shortlisted', 'Booking submitted', 'Pending', 'Closed'];
/** prototype: pipeline(l): the stage stepper on the lead header */
export function Pipeline({ l }: { l: any }) {
  const i = Math.max(0, STEPS.indexOf(l.stage));
  return (
    <>
      <div className="hstp">{STEPS.map((s, k) => <div key={s} className={'hs ' + (k < i ? 'done' : k === i ? 'cur' : '')}>{s}</div>)}</div>
      {l.stage === 'Lost' ? <div className="mt8"><Chip t="Lost" cls="s2" /></div> : null}
    </>
  );
}
