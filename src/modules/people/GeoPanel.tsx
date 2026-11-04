/* AD Locations panel (prototype: geoPanel(), shown on admin-hr-loc). Sign-in and punch locations from IP. */
import React from 'react';
import { eng, fds, fhm } from '../../engine';
import { Bn, Card, Chip, Empty, Icon, Kpi, Sel } from '../../ui';
import { GeoFlag } from './parts';

export function GeoPanel() {
  const S = eng.S, UI = eng.UI, NOW = eng.NOW();
  const who = UI.f.gw || 'all', fl = UI.f.gf || 'all';
  const geo: any[] = S.geo || [];
  const l = geo.filter((g) => (who === 'all' || g.u === who) && (fl === 'all' || eng.geoIssue(g))).sort((a, b) => b.at - a.at);
  const flags: any[] = eng.geoFlags();
  return (
    <>
      <div className="mb16">
        <Bn kind="info" title="How IP location works"
          body="When someone signs in or punches in, the server reads the IP address of their device and looks up the city and network. It is approximate: mobile data can show the carrier's city, and a VPN hides the real place. Treat a flag as a reason to ask, not as proof. Staff are told about this in the attendance policy." />
      </div>
      <div className="grid g4c keep mb16">
        <Kpi l="Sessions today" n={String(geo.filter((g) => eng.sameDay(g.at, NOW)).length)} />
        <Kpi l="Flagged, last 7 days" n={String(flags.length)} d="VPN, other city or new device" cls={flags.length ? 'warn' : ''} act="ui|gf|flag" />
        <Kpi l="Office cities" n={Object.values(eng.OFFICE).join(', ')} d="From the team office" />
        <Kpi l="People tracked" n={String(new Set(geo.map((g) => g.u)).size)} d="Agents and managers" />
      </div>
      <div className="row g6 wrap mb16 fbar">
        <Sel bind="gw" cur={who} opts={[['all', 'Everyone'], ...S.users.filter((u: any) => ['agent', 'mgmt'].includes(u.role)).map((u: any) => [u.id, u.name + (u.role === 'mgmt' ? ' (Manager)' : '')] as [string, string])]} />
        <div className="seg">
          <button type="button" className={fl === 'all' ? 'on' : ''} data-act="ui|gf|all">All</button>
          <button type="button" className={fl === 'flag' ? 'on' : ''} data-act="ui|gf|flag">Flagged</button>
        </div>
      </div>
      <Card bare>
        {l.length ? (
          <div className="tw">
            <table className="tbl">
              <thead><tr><th>Time</th><th>Person</th><th>Event</th><th>Location</th><th>IP address</th><th>Network</th><th>Device</th><th>Check</th></tr></thead>
              <tbody>
                {l.map((g) => (
                  <tr key={g.id} className="click" data-open={`ip-detail|${g.id}`}>
                    <td className="sm"><b>{fhm(g.at)}</b><div className="xs faint">{eng.sameDay(g.at, NOW) ? 'Today' : fds(g.at)}</div></td>
                    <td>{eng.uname(g.u)}<div className="xs faint">{eng.roleTeam(g.u)}</div></td>
                    <td className="sm">{g.ev}</td>
                    <td><Icon n="pin" s={13} /> {g.city}, {g.cc}</td>
                    <td className="sm"><span className="mono">{g.ip}</span></td>
                    <td className="sm">{g.isp}</td>
                    <td className="sm">{g.dev}</td>
                    <td>{eng.geoIssue(g) ? <GeoFlag g={g} /> : g.ok ? <Chip t="Explained" cls="s6" dot={false} /> : <span className="faint">OK</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <Empty icn="pin" t="No sessions" d="Nothing matches this filter." />}
      </Card>
    </>
  );
}
