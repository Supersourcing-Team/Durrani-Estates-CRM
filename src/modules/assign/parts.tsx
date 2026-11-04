/*
 * Small view helpers shared by the assignment screens and pop-ups.
 * prototype: agentOpts, teamOpts, reasonFld (15b-leads.js) and the repeated row checkbox / capacity chip markup.
 */
import React from 'react';
import { eng, ini, pct } from '../../engine';
import { AvBox, Bar, Chip, Fld, Icon, MTxa } from '../../ui';

/** The selected lead ids (prototype: (UI.f.sel||'').split(',').filter(Boolean)) */
export const selIds = (): string[] => String(eng.UI.f.sel || '').split(',').filter(Boolean);

/** Row checkbox that toggles a lead in UI.f.sel (prototype: <input type="checkbox" data-act="selrow|id">) */
export function SelBox({ l, sel }: { l: any; sel: string[] }) {
  return <input type="checkbox" aria-label={'Select ' + l.name} checked={sel.includes(l.id)} readOnly data-act={`selrow|${l.id}`} />;
}

/** Capacity chip: "At ceiling" or "N free" */
export function CapChip({ c }: { c: any }) {
  return c.full ? <Chip t="At ceiling" cls="s7" /> : <Chip t={c.left + ' free'} cls="s6" />;
}

/** prototype: agentOpts(ag, cur, n): agent picker cards with capacity bars; full agents are disabled */
export function AgentOpts({ ag, cur, n }: { ag: any[]; cur: string; n?: number }) {
  return (
    <div className="col g6">
      {ag.map((x) => {
        const c = eng.capInfo(x.id);
        const dis = c.left < (n || 1);
        const off = eng.todayStat(x.id) === 'On leave';
        return (
          <button key={x.id} type="button" className={'opt ' + (cur === x.id ? 'on' : '')}
            disabled={dis || undefined} style={dis ? { opacity: 0.55, cursor: 'not-allowed' } : undefined}
            data-act={dis ? undefined : `mset|to|${x.id}`}>
            <AvBox cls="sm" t={ini(x.name)} />
            <span style={{ flex: 1, minWidth: 0 }}>
              <span className="t">{x.name}</span>
              <span className="d" style={{ display: 'block' }}>
                {eng.teamName(x.team)} · {c.used} of {c.cap} leads{dis ? ' · no room' : ''}{off ? ' · on leave today' : ''}
              </span>
            </span>
            <Bar p={pct(c.used, c.cap)} cls={c.full ? 'bad' : ''} />
          </button>
        );
      })}
    </div>
  );
}

/** prototype: teamOpts(cur, exclude): team queue picker cards */
export function TeamOpts({ cur, exclude }: { cur: string; exclude?: string }) {
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

/** prototype: reasonFld(e, first): quick reason pills plus a free-text reason (UI.mf.why) */
export function ReasonFld({ e, first }: { e: any; first: boolean }) {
  const chips: string[] = first ? eng.RCHIPS0 : eng.RCHIPS;
  return (
    <Fld label="Reason" htmlFor="m_why" err={e.why} req hint="Always required. Saved in the lead history and the audit log.">
      <div className="row g6 wrap mb8">
        {chips.map((t) => <button key={t} type="button" className={'pill sm ' + (eng.UI.mf.why === t ? 'on' : '')} data-act={`mset|why|${t}`}>{t}</button>)}
      </div>
      <MTxa k="why" bad={!!e.why} ph="Or write your own reason" />
    </Fld>
  );
}
