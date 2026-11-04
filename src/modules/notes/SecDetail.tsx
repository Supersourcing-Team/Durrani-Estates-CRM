/* A17 Secondary request (prototype routes agent-sec / mgmt-sec / admin-sec: secPage(role, p) plus the 15c-deals "Where this request is" box). */
import React from 'react';
import { eng, money, mfull } from '../../engine';
import { Bn, Btn, Card, Chip, Empty, Icon, Kvs } from '../../ui';
import { HistList, type Role } from './parts';

/** 15c-deals layer: progress of the request through its flow. */
function SecFlowBox({ s, role }: { s: any; role: Role }) {
  const st: string[] = eng.SECFLOW[s.kind];
  const i = ['Lost', 'Declined'].includes(s.status) ? -1 : Math.max(0, st.indexOf(s.status));
  const lab = s.kind === 'seller' ? ['Requested', 'Live listing', 'Matched', 'Negotiation', 'Closed'] : ['Requested', 'Accepted', 'Matched', 'Negotiation', 'Closed'];
  return (
    <div className="card mb16">
      <div className="row sb wrap mb8">
        <span className="ov">Where this {s.kind === 'seller' ? 'listing' : 'request'} is</span>
        <button type="button" className="btn lnk xs" data-open="sec-info">How it works</button>
      </div>
      {i < 0 ? <Bn kind="warn" title={s.status} body="This request is closed without a deal." />
        : <div className="hstp">{lab.map((x, k) => <div key={x} className={'hs ' + (k < i ? 'done' : k === i ? 'cur' : '')}>{x}</div>)}</div>}
      {s.status === 'Requested' ? (
        <p className="muted sm mt8">{role === 'admin' ? 'Review it to publish it' + (s.kind === 'seller' ? ' as a live listing' : '') + '.' : 'Waiting for Admin to review. Nothing to do yet.'}</p>
      ) : null}
    </div>
  );
}

export function SecDetail({ params, role = 'agent' }: { params: string[]; role?: Role }) {
  const s = eng.secById(eng.secF(params[0]));
  if (!s) return <Card title=""><Empty icn="store" t="Request not found" d="No request with that ID." act={<Btn t="Back" go={role + '-secondary'} cls="pri" />} /></Card>;
  const owner = s.owner === eng.me().id;

  return (
    <>
      <div className="card mb16">
        <div className="row sb wrap top g16">
          <div>
            <div className="row g6 wrap">
              <h1 className="h1" style={{ fontSize: 28 }}>{s.id}</h1>
              <Chip t={s.kind === 'buyer' ? 'Buyer request' : 'Seller listing'} cls={s.kind === 'buyer' ? 's1' : 's4'} />
              <Chip t={s.status} cls={eng.SECS[s.status] || 's2'} />
            </div>
            <div className="muted mt8">{s.prop} · {s.loc}</div>
          </div>
          <div className="row g6 wrap">
            {owner && role === 'agent' ? <button className="btn pri" type="button" data-open={`sec-status|${s.id}`}>Update status</button> : null}
            {role === 'admin' && s.status === 'Requested' ? <button className="btn pri" type="button" data-open={`sec-accept|${s.id}`}>Review request</button> : null}
            {role === 'admin' && s.status !== 'Requested' ? <button className="btn" type="button" data-open={`sec-accept|${s.id}`}>Reassign</button> : null}
          </div>
        </div>
      </div>
      <SecFlowBox s={s} role={role} />
      <div className="grid g21">
        <div className="col g16">
          <Card title="Details">
            <Kvs items={[
              ['Name', s.name], ['Raised by', eng.uname(s.raised)],
              [s.kind === 'seller' ? 'Asking price' : 'Budget', s.kind === 'seller' ? mfull(s.ask, s.cur) : money(s.budget[0], s.cur) + ' to ' + money(s.budget[1], s.cur)],
              ['Location', s.loc], ['Assigned to', s.owner ? eng.uname(s.owner) : 'Not assigned yet'], ['Commission', s.comm ? s.comm + '%' : 'Set when accepted'],
            ]} />
          </Card>
          {s.docs.length ? (
            <Card title="Documents">
              {s.docs.map((d: string, i: number) => (
                <div key={i} className="slot up mb8"><span className="ic"><Icon n="file" s={16} /></span><div className="m"><div className="b">{d}</div></div></div>
              ))}
            </Card>
          ) : null}
          {s.matches.length ? (
            <Card title="Matches">
              {s.matches.map((m: string) => {
                const x = eng.secById(m), go = role + '-sec-' + eng.secP(m);
                return (
                  <a key={m} className="row sb" style={{ padding: '8px 0', textDecoration: 'none', color: 'inherit' }} href={'#' + go} data-go={go}>
                    <span><b>{m}</b> · {x.prop}</span><Icon n="chev" s={14} />
                  </a>
                );
              })}
            </Card>
          ) : null}
        </div>
        <div className="col g16"><Card title="History"><HistList arr={s.hist} /></Card></div>
      </div>
    </>
  );
}
