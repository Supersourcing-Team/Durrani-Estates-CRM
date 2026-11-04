/* A12 Convertible Notes (prototype route agent-cn). */
import React from 'react';
import { eng, money, mfull, fds } from '../../engine';
import { Card, Chip, Empty, Icon, Kpi, LeadLinks, PgHead } from '../../ui';
import type { ScreenComp } from '../../app/types';

const NEXT_STEP: Record<string, string> = {
  Qualified: 'Share information', 'Information shared': 'Confirm interest', Interested: 'Start documents',
  Documents: 'Collect documents', 'Admin review': 'Waiting for Admin',
};

export const CnList: ScreenComp = () => {
  const S = eng.S;
  const u = eng.me();
  const notes: any[] = S.notes.filter((n: any) => n.agent === u.id);
  const pipe: any[] = eng.leadsOf(u.id).filter((l: any) => l.track === 'cn' && l.cn);
  const by2 = (cur: string) => notes.filter((n) => n.cur === cur).reduce((s, n) => s + n.principal, 0);
  const nx: any = notes.map(eng.nextPay).filter(Boolean).sort((a: any, b: any) => a.due - b.due)[0];
  const aed = by2('AED'), inr = by2('INR');
  const held = aed || inr ? <>{aed ? money(aed) : ''}{aed && inr ? <br /> : null}{inr ? money(inr, 'INR') : ''}</> : 'None';

  return (
    <>
      <PgHead t="Convertible Notes"
        sub={`Fixed terms: ${S.set.cn.tenure} months, ${S.set.cn.rate}% a month, principal back at maturity. Clients can invest in INR or AED.`}
        right={<a className="btn pri" href="#agent-cncalc" data-go="agent-cncalc"><Icon n="percent" s={16} />Open calculator</a>} />
      <div className="grid g4c keep mb16">
        <Kpi l="Active notes" n={String(notes.length)} d="Under your name" />
        <Kpi l="Principal held" n={held} d="Kept per currency" />
        <Kpi l="Applications in progress" n={String(pipe.filter((l) => l.cn.stage !== 'Active').length)} d="Click a row below" />
        <Kpi l="Next payout" n={nx ? fds(nx.due) : 'None'} d="Cheques held by Admin" />
      </div>
      <Card title="Applications in progress" bare cls="mb16">
        {pipe.length ? (
          <div className="tw"><table className="tbl">
            <thead><tr><th>Client</th><th>Stage</th><th className="num">Amount</th><th>Next step</th><th></th></tr></thead>
            <tbody>
              {pipe.map((l) => (
                <tr key={l.id} className="click" data-go={`agent-cnapp-${l.id}`}>
                  <td><b>{l.name}</b><div className="xs faint"><LeadLinks text={'LEAD-' + l.id} /></div></td>
                  <td><Chip t={l.cn.stage} cls="s4" /></td>
                  <td className="num">{mfull(l.cn.amount, l.cn.cur)}</td>
                  <td className="sm">{NEXT_STEP[l.cn.stage] || ''}</td>
                  <td className="tr"><a className="btn s" href={`#agent-cnapp-${l.id}`} data-go={`agent-cnapp-${l.id}`}>Open</a></td>
                </tr>
              ))}
            </tbody>
          </table></div>
        ) : <Empty icn="clip" t="No applications" d="Qualify a lead for Convertible Notes to start one." />}
      </Card>
      <Card title="Active notes" bare>
        {notes.length ? (
          <div className="tw"><table className="tbl">
            <thead><tr><th>Note</th><th>Client</th><th className="num">Principal</th><th>Next payout</th><th>Status</th></tr></thead>
            <tbody>
              {notes.map((n) => {
                const np = eng.nextPay(n), s = eng.noteStat(n), go = 'agent-cnnote-' + eng.noteP(n.id);
                return (
                  <tr key={n.id} className="click" data-go={go}>
                    <td><a className="b" href={'#' + go} data-go={go}>{n.id}</a></td>
                    <td>{n.name}</td>
                    <td className="num">{mfull(n.principal, n.cur)}</td>
                    <td>{np ? fds(np.due) + ' · ' + mfull(np.amt, n.cur) : 'Matured'}</td>
                    <td><Chip t={s[0]} cls={s[1]} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table></div>
        ) : <Empty icn="clip" t="No active notes yet" d="Notes appear here after Admin activates them." />}
      </Card>
    </>
  );
};
