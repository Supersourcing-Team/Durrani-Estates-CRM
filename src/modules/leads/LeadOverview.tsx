/*
 * A04 Lead detail, Overview tab.
 * prototype: leadOverview(role, l) and nextCard(role, l) in 06-leads.js, plus the Emails card that
 * 14-journey.js appends to the right column.
 */
import React from 'react';
import { eng, fd, fds, fhm, ft, fts, money } from '../../engine';
import { BkChip, Bn, Card, Chip, Icon, Kvs, LeadLinks } from '../../ui';
import { TempPick } from './leadBits';
import type { LeadTabProps } from './LeadScreen';

/** prototype: nextCard(role, l): passed meeting, next action, or nothing scheduled */
function NextCard({ role, l }: LeadTabProps) {
  const NOW = eng.NOW();
  const n = eng.nextOf(l), mine = role === 'agent';
  const m = l.meets.filter((x: any) => x.status === 'scheduled' || x.status === 'link-sent').sort((a: any, b: any) => a.at - b.at)[0];
  let h: React.ReactNode;
  if (m && m.at < NOW && mine) {
    h = (
      <div className="bn warn">
        <span><Icon n="cal" s={18} /></span>
        <div>
          <div className="t">Meeting time has passed</div>
          <div>{m.kind === 'virtual' ? 'Online meeting' : m.place} was {eng.sameDay(m.at, NOW) ? 'today at ' : 'on ' + fds(m.at) + ' at '}{fhm(m.at)}. Ask {l.name.split(' ')[0]} to confirm it{m.kind === 'virtual' ? '' : ' with a photo'}.</div>
        </div>
        <div className="acts">
          <button className="btn pri s" type="button" data-open={`send-confirm|${l.id}|${m.id}`}>Send confirmation link</button>
          <button className="btn s" type="button" data-act={`noshow|${l.id}|${m.id}`}>Client did not show</button>
        </div>
      </div>
    );
  } else if (n) {
    h = (
      <div className="row sb wrap g16">
        <div>
          <div className="ov">Next action</div>
          <div className="kns mt8">{n.type} · {eng.sameDay(n.at, NOW) ? 'Today ' : fds(n.at) + ' '}{fhm(n.at)}</div>
          {n.note ? <div className="muted sm mt8"><LeadLinks text={n.note} /></div> : null}
          {eng.isOverdue(l) ? <div className="dangertx sm b mt8">Overdue. Contact the client or reschedule.</div> : null}
        </div>
        {mine ? (
          <div className="row g6 wrap">
            <button className="btn" type="button" data-open={`sched|${l.id}|re`}>Reschedule</button>
            <button className="btn pri" type="button" data-open={`call-log|${l.id}`}>Log result</button>
          </div>
        ) : null}
      </div>
    );
  } else {
    h = (
      <div className="row sb wrap g16">
        <div>
          <div className="ov">Next action</div>
          <div className="b mt8">Nothing scheduled</div>
          <div className="muted sm">A dated follow-up or meeting keeps this lead active.</div>
        </div>
        {mine && !l.archived ? <button className="btn pri" type="button" data-open={`sched|${l.id}`}><Icon n="plus" s={16} />Schedule</button> : null}
      </div>
    );
  }
  return <div className="card ">{h}</div>;
}

/** 14-journey.js: emails sent to this lead */
function EmailsCard({ role, l }: LeadTabProps) {
  const em = eng.S.emails.filter((x: any) => x.lead === l.id);
  const mine = role === 'agent' && !l.archived;
  return (
    <Card title="Emails" right={mine ? <button className="btn s" type="button" data-open={`email-compose|${l.id}`}><Icon n="mail" s={14} />Send email</button> : null}>
      {em.length ? (
        <>
          <div className="mlist" data-emails="1">
            {em.slice(0, 4).map((x: any) => (
              <div className="mrow" key={x.id}>
                <span className="dr-ic dr-client"><Icon n="mail" s={15} /></span>
                <div className="dr-m">
                  <div className="b trunc"><LeadLinks text={x.subject} /></div>
                  <div className="xs muted">{(eng.tplById(x.tpl) || {}).name || 'Template'} · {eng.uname(x.by)} · {fts(x.at)}</div>
                </div>
                <Chip t={x.status} cls={eng.EMST[x.status] || 's2'} />
              </div>
            ))}
          </div>
          {em.some((x: any) => x.status === 'Bounced') ? <div className="mt8"><Bn kind="warn" title="" body="An email bounced. Check the address with the client." /></div> : null}
        </>
      ) : <p className="muted sm">No emails sent yet.</p>}
    </Card>
  );
}

