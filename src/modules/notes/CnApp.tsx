/* A14 Note application (prototype route agent-cnapp, plus the 15c-deals layer that adds the rejected-documents banner). */
import React from 'react';
import { eng, mfull, ft } from '../../engine';
import { Bn, Btn, Card, Empty, Icon, Kvs, LeadLinks, PgHead } from '../../ui';
import type { ScreenComp } from '../../app/types';
import { CnDocLine } from './parts';

const STEPS = ['Qualified', 'Information shared', 'Interested', 'Documents', 'Admin review', 'Active'];

export const CnApp: ScreenComp = ({ params }) => {
  const S = eng.S;
  const CNDOCS: [string, string][] = eng.CNDOCS;
  const l = eng.leadById(params[0]);
  if (!l || l.owner !== eng.me().id || !l.cn) {
    return <Card title=""><Empty icn="clip" t="Application not available" d="This lead has no Convertible Note application, or it is not yours." act={<Btn t="Back" go="agent-cn" cls="pri" />} /></Card>;
  }
  const cn = l.cn;
  const si = Math.max(0, STEPS.indexOf(cn.stage));
  const have = CNDOCS.filter(([k]) => cn[k]).length;
  const all = have === CNDOCS.length;
  const rej = CNDOCS.filter(([k]) => eng.cnDS(cn, k) === 'rejected');

  const act = ({
    Qualified: <button className="btn pri" type="button" data-open={`cn-share|${l.id}`}><Icon n="send" s={16} />Share information</button>,
    'Information shared': <button className="btn pri" type="button" data-open={`cn-commit|${l.id}`}>Client wants to proceed</button>,
    Interested: <button className="btn pri" type="button" data-act={`cnstart|${l.id}`}>Start documents</button>,
    Documents: <button className="btn pri" type="button" data-act={`cnsubmit|${l.id}`} disabled={!all || undefined}>Submit to Admin</button>,
  } as Record<string, React.ReactNode>)[cn.stage] || null;

  const showDocs = ['Documents', 'Admin review'].includes(cn.stage) || cn.stage === 'Interested';

  return (
    <>
      <PgHead t="Note application" sub={<LeadLinks text={l.name + ' · LEAD-' + l.id} />}
        right={<><a className="btn" href={`#agent-cncalc-${l.id}`} data-go={`agent-cncalc-${l.id}`}>Calculator</a>{act}</>} />
      <div className="card mb16">
        <div className="stp" style={{ flexDirection: 'row', overflow: 'auto', gap: 0 }}>
          {STEPS.map((s, i) => (
            <div key={s} className={'hs ' + (i < si ? 'done' : i === si ? 'cur' : '')}
              style={{ flex: 1, minWidth: 110, textAlign: 'center', fontSize: 12, position: 'relative', paddingTop: 20, color: i <= si ? 'var(--tx)' : 'var(--tx3)', fontWeight: i === si ? 600 : 400 }}>
              <span style={{ position: 'absolute', top: 2, left: '50%', transform: 'translateX(-50%)', width: 12, height: 12, borderRadius: '50%', background: i < si ? 'var(--bd-ok)' : i === si ? 'var(--brand)' : 'var(--bd-strong)' }} />
              {s}
            </div>
          ))}
        </div>
      </div>
      {cn.adminState === 'changes' ? <div className="mb16"><Bn kind="warn" title="Admin sent this back" body={cn.adminNote || ''} /></div> : null}
      {cn.stage === 'Admin review' ? <div className="mb16"><Bn kind="info" title="With Admin" body={'Submitted ' + ft(cn.submitted) + '. You will be told when it is approved or returned. Nothing more to do.'} /></div> : null}
      {rej.length ? (
        <div className="mb16">
          <Bn kind="err" title={rej.length + ' document' + (rej.length > 1 ? 's' : '') + ' rejected'}
            body={rej.map(([k, t], i) => <React.Fragment key={k}>{i ? <br /> : null}{t + ': ' + cn.dv[k].why}</React.Fragment>)} />
        </div>
      ) : null}
      <div className="grid g2">
        <Card title="Terms">
          <Kvs items={[
            ['Amount', mfull(cn.amount, cn.cur)], ['Tenure', cn.tenure + ' months'], ['Monthly return', S.set.cn.rate + '%'],
            ['Monthly payout', mfull(Math.round(cn.amount * S.set.cn.rate / 100), cn.cur)], ['Principal', 'Returned at maturity'],
            ['Payout method', 'Post-dated cheques, one per month'],
          ]} />
        </Card>
        <Card title={'Documents (' + have + ' of ' + CNDOCS.length + ')'}>
          {showDocs ? (
            <>
              <div className="col">
                {CNDOCS.map(([k, t]) => (
                  <div key={k} className={'slot ' + (cn[k] ? 'okd' : '')}>
                    <span className="ic"><Icon n={cn[k] ? 'check' : 'file'} s={16} /></span>
                    <div className="m"><div className="b">{t}</div><div className="xs faint"><CnDocLine cn={cn} k={k} /></div></div>
                    {cn.stage === 'Documents' ? (
                      <button className={'btn s ' + (cn[k] ? '' : 'pri')} type="button" data-open={`${k === 'pdc' ? 'cn-pdc' : 'cn-doc'}|${l.id}|${k}`}>
                        {cn[k] ? 'Replace' : k === 'pdc' ? 'Add register' : 'Upload'}
                      </button>
                    ) : null}
                  </div>
                ))}
              </div>
              {cn.stage === 'Documents' && !all ? <p className="muted sm mt8">Submit unlocks when all {CNDOCS.length} are received.</p> : null}
            </>
          ) : <Empty icn="file" t="Not yet" d="Documents open once the client confirms they want to proceed." />}
        </Card>
      </div>
    </>
  );
};
