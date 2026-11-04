/*
 * A04 Lead detail (prototype route agent-lead, render leadPage(role, p) in 06-leads.js).
 * Header with actions and stage pipeline, banners, section tabs and the active tab.
 * Tabs: overview, calls, qualify, docs, props, timeline (#agent-lead-1023-calls -> params ['1023', 'calls']).
 */
import React from 'react';
import { eng, ini } from '../../engine';
import { AvBox, Bn, Btn, DispChip, Empty, Icon, LeadLinks, StageChip, Tabs, TempChip, TrackChip } from '../../ui';
import type { ScreenComp } from '../../app/types';
import { LeadFlag, LeadTags, Pipeline } from './leadBits';
import { LeadOverview } from './LeadOverview';
import { LeadCalls } from './LeadCalls';
import { LeadQual } from './LeadQual';
import { LeadDocs } from './LeadDocs';
import { LeadProps } from './LeadProps';
import { LeadTimeline } from './LeadTimeline';

/** prototype: LT */
const LT: [string, string, string][] = [['overview', 'Overview', 'info'], ['calls', 'Calls', 'phone'], ['qualify', 'Qualification', 'clip'], ['docs', 'Documents', 'file'], ['props', 'Properties', 'building'], ['timeline', 'Timeline', 'hist']];
/** prototype: leadBack */
const BACK: Record<string, [string, string]> = { agent: ['My Leads', 'agent-leads'], mgmt: ['Team Leads', 'mgmt-leads'], admin: ['Leads', 'admin-leads'] };

export type LeadTabProps = { role: string; l: any };

/** Header action buttons (agent: contact, WhatsApp, email, schedule). */
function LeadActions({ role, l, unlHere }: { role: string; l: any; unlHere: boolean }) {
  const mine = role === 'agent';
  const tel = 'tel:' + l.phone.replace(/\s/g, '');
  return (
    <div className="row g6 wrap">
      {mine && !l.archived ? (
        <>
          {unlHere ? (
            <>
              <button className="btn pri" type="button" data-open={`call-log|${l.id}`}><Icon n="clipb" s={16} />Log call</button>
              <a className="btn" href={tel} data-act={`dial|${l.id}`}><Icon n="phone" s={16} />Call again</a>
            </>
          ) : <a className="btn callb" href={tel} data-act={`dial|${l.id}`}><Icon n="phone" s={16} />Contact lead</a>}
          <a className="btn" href={'https://wa.me/' + eng.norm(l.phone)} target="_blank" rel="noopener" data-ext="1"><Icon n="msg" s={16} />WhatsApp</a>
          <a className="btn" href={'mailto:' + l.email} data-act={`emailopen|${l.id}`}><Icon n="mail" s={16} />Email</a>
          <button className="btn" type="button" data-open={`sched|${l.id}`}><Icon n="cal" s={16} />Schedule</button>
        </>
      ) : null}
      {role === 'mgmt' ? (
        <>
          <button className="btn pri" type="button" data-open={`reassign|${l.id}`}><Icon n="repeat" s={16} />Reassign</button>
          {l.hold
            ? <button className="btn" type="button" data-act={`holdoff|${l.id}`}>Release hold</button>
            : <button className="btn" type="button" data-open={`hold|${l.id}`}>Place on hold</button>}
          <button className="btn" type="button" data-open={`nudge|${l.id}`}><Icon n="bell" s={16} />Nudge agent</button>
        </>
      ) : null}
      {role === 'admin' ? <button className="btn pri" type="button" data-open={`reassign|${l.id}`}><Icon n="repeat" s={16} />{l.owner ? 'Reassign' : 'Assign'}</button> : null}
      {role !== 'agent' ? <button className="btn" type="button" data-open={`note|${l.id}`}>Add note</button> : null}
    </div>
  );
}