export function LeadOverview({ role, l }: LeadTabProps) {
  const S = eng.S;
  const mine = role === 'agent';
  const bks = S.bookings.filter((b: any) => b.lead === l.id);
  const cur = l.cur || 'AED';
  const so = S.sec.filter((s: any) => s.lead === l.id);
  const escOpen = !!(l.esc && l.esc.status === 'open');
  const linked = l.linked ? eng.leadById(l.linked) : null;

  return (
    <div className="grid g21">
      <div className="col g16">
        <NextCard role={role} l={l} />
        <Card title="Profile">
          <Kvs items={[
            ['Phone', <>{l.phone} <button className="btn lnk xs" type="button" data-act={`copy|${l.phone}`}>Copy</button></>],
            ['Email', l.email],
            ['Location', l.city + ', ' + l.country],
            ['Source', l.src],
            ['Campaign', l.camp],
            ['Direction', l.dir],
            ['Assigned', l.assigned ? fd(l.assigned) : 'Not assigned'],
            ['Call attempts', String(l.attempts)],
            ['Budget', l.budget ? money(l.budget[0], cur) + ' to ' + money(l.budget[1], cur) : <span className="faint">Not captured</span>],
            ['Language', l.arabic ? 'Arabic speaker' : 'English'],
          ]} />
        </Card>
        {bks.length ? (
          <Card title="Bookings">
            {bks.map((b: any) => {
              const g = role + '-booking-' + eng.bkP(b.id);
              return (
                <a key={b.id} className="row sb" style={{ padding: '10px 0', borderBottom: '1px solid var(--bd-s)', textDecoration: 'none', color: 'inherit' }} href={'#' + g} data-go={g}>
                  <span><span className="b">{b.id}</span> · {b.unit}, {eng.projById(b.project).name}<br /><span className="muted sm">{eng.mfull(b.price, b.cur)}</span></span>
                  <span className="row g6"><BkChip s={b.status} /><Icon n="chev" s={14} /></span>
                </a>
              );
            })}
          </Card>
        ) : null}
        {l.track === 'cn' && l.cn ? (
          <Card title="Convertible Note">
            <Kvs items={[['Stage', l.cn.stage], ['Amount', eng.mfull(l.cn.amount, l.cn.cur)], ['Tenure', l.cn.tenure + ' months'], ['Payout', 'Monthly, 1.5%']]} />
            {mine ? <div className="mt16"><a className="btn pri" href={`#agent-cnapp-${l.id}`} data-go={`agent-cnapp-${l.id}`}>Open note application</a></div> : null}
          </Card>
        ) : null}
        {so.length ? (
          <Card title="Secondary Market">
            {so.map((s: any) => <div className="row sb" key={s.id}><span className="b">{s.id} · {s.prop}</span><Chip t={s.status} cls="s4" /></div>)}
            <div className="mt8"><a className="btn s" href={`#${role}-sec-${eng.secP(so[0].id)}`} data-go={`${role}-sec-${eng.secP(so[0].id)}`}>Open request</a></div>
          </Card>
        ) : null}
      </div>

      <div className="col g16">
        {mine && !l.archived ? (
          <Card title="Quick actions">
            <div className="col g6">
              <div className="lbl">Lead temperature</div>
              <TempPick cur={l.temp} act={'settemp|' + l.id + '|'} />
              <div className="divh"></div>
              <button className="btn blk" type="button" data-open={`share|${l.id}`}><Icon n="send" s={16} />Share project details</button>
              <button className="btn blk" type="button" data-open={`escalate|${l.id}`} disabled={escOpen || undefined}><Icon n="flag" s={16} />{escOpen ? 'Escalation open' : 'Escalate to manager'}</button>
              <button className="btn blk" type="button" data-open={`note|${l.id}`}>Add a note</button>
              <button className="btn blk" type="button" data-open={`archive|${l.id}`}>Not interested or lost</button>
              <button className="btn blk dngo" type="button" data-open={`dnd|${l.id}`}>Client asked not to be called</button>
            </div>
          </Card>
        ) : null}
        {l.esc ? (
          <Card title="Escalation">
            <div className="col g6">
              <div className="row sb"><Chip t={escOpen ? 'Open with manager' : 'Resolved'} cls={escOpen ? 's5' : 's6'} /><span className="xs faint">{ft(l.esc.at)}</span></div>
              <div className="sm"><LeadLinks text={l.esc.reason} /></div>
              {l.esc.resp ? <div className="bn ok"><span><Icon n="check" s={16} /></span><div><div className="t">Manager response</div><div><LeadLinks text={l.esc.resp} /></div></div></div> : null}
              <div className="xs muted">You keep ownership of this lead during an escalation.</div>
              {role === 'mgmt' && escOpen ? <button className="btn pri" type="button" data-open={`esc-respond|${l.id}`}>Respond</button> : null}
            </div>
          </Card>
        ) : null}
        {l.linked ? (
          <Card title="Linked lead">
            <div className="sm">Same phone number as <b><LeadLinks text={'LEAD-' + l.linked} /></b>{linked ? ' (' + linked.camp + ')' : ''}, different campaign.{role === 'agent' ? ' The original agent keeps it while it is active. Admin can override per project.' : ''}</div>
            {role !== 'agent' && linked ? <div className="mt8"><a className="btn s" href={`#${role}-lead-${linked.id}`} data-go={`${role}-lead-${linked.id}`}>Open LEAD-{linked.id}</a></div> : null}
          </Card>
        ) : null}
        <Card title="Ownership history">
          {l.own.length ? (
            <div className="tl">
              {l.own.map((o: any, i: number) => (
                <div className="tli" key={i}>
                  <div className="ico owner"><Icon n="repeat" s={14} /></div>
                  <div>
                    <div className="tt">{o.from ? eng.uname(o.from) : 'Admin pool'} to {o.to ? eng.uname(o.to) : o.team ? eng.teamName(o.team) + ' queue' : 'Admin pool'}</div>
                    <div className="tm"><LeadLinks text={o.reason + ' · ' + fd(o.at)} /></div>
                  </div>
                </div>
              ))}
            </div>
          ) : <div className="muted sm">Never assigned.</div>}
        </Card>
        <EmailsCard role={role} l={l} />
      </div>
    </div>
  );
}
