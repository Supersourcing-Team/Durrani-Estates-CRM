/* "Who is working this project" card under the project detail for Manager and Admin (prototype: projPipeline(role, pr)). */
import React from 'react';
import { eng } from '../../engine';
import { BkChip, Card, Chip, Empty, LeadLinks, StageChip, Td, TempChip } from '../../ui';
import { nw } from './shared';

export function ProjPipeline({ role, pr }: { role: 'mgmt' | 'admin'; pr: any }) {
  const S = eng.S;
  const v = eng.UI.f.ppv || 'bk';
  const ids: string[] | null = role === 'mgmt' ? eng.teamIds() : null;
  const okA = (id: string) => !ids || ids.includes(id);
  const bks: any[] = S.bookings.filter((b: any) => b.project === pr.id && okA(b.agent)).sort((a: any, b: any) => (b.submitted || 0) - (a.submitted || 0));
  const lds: any[] = S.leads.filter((l: any) => l.shortlist.some((s: any) => s.p === pr.id) && !l.archived && okA(l.owner));
  const agents = [...new Set([...bks.map((b) => b.agent), ...lds.map((l) => l.owner)].filter(Boolean))]
    .map((id: string) => ({ id, l: lds.filter((x) => x.owner === id), b: bks.filter((x) => x.agent === id) }))
    .sort((a, b) => b.b.length - a.b.length || b.l.length - a.l.length);
  const bkGo = (b: any) => (role === 'admin' ? 'admin-booking-' : 'mgmt-booking-') + eng.bkP(b.id);
  const leadGo = (l: any) => `${role}-lead-${l.id}`;
  const agentGo = (id: string) => (role === 'admin' ? 'admin-user-' : 'mgmt-agent-') + id;

  const segs: [string, string, number][] = [['bk', 'Bookings', bks.length], ['ld', 'Leads shortlisting it', lds.length], ['ag', 'Agents', agents.length]];
  const seg = <div className="seg">{segs.map(([k, t, n]) => <button key={k} type="button" className={v === k ? 'on' : ''} data-act={`ui|ppv|${k}`}>{t} ({n})</button>)}</div>;

  let body: React.ReactNode;
  if (v === 'bk') {
    body = bks.length ? (
      <div className="tw">
        <table className="tbl">
          <thead><tr><th>Booking</th><th>Unit</th><th>Lead</th><th>Agent</th><th className="num">Price</th><th>Status</th></tr></thead>
          <tbody>
            {bks.map((b) => {
              const l = eng.leadById(b.lead);
              const sub = b.submitted ? eng.fd(b.submitted) : '';
              return (
                <tr key={b.id}>
                  <Td first l="Booking" className={nw(b.id + sub)}><a className="b" href={'#' + bkGo(b)} data-go={bkGo(b)}>{b.id}</a><div className="xs faint">{sub}</div></Td>
                  <Td l="Unit" className={nw(b.unit)}>{b.unit}</Td>
                  <Td l="Lead" className={nw(l ? l.name + 'LEAD-' + l.id : '-')}>
                    {l ? <><a href={'#' + leadGo(l)} data-go={leadGo(l)}>{l.name}</a><div className="xs faint"><LeadLinks text={'LEAD-' + l.id} /></div></> : '-'}
                  </Td>
                  <Td l="Agent" className={nw(eng.uname(b.agent), 'sm')}>{eng.uname(b.agent)}</Td>
                  <Td l="Price" className={nw(eng.mfull(b.price), 'num')}>{eng.mfull(b.price)}</Td>
                  <Td l="Status" className="nw"><BkChip s={b.status} /></Td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    ) : <Empty icn="file" t="No bookings yet" d="Bookings on this project show here." />;
  } else if (v === 'ld') {
    body = lds.length ? (
      <div className="tw">
        <table className="tbl">
          <thead><tr><th>Lead</th><th>Agent</th><th>Shortlist</th><th>Stage</th><th>Temp</th><th>Booked here</th></tr></thead>
          <tbody>
            {lds.map((l) => {
              const sl = l.shortlist.find((s: any) => s.p === pr.id);
              const b = bks.find((x) => x.lead === l.id);
              const more = l.shortlist.length > 1 ? l.shortlist.length + ' projects shortlisted' : '';
              const owner = l.owner ? eng.uname(l.owner) : 'Pool';
              return (
                <tr key={l.id}>
                  <Td first l="Lead" className={nw(l.name + 'LEAD-' + l.id)}><a className="b" href={'#' + leadGo(l)} data-go={leadGo(l)}>{l.name}</a><div className="xs faint"><LeadLinks text={'LEAD-' + l.id} /></div></Td>
                  <Td l="Agent" className={nw(owner, 'sm')}>{owner}</Td>
                  <Td l="Shortlist" className={nw((sl.primary ? 'First choice' : 'Also considering') + more)}>
                    {sl.primary ? <Chip t="First choice" cls="s3" dot={false} /> : <Chip t="Also considering" cls="s2" dot={false} />}
                    {more ? <div className="xs faint">{more}</div> : null}
                  </Td>
                  <Td l="Stage" className="nw"><StageChip s={l.stage} /></Td>
                  <Td l="Temp" className="nw"><TempChip t={l.temp} /></Td>
                  <Td l="Booked here" className="nw">{b ? <BkChip s={b.status} /> : <span className="faint">No</span>}</Td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    ) : <Empty icn="user" t="No leads have shortlisted it" d="Agents add projects to a lead from the catalogue." />;
  } else {
    body = agents.length ? (
      <div className="tw">
        <table className="tbl">
          <thead><tr><th>Agent</th><th>Team</th><th className="num">Leads shortlisting it</th><th className="num">Bookings</th><th className="num">Booked value</th></tr></thead>
          <tbody>
            {agents.map((x) => {
              const val = eng.mfull(eng.sum(x.b.filter((b) => ['approved', 'closed', 'pending'].includes(b.status)), (b: any) => b.price));
              const team = eng.teamName(eng.teamOf(x.id));
              return (
                <tr key={x.id}>
                  <Td first l="Agent" className={nw(eng.uname(x.id))}><a href={'#' + agentGo(x.id)} data-go={agentGo(x.id)}>{eng.uname(x.id)}</a></Td>
                  <Td l="Team" className={nw(team, 'sm')}>{team}</Td>
                  <Td l="Leads shortlisting it" className="num nw">{x.l.length}</Td>
                  <Td l="Bookings" className="num nw">{x.b.length}</Td>
                  <Td l="Booked value" className={nw(val, 'num')}>{val}</Td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    ) : <Empty icn="users" t="No agents yet" d="Nobody is working this project." />;
  }

  return (
    <div className="mt16">
      <Card title="Who is working this project" bare>
        <div style={{ padding: '0 20px 14px' }}>{seg}</div>
        {body}
      </Card>
    </div>
  );
}
