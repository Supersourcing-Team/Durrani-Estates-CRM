/* AD People & Teams (prototype route admin-people, tabs People and Teams). */
import React from 'react';
import { eng } from '../../engine';
import { Av, Btn, Card, Chip, PgHead, Search, Sel, Tabs } from '../../ui';
import type { ScreenComp } from '../../app/types';

const UStat = ({ s }: { s: string }) => <Chip t={eng.USTAT[s][0]} cls={eng.USTAT[s][1]} />;

/** One card per team: manager, counts and its agents. */
function TeamCard({ t }: { t: any }) {
  const ag: any[] = eng.agentsOf(t.id);
  return (
    <div className="card">
      <div className="row sb wrap">
        <div><div className="h2">{t.name}</div><div className="muted sm">{t.office} · {t.region}</div></div>
        <button className="btn s" type="button" data-open={`team-form|${t.id}`}>Edit</button>
      </div>
      <div className="mt16 sm">
        <div className="row sb" style={{ padding: '6px 0' }}><span className="muted">Manager</span><a href={'#admin-user-' + t.mgr} data-go={'admin-user-' + t.mgr}>{eng.uname(t.mgr)}</a></div>
        <div className="row sb" style={{ padding: '6px 0' }}><span className="muted">Agents</span><b>{ag.length}</b></div>
        <div className="row sb" style={{ padding: '6px 0' }}><span className="muted">Active leads</span><b>{eng.teamLeads(t.id).length}</b></div>
      </div>
      <div className="col mt16">
        {ag.length ? ag.map((a) => (
          <a key={a.id} className="row sb" style={{ padding: '8px 0', borderTop: '1px solid var(--bd-s)', textDecoration: 'none', color: 'inherit' }}
            href={'#admin-user-' + a.id} data-go={'admin-user-' + a.id}>
            <span className="row g6"><Av n={a.name} cls="sm" />{a.name}</span><UStat s={a.status} />
          </a>
        )) : <p className="muted sm">No agents yet.</p>}
      </div>
    </div>
  );
}

export const AdminPeople: ScreenComp = ({ params }) => {
  const S = eng.S, UI = eng.UI;
  const tab = params[0] === 'teams' ? 'teams' : 'users';
  const hdr = (
    <>
      <PgHead t="People & Teams" sub="Create accounts, assign teams, slabs and lead ceilings."
        right={tab === 'users' ? <Btn cls="pri" open="user-form" ic="plus">Add user</Btn> : <Btn cls="pri" open="team-form" ic="plus">Add team</Btn>} />
      <Tabs cur={tab} items={[{ k: 'users', l: 'People', go: 'admin-people', n: S.users.length }, { k: 'teams', l: 'Teams', go: 'admin-people-teams', n: S.teams.length }]} />
    </>
  );
  if (tab === 'teams') return <>{hdr}<div className="grid g2">{S.teams.map((t: any) => <TeamCard key={t.id} t={t} />)}</div></>;

  const q = (UI.f.upq || '').toLowerCase(), r = UI.f.upr || 'all', s = UI.f.ups || 'all';
  const l: any[] = S.users.filter((u: any) => (r === 'all' || u.role === r) && (s === 'all' || u.status === s) && (!q || (u.name + u.email + u.emp).toLowerCase().includes(q)));
  return (
    <>
      {hdr}
      <div className="row g6 wrap mb16 fbar">
        <div style={{ flex: 1, minWidth: 220 }}><Search bind="upq" val={UI.f.upq} ph="Search name, email or employee ID" /></div>
        <Sel bind="upr" cur={r} opts={[['all', 'All roles'], ['agent', 'Agents'], ['mgmt', 'Management'], ['admin', 'Admin']]} />
        <Sel bind="ups" cur={s} opts={[['all', 'Any status'], ['active', 'Active'], ['invited', 'Invited'], ['removed', 'Deactivated']]} />
      </div>
      <Card bare>
        <div className="tw">
          <table className="tbl">
            <thead><tr><th>Person</th><th>Employee ID</th><th>Role</th><th>Team</th><th>Slab</th><th className="num">Leads</th><th>Status</th></tr></thead>
            <tbody>
              {l.map((u) => (
                <tr key={u.id} className="click" data-go={'admin-user-' + u.id}>
                  <td>
                    <div className="row g6">
                      <Av n={u.name} cls="sm" />
                      <div>
                        <a className="b" href={'#admin-user-' + u.id} data-go={'admin-user-' + u.id} style={{ color: 'var(--tx)', textDecoration: 'none' }}>{u.name}</a>
                        <div className="xs faint">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="sm">{u.emp}</td>
                  <td className="sm">{eng.ROLEN[u.role]}{u.tag ? ' · ' + u.tag : ''}</td>
                  <td className="sm">{u.team ? eng.teamName(u.team) : <span className="faint">None</span>}</td>
                  <td className="sm">{u.role === 'agent' ? (u.slab ? S.set.slabs.find((x: any) => x.id === u.slab).name : <span className="dangertx">None</span>) : null}</td>
                  <td className="num">{u.role === 'agent' ? <>{eng.capInfo(u.id).used}<span className="faint">/{eng.capOf(u)}</span></> : null}</td>
                  <td><UStat s={u.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
};
