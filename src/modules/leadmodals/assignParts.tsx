/*
 * Pickers shared by the assignment pop-ups (prototype helpers agentOpts, teamOpts, reasonFld in the
 * "assignment model" block of all.js). Exported so other assignment screens can reuse them.
 */
import React from 'react';
import { eng, ini } from '../../engine';
import { AvBox, Bar, Fld, Icon, MTxa, mv } from '../../ui';

/** prototype: agentOpts(ag, cur, n): agents with their lead load; agents without room for n leads are disabled */
export function AgentOpts({ ag, cur, n }: { ag: any[]; cur?: string; n?: number }) {
  return (
    <div className="col g6">
      {ag.map((x) => {
        const c = eng.capInfo(x.id);
        const dis = c.left < (n || 1);
        const off = eng.todayStat(x.id) === 'On leave';
        return (
          <button key={x.id} type="button" className={'opt ' + (cur === x.id ? 'on' : '')}
            {...(dis ? { disabled: true, style: { opacity: 0.55, cursor: 'not-allowed' } } : { 'data-act': `mset|to|${x.id}` })}>
            <AvBox cls="sm" t={ini(x.name)} />
            <span style={{ flex: 1, minWidth: 0 }}>
              <span className="t">{x.name}</span>
              <span className="d" style={{ display: 'block' }}>{eng.teamName(x.team)} · {c.used} of {c.cap} leads{dis ? ' · no room' : ''}{off ? ' · on leave today' : ''}</span>
            </span>
            <Bar p={eng.pct(c.used, c.cap)} cls={c.full ? 'bad' : ''} />
          </button>
        );
      })}
    </div>
  );
}

/** prototype: teamOpts(cur, exclude): team queues (value "team|<id>") */
export function TeamOpts({ cur, exclude }: { cur?: string; exclude?: string | null }) {
  return (
    <div className="col g6">
      {eng.S.teams.filter((t: any) => t.id !== exclude).map((t: any) => {
        const m = eng.userById(t.mgr);
        return (
          <button key={t.id} type="button" className={'opt ' + (cur === 'team|' + t.id ? 'on' : '')} data-act={`mset|to|team|${t.id}`}>
            <AvBox cls="sm"><Icon n="users" s={14} /></AvBox>
            <span style={{ flex: 1 }}>
              <span className="t">{t.name} queue</span>
              <span className="d" style={{ display: 'block' }}>Manager {m ? m.name : 'not set'} assigns it · {eng.queueLeads(t.id).length} waiting now</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

/** prototype: reasonFld(e, first): quick reason pills plus a free-text reason (UI.mf.why), always required */
export function ReasonFld({ e, first }: { e: Record<string, string>; first?: boolean }) {
  const chips: string[] = first ? eng.RCHIPS0 : eng.RCHIPS;
  return (
    <Fld label="Reason" htmlFor="m_why" err={e.why} req hint="Always required. Saved in the lead history and the audit log.">
      <div className="row g6 wrap mb8">
        {chips.map((t) => <button key={t} type="button" className={'pill sm ' + (mv('why') === t ? 'on' : '')} data-act={`mset|why|${t}`}>{t}</button>)}
      </div>
      <MTxa k="why" bad={!!e.why} ph="Or write your own reason" />
    </Fld>
  );
}
