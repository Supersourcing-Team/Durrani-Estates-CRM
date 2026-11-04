/*
 * AD-L3-01 Spread leads evenly (prototype modal autodist, final version in 15b-leads.js).
 * Manager: from the team queue to team agents. Admin: from the pool to agents, or to team queues.
 * The plan comes from the engine's distPlan(); distex toggles an agent, distsave saves.
 */
import React from 'react';
import { eng } from '../../engine';
import { Bn, Chip, Fld, MCheck, MOpt, MSel, Modal } from '../../ui';
import { selIds } from './parts';
import type { ModalComp } from '../../app/types';

/** "Which leads": whole source or the table selection */
function ScopePick({ allT, srcN, sel, selD }: { allT: string; srcN: number; sel: number; selD: string }) {
  return (
    <Fld label="Which leads">
      <div className="optgrid">
        <MOpt k="scope" v="all" t={allT} d={srcN + ' leads'} />
        {sel ? <MOpt k="scope" v="sel" t="Selected leads only" d={sel + selD} /> : (
          <div className="opt" style={{ opacity: 0.6, cursor: 'default' }}>
            <span><span className="t">Selected leads only</span><span className="d" style={{ display: 'block' }}>Select leads in the table first</span></span>
          </div>
        )}
      </div>
    </Fld>
  );
}

/** Admin only: send to agents directly or to team queues */
function SendTo({ to }: { to: string }) {
  return (
    <Fld label="Send to">
      <div className="seg">
        {([['agents', 'Agents directly'], ['teams', 'Team queues']] as [string, string][]).map(([k, t]) =>
          <button key={k} type="button" className={to === k ? 'on' : ''} data-act={`mset|to|${k}`}>{t}</button>)}
      </div>
    </Fld>
  );
}

const Foot = ({ label, dis }: { label: string; dis: boolean }) => (
  <>
    <button className="btn" type="button" data-act="mclose">Cancel</button>
    <button className="btn pri" type="button" data-act="distsave" disabled={dis || undefined}>{label}</button>
  </>
);

export const AutodistModal: ModalComp = () => {
  const S = eng.S, f = eng.UI.mf;
  const role = eng.me().role;
  const sel_ = selIds();
  const src: any[] = role === 'admin' ? eng.poolLeads() : eng.queueLeads(eng.me().team);
  const leads: any[] = f.scope === 'sel' ? sel_.map(eng.leadById).filter((l: any) => l && !l.owner) : src;

  /* Admin -> team queues: round-robin preview per team */
  if (role === 'admin' && f.to === 'teams') {
    const n = S.teams.length;
    const per: [any, number][] = S.teams.map((t: any, i: number) => [t, Math.floor(leads.length / n) + (i < leads.length % n ? 1 : 0)]);
    return (
      <Modal title="Spread leads evenly" size="w" foot={<Foot label={`Send ${leads.length} to team queues`} dis={!leads.length} />}>
        <ScopePick allT="Whole pool" srcN={src.length} sel={sel_.length} selD=" selected" />
        <SendTo to={f.to} />
        <div className="tw">
          <table className="tbl">
            <thead><tr><th>Team</th><th>Manager</th><th className="num">In queue now</th><th className="num">Will get</th></tr></thead>
            <tbody>
              {per.map(([t, k]) => (
                <tr key={t.id}><td>{t.name}</td><td>{eng.uname(t.mgr)}</td><td className="num">{eng.queueLeads(t.id).length}</td><td className="num"><b>+{k}</b></td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </Modal>
    );
  }

  /* To agents: plan, per-agent preview and include toggles */
  const P = eng.distPlan(f, leads);
  const left = leads.length - P.plan.length;
  const all: any[] = role === 'admin' ? eng.agentsAll().filter((a: any) => a.status === 'active' && (f.tm === 'all' || a.team === f.tm)) : eng.myTeam();
  const ex = String(f.ex || '').split(',');

  return (
    <Modal title="Spread leads evenly" size="w" foot={<Foot label={`Assign ${P.plan.length} now`} dis={!P.plan.length} />}>
      <ScopePick allT={role === 'admin' ? 'Whole pool' : 'Whole team queue'} srcN={src.length} sel={sel_.length} selD=" selected in the table" />
      {role === 'admin' ? (
        <div className="frm">
          <SendTo to={f.to} />
          <Fld label="Agents from" htmlFor="m_tm">
            <MSel k="tm" blank={false} opts={[['all', 'All teams'], ...S.teams.map((t: any) => [t.id, t.name] as [string, string])]} />
          </Fld>
        </div>
      ) : null}
      <Fld label="How to split">
        <div className="optgrid">
          <MOpt k="how" v="equal" t="Same number each" d="Everyone gets the same count, plus or minus one" />
          <MOpt k="how" v="load" t="Balance the load" d="Agents with fewer active leads get more" />
        </div>
      </Fld>
      <label className="row g6 sm mb8"><MCheck k="skipleave" /> Skip agents on leave today</label>
      <div className="tw">
        <table className="tbl">
          <thead><tr><th>Include</th><th>Agent</th><th className="num">Active now</th><th className="num">Will get</th><th className="num">After</th></tr></thead>
          <tbody>
            {all.map((a) => {
              const c = eng.capInfo(a.id);
              const inc = P.ag.some((x: any) => x.id === a.id);
              const n = P.add[a.id] || 0;
              return (
                <tr key={a.id}>
                  <td><input type="checkbox" checked={inc} readOnly disabled={!(ex.includes(a.id) || inc) || undefined} data-act={`distex|${a.id}`} aria-label={'Include ' + a.name} /></td>
                  <td>{a.name}{eng.todayStat(a.id) === 'On leave' ? <>{' '}<Chip t="On leave" cls="s4" dot={false} /></> : null}</td>
                  <td className="num">{c.used} / {c.cap}</td>
                  <td className="num"><b>{inc ? '+' + n : '-'}</b></td>
                  <td className="num">{c.used + n} / {c.cap}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <Bn kind={left ? 'warn' : 'info'}
        body={`${P.plan.length} of ${leads.length} lead${leads.length === 1 ? '' : 's'} placed.${left ? ' ' + left + ' stay ' + (role === 'admin' ? 'in the pool' : 'in the queue') + ' because the chosen agents are full.' : ''} Each agent is told. The reason saved is "Spread evenly".`} />
    </Modal>
  );
};
