/* A13 Note calculator (prototype route agent-cncalc, optional lead id param). */
import React from 'react';
import { eng, mfull, fd, nf } from '../../engine';
import { Card, Empty, Fld, Icon, Kpi, NumInput, Pager, PgHead, pv } from '../../ui';
import type { ScreenComp } from '../../app/types';
import { AmtHelp, PfFixed } from './parts';
import { resolveCnCalc } from './cnBootstrap';

export const CnCalc: ScreenComp = ({ params }) => {
  const S = eng.S, UI = eng.UI;
  const l = params[0] ? eng.leadById(params[0]) : null;
  const cur: string = pv('cur', l && l.cn ? l.cn.cur : 'AED');
  const amt = +pv('amt', l && l.cn ? l.cn.amount : '') || 0;
  const e = UI.pf._e || {};
  const c = amt > 0 ? resolveCnCalc(amt) : null;
  const pg = Math.min(+pv('pg', 1), 3);
  const msg = c
    ? `Hi${l ? ' ' + l.name.split(' ')[0] : ''}, here is the Durrani Convertible Note: invest ${mfull(amt, cur)} for ${c.n} months. You receive ${mfull(c.m, cur)} every month (${S.set.cn.rate}%), ${mfull(c.total, cur)} in total, and your ${mfull(amt, cur)} comes back at maturity. Total return ${mfull(c.ret, cur)}.`
    : '';

  return (
    <>
      <PgHead t="Note calculator" sub="Show a client exactly what a note pays. Terms are fixed by Admin."
        right={l ? <a className="btn" href={`#agent-lead-${l.id}`} data-go={`agent-lead-${l.id}`}>Back to {l.name}</a> : null} />
      <div className="grid g12">
        <div className="col g16">
          <Card title="Inputs">
            <div className="col">
              <Fld label="Investment amount" htmlFor="p_amt" err={e.amt}>
                <NumInput k="amt" d={amt || ''} cur={cur} bad={!!e.amt} />
                <AmtHelp amt={amt} cur={cur} />
              </Fld>
              <Fld label="Currency">
                <div className="seg">
                  {['AED', 'INR'].map((x) => <button key={x} type="button" className={cur === x ? 'on' : ''} data-act={`pfset|cur|${x}`}>{x}</button>)}
                </div>
              </Fld>
              <Fld label="Tenure" hint="Fixed by Admin"><PfFixed k="ten" d={S.set.cn.tenure + ' months'} /></Fld>
              <Fld label="Monthly return" hint="Fixed by Admin. Principal is paid back at maturity."><PfFixed k="rt" d={S.set.cn.rate + '%'} /></Fld>
            </div>
          </Card>
          {c ? (
            <Card title="Share with client">
              <div className="sm" style={{ whiteSpace: 'pre-wrap' }}>{msg}</div>
              <div className="row g6 wrap mt16">
                <button className="btn" type="button" data-act={'copy|' + msg}><Icon n="copy" s={14} />Copy text</button>
                {l ? (
                  <>
                    <button className="btn" type="button" data-act={`cnlog|${l.id}|${amt}|${cur}`}><Icon n="msg" s={14} />Log as sent</button>
                    <a className="btn pri" href={`#agent-cnapp-${l.id}`} data-go={`agent-cnapp-${l.id}`}>Open application</a>
                  </>
                ) : null}
              </div>
            </Card>
          ) : null}
        </div>
        <div className="col g16">
          {c ? (
            <>
              <div className="grid g3 keep">
                <Kpi l="Monthly payout" n={mfull(c.m, cur)} d={'For ' + c.n + ' months'} />
                <Kpi l="Total payouts" n={mfull(c.total, cur)} d="Over the term" />
                <Kpi l="Total return" n={mfull(c.ret, cur)} d="Including principal" />
              </div>
              {cur === 'INR' ? <div className="muted sm">About AED {nf(Math.round(eng.toAed(amt, 'INR')))} at {S.set.fx} INR per AED (rate set by Admin).</div> : null}
              <Card title="Payout schedule" bare>
                <div className="tw"><table className="tbl">
                  <thead><tr><th>Month</th><th>Date</th><th className="num">Payout</th><th className="num">Running total</th></tr></thead>
                  <tbody>
                    {c.rows.slice((pg - 1) * 12, pg * 12).map((r: any) => (
                      <tr key={r.n}><td>{r.n}</td><td>{fd(r.due)}</td><td className="num">{nf(r.amt)}</td><td className="num">{nf(r.cum)}</td></tr>
                    ))}
                    <tr><td colSpan={2}><b>Principal returned at maturity</b></td><td className="num"><b>{pg === 3 ? nf(amt) : ''}</b></td><td></td></tr>
                  </tbody>
                </table></div>
                <Pager total={c.n} per={12} pageKey="pgx" cur={pg} />
              </Card>
            </>
          ) : <Card title=""><Empty icn="percent" t="Enter an amount" d="The monthly payout and full schedule appear here." /></Card>}
        </div>
      </div>
    </>
  );
};
