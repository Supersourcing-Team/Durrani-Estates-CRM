/* Note application for managers and Admin (prototype routes mgmt-cnapp / admin-cnapp: cnAppPage(role, p), 15c-deals). */
import React from 'react';
import { eng, mfull, ft } from '../../engine';
import { Bn, Btn, Card, Chip, Dl, Empty, Icon, LeadLinks, PgHead } from '../../ui';
import { CnDocLine, type Role } from './parts';

/** prototype: cnDocsCard(role, l). Document slots with view / verify / reject. */
function CnDocsCard({ role, l }: { role: Role; l: any }) {
  const CNDOCS: [string, string][] = eng.CNDOCS, CNDS = eng.CNDS;
  const cn = l.cn;
  const can = ['mgmt', 'admin'].includes(role) && ['Documents', 'Admin review'].includes(cn.stage);
  const v = CNDOCS.filter(([k]) => eng.cnDS(cn, k) === 'verified').length;
  return (
    <Card title={'Documents · ' + v + ' of ' + CNDOCS.length + ' verified'}>
      <div className="col g6">
        {CNDOCS.map(([k, t]) => {
          const s = eng.cnDS(cn, k);
          return (
            <div key={k} className={'slot ' + (s === 'verified' ? 'okd' : '')}>
              <span className="ic"><Icon n={s === 'verified' ? 'check' : s === 'rejected' ? 'x' : 'file'} s={16} /></span>
              <div className="m"><div className="b">{t}</div><div className="xs faint"><CnDocLine cn={cn} k={k} /></div></div>
              <div className="row g6" style={{ flexWrap: 'nowrap' }}>
                <Chip t={CNDS[s][0]} cls={CNDS[s][1]} dot={false} />
                {s !== 'missing' ? <button className="btn s" type="button" data-open={`cn-docview|${l.id}|${k}`}><Icon n="eye" s={14} />View</button> : null}
                {can && s === 'pending' ? (
                  <>
                    <button className="btn s pri" type="button" data-act={`cnv|${l.id}|${k}`}>Verify</button>
                    <button className="btn s" type="button" data-open={`cn-docrej|${l.id}|${k}`}>Reject</button>
                  </>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
      {can ? <p className="muted sm mt8">{role === 'mgmt' ? 'You can check documents first. Admin does the final check and approves.' : 'Approve unlocks when all six are verified.'}</p> : null}
    </Card>
  );
}

export function CnAppReview({ params, role = 'admin' }: { params: string[]; role?: Role }) {
  const S = eng.S;
  const CNSTEPS: string[] = eng.CNSTEPS;
  const l = eng.leadById(params[0]);
  const back = role + '-cn';
  if (!l || !l.cn) return <Card title=""><Empty icn="clip" t="Application not found" d="This lead has no Convertible Note application." act={<Btn t="Back" go={back} cls="pri" />} /></Card>;
  if (role === 'mgmt' && eng.teamOf(l.owner) !== eng.me().team) return <Card title=""><Empty icn="lock" t="Not your team" d="This application belongs to another team." act={<Btn t="Back" go={back} cls="pri" />} /></Card>;

  const cn = l.cn;
  const si = Math.max(0, CNSTEPS.indexOf(cn.stage));
  const ev: any[] = l.ev.filter((x: any) => /Convertible|note|Note/.test(x.txt)).sort((a: any, b: any) => b.t - a.t);
  const lg = role + '-lead-' + l.id;

  return (
    <>
      <PgHead t="Note application"
        sub={<><a href={'#' + lg} data-go={lg}>{l.name} · LEAD-{l.id}</a> · agent {eng.uname(l.owner)}</>}
        right={<>
          <button className="btn" type="button" data-open="cn-info"><Icon n="info" s={16} />How notes work</button>
          {role === 'admin' && cn.stage === 'Admin review' ? <button className="btn pri" type="button" data-open={`cn-review|${l.id}`}>Approve or send back</button> : null}
        </>} />
      <div className="card mb16">
        <div className="hstp">{CNSTEPS.map((s, i) => <div key={s} className={'hs ' + (i < si ? 'done' : i === si ? 'cur' : '')}>{s}</div>)}</div>
      </div>
      {cn.stage === 'Admin review' ? (
        <div className="mb16">
          <Bn kind={role === 'admin' ? 'warn' : 'info'} title={role === 'admin' ? 'Waiting for your decision' : 'With Admin'}
            body={'Submitted ' + ft(cn.submitted) + '.' + (role === 'mgmt' ? ' You can check documents now. Admin decides.' : '')} />
        </div>
      ) : null}
      {cn.adminState === 'changes' ? <div className="mb16"><Bn kind="warn" title="Sent back to the agent" body={<LeadLinks text={cn.adminNote || ''} />} /></div> : null}
      <div className="grid g21">
        <div className="col g16"><CnDocsCard role={role} l={l} /></div>
        <div className="col g16">
          <Card title="Terms">
            <Dl items={[
              ['Amount', mfull(cn.amount, cn.cur)], ['Tenure', cn.tenure + ' months'], ['Monthly return', S.set.cn.rate + '%'],
              ['Monthly payout', mfull(Math.round(cn.amount * S.set.cn.rate / 100), cn.cur)], ['Principal', 'Returned at maturity'],
              ['Payout method', 'Post-dated cheques, one a month'],
            ]} />
          </Card>
          <Card title="History">
            {ev.length ? (
              <div className="col g6 sm">
                {ev.map((x, i) => (
                  <div key={i}><div><LeadLinks text={x.txt} /></div><div className="xs faint">{ft(x.t)}{x.by ? ' · ' + eng.uname(x.by) : ''}</div></div>
                ))}
              </div>
            ) : <div className="muted sm">Nothing yet.</div>}
          </Card>
        </div>
      </div>
    </>
  );
}