export function LeadPage({ role, params }: { role: string; params: string[] }) {
  const S = eng.S;
  const l = eng.leadById(params[0]);
  const tab = LT.some((t) => t[0] === params[1]) ? params[1] : 'overview';
  const acc = eng.leadAccess(role, l);
  const bk = BACK[role];
  const back = <Btn t={'Back to ' + bk[0]} go={bk[1]} cls="pri" />;

  if (acc === 'missing') return <div className="card"><Empty icn="user" t="Lead not found" d={'No lead with ID ' + params[0] + ' exists.'} act={back} /></div>;
  if (acc === 'foreign') return <div className="card"><Empty icn="lock" t="This lead is not yours" d={'LEAD-' + l.id + ' belongs to ' + (role === 'agent' ? 'another agent' : 'another team') + '. You cannot open it.'} act={back} /></div>;
  if (acc === 'pool') return <div className="card"><Empty icn="lock" t="This lead is in the Admin pool" d="Only Admin can assign it. It is not on your list." act={back} /></div>;

  const u = eng.me(), mine = role === 'agent', r = eng.leadRisk(l), ro = !!l.archived;
  const unl = S.unlogged[u.id];
  const unlHere = !!(mine && unl && unl.lead === l.id);

  const nT: Record<string, number> = { calls: l.calls.length, docs: eng.leadAllDocs(l).length, props: l.shortlist.length };
  const tabItems = LT.map(([k, t, i]) => ({ k, l: t, i, go: `${role}-lead-${l.id}${k === 'overview' ? '' : '-' + k}`, n: nT[k] }));

  const banners: React.ReactNode[] = [];
  if (ro) banners.push(<Bn kind="info" title="This lead is archived" body={'Archived leads are read-only. ' + (l.archReason ? 'Reason: ' + l.archReason + '.' : '') + (l.dnd ? ' The number is on the Do Not Call list.' : '')} />);
  if (mine && !ro && r.state === 'risk') banners.push(
    <Bn kind="err" title={'At risk: ' + r.left + ' day' + (r.left === 1 ? '' : 's') + ' left'}
      body={'No forward commitment for ' + r.d + ' days. Schedule a follow-up or meeting with a date to keep this lead. Notes and calls alone do not reset the clock.'}
      acts={<button className="btn pri s" type="button" data-open={`sched|${l.id}`}>Schedule now</button>} />);
  if (role !== 'agent' && !ro && r.state === 'risk') banners.push(
    <Bn kind="warn" title={'At risk: ' + r.left + ' day' + (r.left === 1 ? '' : 's') + ' left before auto-return'} body="This lead returns to the Admin pool if the agent makes no forward commitment." />);
  if (l.hold) banners.push(
    <Bn kind="info" title="On manager hold" body={'Held by ' + eng.uname(l.hold.by) + ': ' + l.hold.reason + '. The inactivity clock is paused.'}
      acts={role === 'mgmt' ? <button className="btn s" type="button" data-act={`holdoff|${l.id}`}>Release hold</button> : null} />);
  if (unlHere) banners.push(
    <Bn kind="warn" title="You called this lead" body="Log the result to unlock your next call."
      acts={<button className="btn pri s" type="button" data-open={`call-log|${l.id}`}>Log call</button>} />);

  const Body = { overview: LeadOverview, calls: LeadCalls, qualify: LeadQual, docs: LeadDocs, props: LeadProps, timeline: LeadTimeline }[tab] || LeadOverview;

  return (
    <>
      <div className="card mb16">
        <div className="row top g16 wrap">
          <AvBox cls="lg" t={ini(l.name)} />
          <div style={{ flex: 1, minWidth: 220 }}>
            <div className="row g6 wrap"><h1 className="h1" style={{ fontSize: 28 }}>{l.name}</h1><LeadTags l={l} /></div>
            <div className="muted sm mt8"><LeadLinks text={`LEAD-${l.id} · ${l.phone} · ${l.city}, ${l.country}`} /></div>
            <div className="row g6 wrap mt8"><TrackChip t={l.track} /><TempChip t={l.temp} /><StageChip s={l.stage} /><DispChip d={l.disp} /><LeadFlag l={l} /></div>
            <div className="muted xs mt8">Owner: {l.owner ? eng.uname(l.owner) : 'Admin pool'} · {l.src} · {l.camp}</div>
          </div>
          <LeadActions role={role} l={l} unlHere={unlHere} />
        </div>
        <div className="leadpipe"><Pipeline l={l} /></div>
      </div>
      {banners.map((b, i) => <div className="mb16" key={i}>{b}</div>)}
      <Tabs items={tabItems} cur={tab} />
      <Body role={role} l={l} />
    </>
  );
}

export const AgentLeadScreen: ScreenComp = ({ params }) => <LeadPage role="agent" params={params} />;
/* M03 Lead detail (manager) */
export const MgmtLeadScreen: ScreenComp = ({ params }) => <LeadPage role="mgmt" params={params} />;
/* AD02 Lead detail (admin) */
export const AdminLeadScreen: ScreenComp = ({ params }) => <LeadPage role="admin" params={params} />;
