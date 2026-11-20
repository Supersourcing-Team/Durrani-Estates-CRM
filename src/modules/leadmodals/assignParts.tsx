/*
 * Pickers shared by the assignment pop-ups (prototype helpers agentOpts, teamOpts, reasonFld in the
 * "assignment model" block of all.js). Exported so other assignment screens can reuse them.
 */
import React from 'react';
import { eng, ini, renderOverlay } from '../../engine';
import { AvBox, Bar, Fld, Icon, MInput, MTxa, mv } from '../../ui';

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

/** Admin, target = an agent: Team dropdown narrows the Agent dropdown (agents with no room are disabled). */
export function AgentPicker({ ag, e }: { ag: any[]; e: Record<string, string> }) {
  const f = eng.UI.mf;
  const tm: string = f.tm || '';
  const list = tm ? ag.filter((x: any) => x.team === tm) : ag;
  return (
    <div className="frm">
      <Fld label="Team" htmlFor="m_tm">
        <select className="sel" id="m_tm" value={tm} onChange={(ev) => {
          f.tm = ev.target.value;
          if (f.to && !(ev.target.value ? ag.filter((x: any) => x.team === ev.target.value) : ag).some((x: any) => x.id === f.to)) f.to = '';
          renderOverlay();
        }}>
          <option value="">All teams</option>
          {eng.S.teams.map((t: any) => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
      </Fld>
      <Fld label="Agent" htmlFor="m_to" req err={e.to}>
        <select className={'sel ' + (e.to ? 'bad' : '')} id="m_to" value={f.to || ''} onChange={(ev) => {
          f.to = ev.target.value;
          if (f._e) delete f._e.to;
          renderOverlay();
        }}>
          <option value="">Choose an agent</option>
          {list.map((x: any) => {
            const c = eng.capInfo(x.id);
            const off = eng.todayStat(x.id) === 'On leave';
            return <option key={x.id} value={x.id} disabled={c.left < 1 || undefined}>{x.name} · {eng.teamName(x.team)} · {c.left < 1 ? 'no room' : c.left + ' free'}{off ? ' · on leave today' : ''}</option>;
          })}
        </select>
      </Fld>
    </div>
  );
}

const LEADS_SHOW = 40;

/** Leads that can be picked in the assign drawers: Unassigned (pool + team queues) or All active. */
export function assignLeadCandidates(scope: string, q: string): any[] {
  const s = q.trim().toLowerCase();
  return eng.S.leads
    .filter((l: any) => !l.archived && !l.dnd && !l.wrong && (scope === 'all' ? true : !l.owner))
    .filter((l: any) => !s || (l.name + ' ' + l.phone + ' ' + l.id + ' ' + (l.camp || '')).toLowerCase().includes(s))
    .sort((a: any, b: any) => (b.created || 0) - (a.created || 0));
}

/** "Leads" field of the Assign lead drawers: scope toggle, search and a ticked checklist (UI.mf.lids = "id,id"). */
export function LeadsField({ e }: { e: Record<string, string> }) {
  const f = eng.UI.mf;
  const scope: string = f.scope || 'unassigned';
  const picked = String(f.lids || '').split(',').filter(Boolean);
  const all = assignLeadCandidates(scope, String(f.q || ''));
  // keep already-ticked leads visible even when they fall outside the scope / search
  const shown = [...picked.map((id) => eng.leadById(id)).filter((l: any) => l && !all.some((x: any) => x.id === l.id)), ...all].slice(0, LEADS_SHOW);
  const where = (l: any) => (l.owner ? eng.uname(l.owner) : l.team ? eng.teamName(l.team) + ' queue' : 'Pool');
  const n = picked.length;
  return (
    <Fld label="Leads" req err={e.lids}>
      <div className="row g6 mb8">
        <div className="seg">
          {([['unassigned', 'Unassigned'], ['all', 'All active']] as [string, string][]).map(([k, t]) =>
            <button key={k} type="button" className={scope === k ? 'on' : ''} data-act={`mset|scope|${k}`}>{t}</button>)}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}><MInput k="q" ph="Search name, phone or lead ID" /></div>
      </div>
      <div className="card flat" style={{ maxHeight: 270, overflow: 'auto', padding: 0 }}>
        {shown.length ? shown.map((l: any) => (
          <div key={l.id} className="row g6 sb" role="checkbox" aria-checked={picked.includes(l.id)} tabIndex={0}
            data-act={`alpick|${l.id}`} style={{ padding: '10px 14px', borderBottom: '1px solid var(--bd-s)', cursor: 'pointer' }}>
            <span className="row g6" style={{ minWidth: 0 }}>
              <input type="checkbox" checked={picked.includes(l.id)} readOnly tabIndex={-1} aria-label={'Select ' + l.name} />
              <span className="trunc"><b>{l.name}</b> <span className="muted sm">LEAD-{l.id} · {l.camp}</span></span>
            </span>
            <span className="muted sm nowrap">{where(l)}</span>
          </div>
        )) : <div className="muted sm" style={{ padding: 14 }}>No leads match.</div>}
      </div>
      <span className="hint">
        {n ? `${n} selected` : 'Nothing selected yet'} · {all.length > LEADS_SHOW ? `showing the first ${LEADS_SHOW}, search to find others` : `${all.length} lead${all.length === 1 ? '' : 's'}`}
      </span>
    </Fld>
  );
}