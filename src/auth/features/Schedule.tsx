/* A-schedule: every dated follow-up grouped by Overdue / Today / Next 7 days / Later (prototype route agent-schedule). */
import React from 'react';
import { eng, fhm, DAY } from '../../engine';
import { Card, Chip, Empty, Icon, PgHead } from '../../ui';
import type { ScreenComp } from '../../app/types';

function SchedRow({ x }: { x: any }) {
  const NOW = eng.NOW();
  return (
    <div className={'sch ' + (x.next.done ? 'done' : '')}>
      <span className="tm" style={{ width: 92 }}>{eng.sameDay(x.next.at, NOW) ? '' : eng.fds(x.next.at) + ' '}{fhm(x.next.at)}</span>
      <a style={{ flex: 1, minWidth: 0, textDecoration: 'none', color: 'inherit' }} href={`#agent-lead-${x.id}`} data-go={`agent-lead-${x.id}`}>
        <span className="b nm" style={{ display: 'block' }}>{x.name}</span>
        <span className="muted xs">{x.next.type}{x.next.note ? ' · ' + x.next.note : ''}</span>
      </a>
      {x.next.done ? <Chip t="Done" cls="s6" /> : (
        <>
          <button className="btn s" type="button" data-open={`call-log|${x.id}`}>Log result</button>
          <button className="btn s" type="button" data-open={`sched|${x.id}|re`}>Reschedule</button>
        </>
      )}
    </div>
  );
}

export const Schedule: ScreenComp = () => {
  const u = eng.me();
  const NOW = eng.NOW();
  const a: any[] = eng.leadsOf(u.id).filter((l: any) => l.next && !l.archived);
  const t0 = eng.startOfDay(NOW);
  const groups: [string, any[]][] = [
    ['Overdue', a.filter((l) => !l.next.done && l.next.at < t0)],
    ['Today', a.filter((l) => eng.sameDay(l.next.at, NOW))],
    ['Next 7 days', a.filter((l) => l.next.at >= t0 + DAY && l.next.at < t0 + 8 * DAY)],
    ['Later', a.filter((l) => l.next.at >= t0 + 8 * DAY)],
  ];
  const any = groups.some(([, l]) => l.length);
  return (
    <>
      <PgHead t="Today's schedule" sub="Every follow-up and meeting with a date, in order."
        right={<a className="btn" href="#agent-leads" data-go="agent-leads"><Icon n="user" s={16} />My Leads</a>} />
      {any ? groups.map(([t, l]) => l.length ? (
        <Card key={t} title={t + ' (' + l.length + ')'} cls="mb16">
          {[...l].sort((x, y) => x.next.at - y.next.at).map((x) => <SchedRow key={x.id} x={x} />)}
        </Card>
      ) : null) : <Card><Empty icn="cal" t="Nothing scheduled" d="Schedule a follow-up from any lead." /></Card>}
    </>
  );
};
