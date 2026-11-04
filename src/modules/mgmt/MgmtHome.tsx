/* M08 Manager Home Dashboard (prototype route mgmt-home, plus the later "team queue" banner wrapper). */
import React from 'react';
import { eng, money, pct, fd, rel } from '../../engine';
import { Av, Bar, Bn, Card, Kpi, PgHead } from '../../ui';
import type { ScreenComp } from '../../app/types';
import { TodayChip } from './parts';

export const MgmtHome: ScreenComp = () => {
  const S = eng.S, NOW = eng.NOW();
  const u = eng.me(), ag: any[] = eng.myTeam(), tg = S.set.targets.mgmt;
  const ids: string[] = eng.teamIds();
  const leads: any[] = eng.teamLeads(u.team);
  const risk = leads.filter((l) => eng.leadRisk(l).state === 'risk');
  const esc: any[] = eng.teamEsc().filter((e: any) => e.status === 'open');
  const lv = S.leave.filter((l: any) => l.status === 'pending' && ids.includes(l.user));
  const flag = S.activity.filter((a: any) => a.flag && ids.includes(a.u));
  const rev = eng.teamRev(), bc = eng.sum(ag, (a: any) => eng.bookingsCount(a.id));
  const queue = eng.queueLeads(u.team).length;

  const alerts: React.ReactNode[] = [];
  if (esc.length) alerts.push(<Bn key="esc" kind="warn" title={esc.length + ' escalation' + (esc.length > 1 ? 's' : '') + ' waiting'} body="Agents need a decision from you."
    acts={<a className="btn pri s" href="#mgmt-leads-esc" data-go="mgmt-leads-esc">Review</a>} />);
  if (lv.length) alerts.push(<Bn key="lv" kind="info" title={lv.length + ' leave request' + (lv.length > 1 ? 's' : '') + ' to approve'}
    acts={<a className="btn s" href="#mgmt-leave" data-go="mgmt-leave">Open</a>} />);
  if (flag.length) alerts.push(<Bn key="fl" kind="warn" title={flag.length + ' call duration mismatch' + (flag.length > 1 ? 'es' : '')} body="Logged time differs a lot from the app estimate."
    acts={<a className="btn s" href="#mgmt-activity" data-go="mgmt-activity">Check</a>} />);

  return (
    <>
      <PgHead t={eng.teamName(u.team)} sub={fd(NOW) + ' · ' + ag.length + ' agents · ' + leads.length + ' active leads'} />
      {queue ? (
        <div className="mb16">
          <Bn kind="info" title={queue + ' new lead' + (queue > 1 ? 's' : '') + ' in your team queue'} body="Assign them to an agent so the clock starts."
            acts={<a className="btn pri s" href="#mgmt-assign" data-go="mgmt-assign">Assign now</a>} />
        </div>
      ) : null}
      <div className="grid g4c keep mb16">
        <Kpi l="Team revenue" n={money(rev)} d={'Target ' + money(tg.rev) + ' · ' + pct(rev, tg.rev) + '%'} go="mgmt-performance" />
        <Kpi l="Bookings" n={<>{bc}<span className="faint" style={{ fontSize: 16 }}> / {tg.book}</span></>} d="Approved or closed" go="mgmt-bookings" />
        <Kpi l="At risk" n={String(risk.length)} d="Leads near auto-return" go="mgmt-leads" cls={risk.length ? 'warn' : ''} />
        <Kpi l="Escalations" n={String(esc.length)} d="Open with you" go="mgmt-leads-esc" />
      </div>
      {alerts.length ? <div className="col mb16">{alerts}</div> : null}
      <div className="grid g21">
        <div className="col g16">
          <Card title="Team today" bare>
            <div className="tw">
              <table className="tbl">
                <thead><tr><th>Agent</th><th>Today</th><th className="num">Leads</th><th className="num">Hot</th><th className="num">At risk</th><th className="num">Revenue</th><th></th></tr></thead>
                <tbody>
                  {ag.map((a) => {
                    const ls: any[] = eng.leadsOf(a.id), c = eng.capInfo(a.id);
                    const nr = ls.filter((l) => eng.leadRisk(l).state === 'risk').length;
                    return (
                      <tr key={a.id} className="click" data-go={`mgmt-agent-${a.id}`}>
                        <td><div className="row g6"><Av n={a.name} cls="sm" /><span className="b">{a.name}</span></div></td>
                        <td><TodayChip id={a.id} /></td>
                        <td className="num">{c.used}<span className="faint">/{c.cap}</span></td>
                        <td className="num">{ls.filter((l) => l.temp === 'hot').length}</td>
                        <td className={'num ' + (nr ? 'dangertx b' : '')}>{nr}</td>
                        <td className="num">{money(eng.revOf(a.id))}</td>
                        <td className="tr"><a className="btn s" href={`#mgmt-agent-${a.id}`} data-go={`mgmt-agent-${a.id}`}>View</a></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
        <div className="col g16">
          <Card title="Team target">
            <div className="row sb sm"><span>Revenue</span><b>{money(rev)} of {money(tg.rev)}</b></div>
            <Bar p={pct(rev, tg.rev)} />
            <div className="row sb sm mt16"><span>Bookings</span><b>{bc} of {tg.book}</b></div>
            <Bar p={pct(bc, tg.book)} />
          </Card>
          <Card title="Latest activity" right={<a className="btn s" href="#mgmt-activity" data-go="mgmt-activity">All</a>}>
            {S.activity.filter((a: any) => ids.includes(a.u)).slice(0, 5).map((a: any, i: number) => (
              <div key={i} className="row sb" style={{ padding: '8px 0', borderBottom: '1px solid var(--bd-s)' }}>
                <span className="sm"><b>{eng.uname(a.u).split(' ')[0]}</b> · {a.k}{a.out ? ' · ' + a.out : ''}</span>
                <span className="xs faint">{rel(a.t)}</span>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </>
  );
};
