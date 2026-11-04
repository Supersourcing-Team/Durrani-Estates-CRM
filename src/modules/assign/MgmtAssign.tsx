/* M13 Lead Assignment (prototype route mgmt-assign, final version in 15b-leads.js: team queue / all team leads). */
import React from 'react';
import { eng, pct, rel } from '../../engine';
import { Bar, Bn, Btn, Card, Empty, LeadLinks, PgHead, Search, Sel, StageChip, Tabs, TempChip, paged } from '../../ui';
import { LeadFlag, hasLeadFlag } from '../leads/leadBits';
import { CapChip, SelBox, selIds } from './parts';
import type { ScreenComp } from '../../app/types';

export const MgmtAssign: ScreenComp = ({ params }) => {
  const UI = eng.UI;
  const u = eng.me();
  const ag: any[] = eng.myTeam();
  const tab = params && params[0] === 'all' ? 'all' : 'queue';
  const qn: any[] = eng.queueLeads(u.team);
  const sel_ = selIds();

  const hdr = (
    <>
      <PgHead t="Lead Assignment" sub="Place new leads from your team queue and move leads between your agents." right={<>
        <Btn open="assign-info" ic="info">How it works</Btn>
        {tab === 'queue' ? <Btn open="autodist" ic="zap" dis={!qn.length}>Spread evenly</Btn> : null}
        <Btn cls="pri" open="bulk-reassign" ic="repeat" dis={!sel_.length}>{`${tab === 'queue' ? 'Assign' : 'Reassign'} ${sel_.length || ''} selected`}</Btn>
      </>} />
      {/* agent capacity cards: click filters the all-leads tab by that agent */}
      <div className="grid g3 keep mb16 capscroll">
        {ag.map((a) => {
          const c = eng.capInfo(a.id);
          return (
            <button key={a.id} type="button" className="card cardbtn" data-act={`mafilter|${a.id}`}>
              <div className="row sb"><span className="b">{a.name}</span><CapChip c={c} /></div>
              <Bar p={pct(c.used, c.cap)} cls={c.full ? 'bad' : ''} />
              <div className="xs muted mt8">{c.used} of {c.cap} leads{eng.todayStat(a.id) === 'On leave' ? ' · On leave' : ''}</div>
            </button>
          );
        })}
      </div>
      <Tabs cur={tab} items={[
        { k: 'queue', l: 'Team queue', go: 'mgmt-assign', n: qn.length, i: 'layers' },
        { k: 'all', l: 'All team leads', go: 'mgmt-assign-all', n: eng.teamLeads(u.team).length, i: 'users' },
      ]} />
    </>
  );

  if (tab === 'queue') {
    const P = paged(qn, 'mq', 12);
    return (
      <>
        {hdr}
        <div className="mt16">
          {qn.length ? <Bn kind="info" title={qn.length + ' new lead' + (qn.length > 1 ? 's' : '') + ' waiting for an agent'}
            body="Admin or a routing rule sent these to your team. Select leads and assign them, or spread them evenly." /> : null}
        </div>
        <Card bare cls="mt16">
          {qn.length ? (
            <>
              <div className="tw">
                <table className="tbl">
                  <thead><tr><th className="sel"></th><th>Lead</th><th>Campaign</th><th>Came in</th><th>Why it is here</th><th></th></tr></thead>
                  <tbody>
                    {P.items.map((l: any) => (
                      <tr key={l.id}>
                        <td><SelBox l={l} sel={sel_} /></td>
                        <td>
                          <a className="b" href={`#mgmt-lead-${l.id}`} data-go={`mgmt-lead-${l.id}`}>{l.name}</a>
                          <div className="xs faint"><LeadLinks text={`LEAD-${l.id} · ${l.phone}`} /></div>
                        </td>
                        <td className="sm">{l.camp}</td>
                        <td className="sm">{rel(l.assigned || l.created)}</td>
                        <td className="sm"><LeadLinks text={(l.own[0] || {}).reason || 'Sent by Admin'} /></td>
                        <td className="tr"><button className="btn s pri" type="button" data-open={`reassign|${l.id}`}>Assign</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {P.foot}
            </>
          ) : <Empty icn="check" t="Your team queue is empty" d="New leads Admin sends to your team land here first." />}
        </Card>
      </>
    );
  }

  /* All team leads: filter by agent, sort, grouped by agent when sorted that way */
  const q = (UI.f.qa || '').toLowerCase();
  const from = UI.f.fa || 'all';
  const sort = UI.f.sa || 'agent';
  const ls: any[] = eng.teamLeads(u.team).filter((l: any) => (from === 'all' || l.owner === from) && (!q || (l.name + l.id).toLowerCase().includes(q)));
  const tOrd = ['hot', 'warm', 'cold', ''];
  const so: Record<string, (a: any, b: any) => number> = {
    agent: (a, b) => eng.uname(a.owner).localeCompare(eng.uname(b.owner)) || eng.prio(a) - eng.prio(b),
    prio: (a, b) => eng.prio(a) - eng.prio(b),
    recent: (a, b) => (b.lastAct || b.assigned || 0) - (a.lastAct || a.assigned || 0),
    temp: (a, b) => tOrd.indexOf(a.temp || '') - tOrd.indexOf(b.temp || ''),
  };
  ls.sort(so[sort]);
  const P = paged(ls, 'as', 15);
  let lastO: any = null;

  return (
    <>
      {hdr}
      <div className="row g6 wrap mb16 mt16 fbar">
        <div style={{ flex: 1, minWidth: 200 }}><Search bind="qa" val={UI.f.qa} ph="Search leads" /></div>
        <Sel bind="fa" cur={from} opts={[['all', 'All agents'], ...ag.map((a) => [a.id, a.name] as [string, string])]} />
        <Sel bind="sa" cur={sort} opts={[['agent', 'Sort: by agent'], ['prio', 'Sort: most urgent'], ['temp', 'Sort: hottest'], ['recent', 'Sort: newest']]} />
        {sel_.length ? <button className="btn s" type="button" data-act="ui|sel|">Clear {sel_.length} selected</button> : null}
      </div>
      <Card bare>
        {ls.length ? (
          <>
            <div className="tw">
              <table className="tbl">
                <thead><tr><th className="sel"></th><th>Lead</th><th>Agent</th><th>Stage</th><th>Temp</th><th>Status</th><th></th></tr></thead>
                <tbody>
                  {P.items.map((l: any) => {
                    const grp = sort === 'agent' && l.owner !== lastO;
                    lastO = l.owner;
                    return (
                      <React.Fragment key={l.id}>
                        {grp ? <tr className="grp"><td colSpan={7}>{eng.uname(l.owner)} · {eng.leadsOf(l.owner).length} leads</td></tr> : null}
                        <tr>
                          <td><SelBox l={l} sel={sel_} /></td>
                          <td>
                            <a className="b" href={`#mgmt-lead-${l.id}`} data-go={`mgmt-lead-${l.id}`}>{l.name}</a>
                            <div className="xs faint"><LeadLinks text={'LEAD-' + l.id} /></div>
                          </td>
                          <td>{eng.uname(l.owner)}</td>
                          <td><StageChip s={l.stage} /></td>
                          <td><TempChip t={l.temp} /></td>
                          <td>{hasLeadFlag(l) ? <LeadFlag l={l} /> : <span className="faint">OK</span>}</td>
                          <td className="tr"><button className="btn s" type="button" data-open={`reassign|${l.id}`}>Reassign</button></td>
                        </tr>
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {P.foot}
          </>
        ) : <Empty icn="repeat" t="No leads" d="Nothing matches." />}
      </Card>
    </>
  );
};
