/* A16 Secondary Market (prototype route agent-secondary, plus the 15c-deals layer: list hint and "How it works"). */
import React from 'react';
import { eng, money, mfull } from '../../engine';
import { Card, Chip, Empty, Icon, PgHead, Td, isShort } from '../../ui';
import type { ScreenComp } from '../../app/types';

/** prototype: secTable(rows, role) */
export function SecTable({ rows, role }: { rows: any[]; role: string }) {
  return (
    <div className="tw"><table className="tbl">
      <thead><tr><th>Request</th><th>Type</th><th>Property or need</th><th className="num">Price or budget</th><th>Owner</th><th>Status</th></tr></thead>
      <tbody>
        {rows.map((s) => {
          const go = role + '-sec-' + eng.secP(s.id);
          return (
            <tr key={s.id} className="click" data-go={go}>
              <Td first l="Request" nw={isShort(s.id)}><a className="b" href={'#' + go} data-go={go}>{s.id}</a></Td>
              <Td l="Type" nw><Chip t={s.kind === 'buyer' ? 'Buyer' : 'Seller'} cls={s.kind === 'buyer' ? 's1' : 's4'} /></Td>
              <Td l="Property or need" nw={isShort(s.prop + s.loc + ' · ' + s.name)}>{s.prop}<div className="xs faint">{s.loc} · {s.name}</div></Td>
              <Td l="Price or budget" className="num">{s.kind === 'seller' ? mfull(s.ask, s.cur) : money(s.budget[0], s.cur) + ' to ' + money(s.budget[1], s.cur)}</Td>
              <Td l="Owner" nw={isShort(s.owner ? eng.uname(s.owner) : 'Unassigned')}>{s.owner ? eng.uname(s.owner) : <span className="faint">Unassigned</span>}</Td>
              <Td l="Status" nw={isShort(s.status)}><Chip t={s.status} cls={eng.SECS[s.status] || 's2'} /></Td>
            </tr>
          );
        })}
      </tbody>
    </table></div>
  );
}

export const SecList: ScreenComp = () => {
  const S = eng.S;
  const u = eng.me();
  const f: string = eng.UI.f.sf || 'mine';
  const all: any[] = eng.secList('agent');
  const mine = all.filter((s) => s.raised === u.id);
  const asg = all.filter((s) => s.owner === u.id);
  const lst = S.sec.filter((s: any) => s.kind === 'seller' && ['Active', 'Negotiation'].includes(s.status));
  const rows = f === 'mine' ? mine : f === 'asg' ? asg : lst;

  return (
    <>
      <PgHead t="Secondary Market" sub="Resale deals. You raise requests. Admin publishes listings. Secondary-tag agents work the deals."
        right={<button className="btn pri" type="button" data-open="sec-req"><Icon n="plus" s={16} />New request</button>} />
      <div className="seg mb8">
        <button className={f === 'mine' ? 'on' : ''} data-act="ui|sf|mine">Requests I raised ({mine.length})</button>
        {u.tag === 'Secondary' ? <button className={f === 'asg' ? 'on' : ''} data-act="ui|sf|asg">Assigned to me ({asg.length})</button> : null}
        <button className={f === 'lst' ? 'on' : ''} data-act="ui|sf|lst">Live listings ({lst.length})</button>
      </div>
      <p className="muted sm mb16">{eng.SECHINT[f] || ''} <button type="button" className="btn lnk xs" data-open="sec-info">How it works</button></p>
      <Card title="" bare>
        {rows.length ? <SecTable rows={rows} role="agent" />
          : <Empty icn="store" t="Nothing here" d="Raise a request to list a resale property or find one for a buyer."
            act={<button className="btn pri" type="button" data-open="sec-req">New request</button>} />}
      </Card>
    </>
  );
};
