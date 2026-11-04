/* M Convertible Notes for managers (prototype route mgmt-cn, 15c-deals). */
import React from 'react';
import { eng, mfull, fd, sum } from '../../engine';
import { Card, Chip, Empty, Icon, Kpi, PgHead } from '../../ui';
import type { ScreenComp } from '../../app/types';
import { CnAppRows } from './parts';

export const CnListMgmt: ScreenComp = () => {
  const S = eng.S;
  const CNDOCS: [string, string][] = eng.CNDOCS;
  const ids: string[] = eng.teamIds();
  const apps: any[] = S.leads.filter((l: any) => l.cn && ids.includes(l.owner) && l.cn.stage !== 'Active' && !l.archived);
  const notes: any[] = S.notes.filter((n: any) => ids.includes(n.agent));
  const tot = (c: string) => sum(notes.filter((n) => n.cur === c), (n: any) => n.principal);
  const tocheck = apps.filter((l) => CNDOCS.some(([k]) => eng.cnDS(l.cn, k) === 'pending')).length;
  const held = [tot('AED') ? mfull(tot('AED'), 'AED') : '', tot('INR') ? mfull(tot('INR'), 'INR') : ''].filter(Boolean);

  return (
    <>
      <PgHead t="Convertible Notes" sub="Your team's note applications and active notes. You can check documents. Admin approves and pays out."
        right={<button className="btn" type="button" data-open="cn-info"><Icon n="info" s={16} />How notes work</button>} />
      <div className="grid g4c keep mb16">
        <Kpi l="Applications open" n={String(apps.length)} />
        <Kpi l="Documents to check" n={String(tocheck)} d="Optional first check" cls={tocheck ? 'warn' : ''} />
        <Kpi l="Active notes" n={String(notes.length)} />
        <Kpi l="Principal held" n={held.length ? held.map((x, i) => <React.Fragment key={i}>{i ? <br /> : null}{x}</React.Fragment>) : 'None'} />
      </div>
      <Card title="Applications" bare cls="mb16">
        {apps.length ? <CnAppRows ls={apps} role="mgmt" /> : <Empty icn="clip" t="No open applications" d="When an agent sets a lead to Convertible Note, it shows here." />}
      </Card>
      <Card title="Active notes" bare>
        {notes.length ? (
          <div className="tw"><table className="tbl">
            <thead><tr><th>Note</th><th>Client</th><th>Agent</th><th className="num">Principal</th><th>Next payout</th><th>Status</th></tr></thead>
            <tbody>
              {notes.map((n) => {
                const s = eng.noteStat(n), np = eng.nextPay(n), go = 'mgmt-cnnote-' + eng.noteP(n.id);
                return (
                  <tr key={n.id} className="click" data-go={go}>
                    <td><a className="b" href={'#' + go} data-go={go}>{n.id}</a></td>
                    <td>{n.name}</td>
                    <td className="sm">{eng.uname(n.agent)}</td>
                    <td className="num">{mfull(n.principal, n.cur)}</td>
                    <td className="sm">{np ? fd(np.due) : 'Matured'}</td>
                    <td><Chip t={s[0]} cls={s[1]} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table></div>
        ) : <Empty icn="clip" t="No active notes" d="Approved applications become notes." />}
      </Card>
    </>
  );
};
