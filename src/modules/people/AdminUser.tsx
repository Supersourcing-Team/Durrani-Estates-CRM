/* AD Person detail (prototype route admin-user, plus the "Sign-ins and locations" card from the IP location file). */
import React from 'react';
import { eng, ini, money, rel, fts } from '../../engine';
import { AvBox, Btn, Card, Chip, Empty, Kpi, Kvs, LeadLinks } from '../../ui';
import type { ScreenComp } from '../../app/types';
import { LeadTable } from '../leads/LeadTable';
import { GeoFlag } from './parts';

/** Recent sign-ins with their IP location; each row opens ip-detail. */
function SignIns({ u }: { u: any }) {
  const gs: any[] = (eng.S.geo || []).filter((g: any) => g.u === u.id).sort((a: any, b: any) => b.at - a.at).slice(0, 6);
  return (
    <div className="mt16">
      <Card title="Sign-ins and locations" bare right={<a className="btn s" href="#admin-hr-loc" data-go="admin-hr-loc">All locations</a>}>
        {gs.length ? (
          <div className="tw">
            <table className="tbl">
              <thead><tr><th>Time</th><th>Event</th><th>Location</th><th>IP</th><th>Check</th></tr></thead>
              <tbody>
                {gs.map((g) => (
                  <tr key={g.id} className="click" data-open={`ip-detail|${g.id}`}>
                    <td className="sm">{fts(g.at)}</td>
                    <td className="sm">{g.ev}</td>
                    <td className="sm">{g.city}, {g.cc}</td>
                    <td className="sm"><span className="mono">{g.ip}</span></td>
                    <td>{eng.geoIssue(g) ? <GeoFlag g={g} /> : <span className="faint">OK</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <Empty icn="pin" t="No sessions yet" d="Appears after their first sign-in." />}
      </Card>
    </div>
  );
}

export const AdminUser: ScreenComp = ({ params }) => {
  const S = eng.S;
  const u = eng.userById(params[0]);
  if (!u) return <Card><Empty icn="user" t="Person not found" d="No account with that ID." act={<Btn t="Back" go="admin-people" cls="pri" />} /></Card>;

  const ag = u.role === 'agent';
  const ls: any[] = ag ? eng.leadsOf(u.id) : [];
  const c = ag ? eng.capInfo(u.id) : null;
  const sl = ag ? eng.slabOf(u) : null;
  const nx = ag && u.slab ? eng.nextSlab(u) : null;
  const au: any[] = S.audit.filter((a: any) => a.actor === u.id || a.entity === u.name).slice(0, 6);
  const st = eng.USTAT[u.status];

  const account: [React.ReactNode, React.ReactNode][] = [
    ['Role', eng.ROLEN[u.role]], ['Team', u.team ? eng.teamName(u.team) : 'None'], ['Office', u.office || 'None'],
    ...(ag ? [['Commission slab', sl ? sl.name : 'None'], ['Lead ceiling', String(eng.capOf(u))], ['Tag', u.tag ? u.tag : 'None']] as [string, string][] : []),
  ];

  return (
    <>
      <div className="card mb16">
        <div className="row g16 wrap top">
          <AvBox cls="lg" t={ini(u.name)} />
          <div style={{ flex: 1, minWidth: 200 }}>
            <div className="row g6 wrap"><h1 className="h1" style={{ fontSize: 28 }}>{u.name}</h1><Chip t={st[0]} cls={st[1]} /></div>
            <div className="muted mt8">{eng.ROLEN[u.role]}{u.team ? ' · ' + eng.teamName(u.team) : ''} · {u.emp}</div>
            <div className="muted sm mt8">{u.email} · {u.phone}</div>
          </div>
          <div className="row g6 wrap">
            <button className="btn" type="button" data-open={`user-form|${u.id}`}>Edit</button>
            {u.status === 'invited' ? <button className="btn" type="button" data-act={`resendinv|${u.id}`}>Resend invite</button> : null}
            {u.status === 'active' && u.id !== eng.me().id ? <button className="btn dng" type="button" data-open={`deactivate|${u.id}`}>Deactivate</button> : null}
            {u.status === 'removed' ? <button className="btn pri" type="button" data-act={`reactivate|${u.id}`}>Reactivate</button> : null}
          </div>
        </div>
      </div>
      {ag ? (
        <div className="grid g4c keep mb16">
          <Kpi l="Active leads" n={c.used + ' / ' + c.cap} />
          <Kpi l="Revenue" n={money(eng.revOf(u.id))} d={eng.bookingsCount(u.id) + ' bookings'} />
          <Kpi l="Slab" n={sl ? sl.name : 'None'} d={sl ? sl.rate + '% of brokerage' : 'Commission blocked'} cls={sl ? '' : 'warn'} />
          <Kpi l="Speed to lead" n={((S.speed && S.speed[u.id]) || '-') + ' min'} d={'Target ' + S.set.speed} />
        </div>
      ) : null}
      <div className="grid g21">
        <div className="col g16">
          {ag ? (
            <Card title="Leads" bare>
              {ls.length
                ? <LeadTable list={ls.sort((a, b) => eng.prio(a) - eng.prio(b))} role="admin" pageKey="aul" per={8} />
                : <Empty icn="user" t="No active leads" d="Assign some from the pool." act={<Btn t="Assignments" go="admin-assign" cls="pri" />} />}
            </Card>
          ) : (
            <Card title="Access">
              <p className="muted sm">{u.role === 'admin' ? 'Admins see everything and approve bookings, notes and requests.' : 'Managers see their team only and cannot approve bookings.'}</p>
            </Card>
          )}
        </div>
        <div className="col g16">
          <Card title="Account"><Kvs items={account} /></Card>
          {nx ? <Card title="Next slab"><p className="sm muted">{money(nx.gap)} more revenue to reach {nx.slab.name}. Slabs are assigned by Admin, so this is information only.</p></Card> : null}
          <Card title="Recent changes">
            {au.length ? au.map((a, i) => (
              <div key={i} style={{ padding: '8px 0', borderBottom: '1px solid var(--bd-s)' }}>
                <div className="sm"><b><LeadLinks text={a.action} /></b> · <LeadLinks text={a.entity} /></div>
                <div className="xs faint">{rel(a.at)}</div>
              </div>
            )) : <p className="muted sm">No changes recorded.</p>}
          </Card>
        </div>
      </div>
      {u.role !== 'admin' ? <SignIns u={u} /> : null}
    </>
  );
};
