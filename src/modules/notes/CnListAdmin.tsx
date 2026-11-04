/* Admin Convertible Notes (prototype route admin-cn, plus the 15c-deals layer: "All applications" card and "How notes work"). */
import React from 'react';
import { eng, mfull, fd, nf, cap1, sum, rel } from '../../engine';
import { Bn, Card, Chip, Empty, Kpi } from '../../ui';
import type { ScreenComp } from '../../app/types';
import { CnAppRows } from './parts';

const DUE_CLS: Record<string, string> = { due: 's5', overdue: 's7', bounced: 's7' };

export const CnListAdmin: ScreenComp = () => {
  const S = eng.S;
  const CNSTEPS: string[] = eng.CNSTEPS;
  const apps: any[] = S.leads.filter((l: any) => l.cn && l.cn.stage === 'Admin review' && l.cn.adminState === 'pending');
  const due: { n: any; p: any }[] = [];
  S.notes.forEach((n: any) => n.payouts.forEach((p: any) => { if (['due', 'overdue', 'bounced'].includes(p.status)) due.push({ n, p }); }));
  const tot = (cur: string) => sum(S.notes.filter((n: any) => n.cur === cur), (n: any) => n.principal);
  const all: any[] = S.leads.filter((l: any) => l.cn && l.cn.stage !== 'Active' && !l.archived)
    .sort((a: any, b: any) => CNSTEPS.indexOf(b.cn.stage) - CNSTEPS.indexOf(a.cn.stage));

  return (
    <>
      <div className="pghead">
        <div>
          <h1 className="h1">Convertible Notes</h1>
          <p className="sub">Applications to approve, active notes and payouts that need you.</p>
          <p className="sub"><button className="btn lnk s" type="button" data-open="cn-info">How notes work</button></p>
        </div>
        <div className="row g6 wrap"></div>
      </div>
      <div className="grid g4c keep mb16">
        <Kpi l="Applications" n={String(apps.length)} d="Waiting for you" cls={apps.length ? 'warn' : ''} go="admin-review-cn" />
        <Kpi l="Active notes" n={String(S.notes.length)} d={mfull(tot('INR'), 'INR') + ' · ' + mfull(tot('AED'), 'AED')} />
        <Kpi l="Payouts due" n={String(due.filter((x) => x.p.status !== 'bounced').length)} d="Mark paid once sent" />
        <Kpi l="Bounced" n={String(due.filter((x) => x.p.status === 'bounced').length)} d="Need action" cls={due.some((x) => x.p.status === 'bounced') ? 'warn' : ''} />
      </div>
      {apps.length ? (
        <div className="col mb16">
          {apps.map((l) => (
            <Bn key={l.id} kind="info" title={'Application: ' + l.name + ' · ' + mfull(l.cn.amount, l.cn.cur)}
              body={'Submitted by ' + eng.uname(l.owner) + ' ' + rel(l.cn.submitted)}
              acts={<button className="btn pri s" type="button" data-open={`cn-review|${l.id}`}>Review</button>} />
          ))}
        </div>
      ) : null}
      {/* 15c-deals: every application in progress */}
      <Card title={'All applications (' + all.length + ')'} bare cls="mb16">
        {all.length ? <CnAppRows ls={all} role="admin" /> : <Empty icn="clip" t="No applications" d="Nothing in progress." />}
      </Card>
      {due.length ? (
        <Card title="Payouts that need action" bare cls="mb16">
          <div className="tw"><table className="tbl">
            <thead><tr><th>Note</th><th>Client</th><th>#</th><th>Due</th><th className="num">Amount</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {due.map(({ n, p }) => {
                const go = 'admin-cnnote-' + eng.noteP(n.id);
                return (
                  <tr key={n.id + '-' + p.n}>
                    <td><a className="b" href={'#' + go} data-go={go}>{n.id}</a></td>
                    <td className="sm">{n.name}</td>
                    <td>{p.n}</td>
                    <td className="sm">{fd(p.due)}</td>
                    <td className="num">{mfull(p.amt, n.cur)}</td>
                    <td><Chip t={cap1(p.status)} cls={DUE_CLS[p.status]} /></td>
                    <td className="tr">
                      {p.status === 'bounced'
                        ? <button className="btn s pri" type="button" data-open={`payout-fix|${n.id}|${p.n}`}>Resolve</button>
                        : <button className="btn s pri" type="button" data-open={`payout-pay|${n.id}|${p.n}`}>Mark paid</button>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table></div>
        </Card>
      ) : null}
      <Card title="Active notes" bare>
        {S.notes.length ? (
          <div className="tw"><table className="tbl">
            <thead><tr><th>Note</th><th>Client</th><th>Agent</th><th className="num">Principal</th><th>Next payout</th><th>Status</th></tr></thead>
            <tbody>
              {S.notes.map((n: any) => {
                const s = eng.noteStat(n), np = eng.nextPay(n), go = 'admin-cnnote-' + eng.noteP(n.id);
                return (
                  <tr key={n.id} className="click" data-go={go}>
                    <td><a className="b" href={'#' + go} data-go={go}>{n.id}</a></td>
                    <td>{n.name}<div className="xs faint">{n.client}</div></td>
                    <td className="sm">{eng.uname(n.agent)}</td>
                    <td className="num">{mfull(n.principal, n.cur)}</td>
                    <td className="sm">{np ? fd(np.due) + ' · ' + nf(np.amt) : 'Matured'}</td>
                    <td><Chip t={s[0]} cls={s[1]} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table></div>
        ) : <Empty icn="clip" t="No active notes" d="Approved applications become notes here." />}
      </Card>
    </>
  );
};
