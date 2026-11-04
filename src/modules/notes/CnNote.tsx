/* A15 Note detail (prototype routes agent-cnnote / admin-cnnote: notePage(role, p); mgmt-cnnote adds a team check). */
import React from 'react';
import { eng, mfull, fd, fds, nf, cap1, sum } from '../../engine';
import { Bn, Btn, Card, Chip, Dl, Empty, Kpi, paged } from '../../ui';
import type { Role } from './parts';

const PAY_CLS: Record<string, string> = { paid: 's6', due: 's5', upcoming: 's2', overdue: 's7', bounced: 's7' };
const PDC_CLS: Record<string, string> = { cleared: 's6', held: 's2', bounced: 's7' };
const FILTERS: [string, string][] = [['all', 'All'], ['paid', 'Paid'], ['due', 'Due'], ['upcoming', 'Upcoming'], ['bounced', 'Bounced'], ['overdue', 'Overdue']];

export function CnNote({ params, role = 'agent' }: { params: string[]; role?: Role }) {
  const n = eng.noteById(eng.noteF(params[0]));
  if (role === 'mgmt' && n && eng.teamOf(n.agent) !== eng.me().team) return <Card title=""><Empty icn="lock" t="Not your team" d="This note belongs to another team." act={<Btn t="Back" go="mgmt-cn" cls="pri" />} /></Card>;
  if (!n) return <Card title=""><Empty icn="clip" t="Note not found" d="No note with that ID." act={<Btn t="Back" go={role + '-cn'} cls="pri" />} /></Card>;
  if (role === 'agent' && n.agent !== eng.me().id) return <Card title=""><Empty icn="lock" t="Not your note" d="Only the agent who sold it can open it." act={<Btn t="Back" go="agent-cn" cls="pri" />} /></Card>;

  const s = eng.noteStat(n);
  const paid = n.payouts.filter((p: any) => p.status === 'paid');
  const np = eng.nextPay(n);
  const f = eng.UI.f.nf2 || 'all';
  const rows = n.payouts.filter((x: any) => f === 'all' || x.status === f);
  const P = paged<any>(rows, 'np', 12);
  const mat = eng.addMonths(n.start, n.tenure);
  const bad = n.payouts.find((x: any) => x.status === 'bounced');

  return (
    <>
      <div className="card mb16">
        <div className="row sb wrap top g16">
          <div>
            <div className="row g6 wrap"><h1 className="h1" style={{ fontSize: 28 }}>{n.id}</h1><Chip t={s[0]} cls={s[1]} /><Chip t="Active" cls="s6" /></div>
            <div className="muted mt8">{n.name} · Client {n.client} · Agent {eng.uname(n.agent)}</div>
          </div>
          <div className="row g6">{role === 'admin' ? <button className="btn" type="button" data-open={`cn-edit|${n.id}`}>Edit</button> : null}</div>
        </div>
      </div>
      {bad ? (
        <div className="mb16">
          <Bn kind="err" title={'Payout ' + bad.n + ' bounced'}
            body={role === 'agent' ? 'Admin is resolving this with the client. Do not promise a payment date.' : 'The cheque did not clear. Re-present or arrange a transfer.'}
            acts={role === 'admin' ? <button className="btn pri s" type="button" data-open={`payout-fix|${n.id}|${bad.n}`}>Resolve</button> : null} />
        </div>
      ) : null}
      <div className="grid g4c keep mb16">
        <Kpi l="Principal" n={mfull(n.principal, n.cur)} d={n.tenure + ' months at ' + n.rate + '%'} />
        <Kpi l="Monthly payout" n={mfull(Math.round(n.principal * n.rate / 100), n.cur)} d="By post-dated cheque" />
        <Kpi l="Paid so far" n={mfull(sum(paid, (x: any) => x.amt), n.cur)} d={paid.length + ' of ' + n.tenure + ' payouts'} />
        <Kpi l="Maturity" n={fd(mat)} d="Principal returned" />
      </div>
      <div className="grid g21">
        <div className="col g16">
          <Card title="Payout schedule" bare>
            <div className="pills" style={{ padding: '12px 20px' }}>
              {FILTERS.map(([k, t]) => <button key={k} type="button" className={'pill ' + (f === k ? 'on' : '')} data-act={`ui|nf2|${k}`}>{t}</button>)}
            </div>
            <div className="tw"><table className="tbl">
              <thead><tr><th>#</th><th>Due</th><th className="num">Amount</th><th>Status</th><th>Reference</th></tr></thead>
              <tbody>
                {P.items.map((x) => (
                  <tr key={x.n}><td>{x.n}</td><td>{fd(x.due)}</td><td className="num">{nf(x.amt)}</td><td><Chip t={cap1(x.status)} cls={PAY_CLS[x.status]} /></td><td className="sm">{x.ref || ''}</td></tr>
                ))}
              </tbody>
            </table></div>
            {P.foot}
          </Card>
        </div>
        <div className="col g16">
          <Card title="Note details">
            <Dl items={[['Client ID', n.client], ['Started', fd(n.start)], ['Currency', n.cur], ['Next payout', np ? fd(np.due) + ' · ' + nf(np.amt) : 'Matured'], ['Cheque register', n.pdc.length + ' cheques']]} />
          </Card>
          <Card title="Cheque register">
            <div className="col g6 sm">
              {n.pdc.slice(0, 6).map((c: any) => (
                <div key={c.no} className="row sb"><span>{c.no}</span><span className="muted">{fds(c.due)}</span><Chip t={cap1(c.status)} cls={PDC_CLS[c.status]} /></div>
              ))}
              <div className="faint xs">Showing first 6 of {n.pdc.length}</div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
