/* AD24 Lead Sources (prototype route admin-sources; admin-sources-meta / -google show srcDetail). */
import React from 'react';
import { eng, fd, nf, rel, sum, MIN, HR } from '../../engine';
import { Card, Chip, Dl, Empty, Icon, Kpi, PgHead } from '../../ui';
import type { ScreenComp } from '../../app/types';
import { Tc } from './parts';

const projName = (f: any) => (f.proj ? eng.projById(f.proj).name : 'Any');

/** Card for one ad source (Meta or Google) on the overview. */
function SrcCard({ k }: { k: string }) {
  const s = eng.S.sources[k];
  const [t, d, i] = eng.SRCN[k];
  return (
    <div className="card">
      <div className="row sb top">
        <div className="row g12"><span className="srcic"><Icon n={i} s={20} /></span><div><div className="h3">{t}</div><div className="xs muted">{d}</div></div></div>
        {s.on ? <Chip t={s.health === 'ok' ? 'Connected' : 'Needs attention'} cls={s.health === 'ok' ? 's6' : 's7'} /> : <Chip t="Not connected" cls="s2" />}
      </div>
      {s.on ? (
        <Dl items={[['Account', s.acct], ['Forms synced', String(s.forms.length)], ['Leads, last 7 days', <b>{sum(s.forms, (x: any) => x.n7)}</b>], ['Last lead', rel(s.last)]]} />
      ) : <p className="muted sm mt8">Connect once with the ad account login. New leads then arrive within a minute of the form being sent, with campaign and form name attached.</p>}
      <div className="row g6 wrap mt16">
        {s.on ? (
          <>
            <a className="btn" href={'#admin-sources-' + k} data-go={'admin-sources-' + k}>Manage</a>
            <button className="btn" type="button" data-act={'srcsync|' + k}><Icon n="refresh" s={14} />Sync now</button>
          </>
        ) : <button className="btn pri" type="button" data-open={'src-connect|' + k}>Connect {t}</button>}
      </div>
    </div>
  );
}

/** prototype: srcDetail(k) - one connected source with its forms, mapping and sync log. */
function SrcDetail({ k }: { k: string }) {
  const s = eng.S.sources[k];
  const [t] = eng.SRCN[k];
  if (!s.on) {
    return (
      <Card title="">
        <Empty icn="link" t={t + ' is not connected'} d="Connect it to start receiving leads."
          act={<button className="btn pri" type="button" data-open={'src-connect|' + k}>Connect</button>} />
      </Card>
    );
  }
  const log: [number, string, string][] = [[s.last, '1 lead received', 'ok'], [s.last - 38 * MIN, '2 leads received', 'ok'],
    [s.last - 3 * HR, '1 duplicate skipped (same number, same form)', 'warn'], [s.last - 9 * HR, 'Token refreshed', 'ok']];
  return (
    <>
      <PgHead t={t} sub={s.acct + ' · connected ' + fd(s.since)} right={<>
        <button className="btn" type="button" data-act={'srcsync|' + k}><Icon n="refresh" s={16} />Sync now</button>
        <button className="btn dng" type="button" data-act={'srcoff|' + k}>Disconnect</button>
      </>} />
      <div className="grid g4c keep mb16">
        <Kpi l="Status" n={s.health === 'ok' ? 'Healthy' : 'Check'} d="Webhook answering" />
        <Kpi l="Forms" n={String(s.forms.length)} />
        <Kpi l="Leads, last 7 days" n={String(sum(s.forms, (x: any) => x.n7))} />
        <Kpi l="Last lead" n={rel(s.last)} />
      </div>
      <Card title="Forms" bare cls="mb16">
        <div className="tw"><table className="tbl">
          <thead><tr><th>Form</th><th>Campaign name in the CRM</th><th>Project</th><th>New leads go to</th><th className="num">Last 7 days</th><th></th></tr></thead>
          <tbody>
            {s.forms.map((f: any) => (
              <tr key={f.id}>
                <Tc first l="Form" t={f.name}><b>{f.name}</b></Tc>
                <Tc l="Campaign name in the CRM" className="sm">{f.camp}</Tc>
                <Tc l="Project" className="sm">{projName(f)}</Tc>
                <Tc l="New leads go to" t={eng.ROUTEL(f.route)}><Chip t={eng.ROUTEL(f.route)} cls="s4" dot={false} /></Tc>
                <Tc l="Last 7 days" className="num">{String(f.n7)}</Tc>
                <Tc l="" className="tr" t="Edit"><button className="btn s" type="button" data-open={`src-route|${k}|${f.id}`}>Edit</button></Tc>
              </tr>
            ))}
          </tbody>
        </table></div>
      </Card>
      <div className="grid g2">
        <Card title="Field mapping">
          <Dl items={[['Full name', 'Name'], ['Phone number', 'Phone (duplicate check)'], ['Email', 'Email'], ['City', 'City'], ['What is your budget?', 'Budget'], ['When do you plan to buy?', 'Note on the lead']]} />
        </Card>
        <Card title="Sync log">
          <div className="col g6 sm">
            {log.map(([at, tx, k2], i) => (
              <div key={i} className="row sb"><span><Icon n={k2 === 'warn' ? 'alert' : 'check'} s={14} /> {tx}</span><span className="faint xs">{rel(at)}</span></div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}

export const AdminSources: ScreenComp = ({ params }) => {
  const S = eng.S;
  if (params[0] && eng.SRCN[params[0]]) return <SrcDetail k={params[0]} />;
  const imp: any[] = S.imports;
  const rules: [string, any][] = [...S.sources.meta.forms.map((f: any) => ['meta', f]), ...S.sources.google.forms.map((f: any) => ['google', f])];
  return (
    <>
      <PgHead t="Lead Sources" sub="Where leads come from, and where each new lead lands." right={<>
        <a className="btn" href="#admin-import" data-go="admin-import">Upload history</a>
        <a className="btn pri" href="#admin-importnew" data-go="admin-importnew"><Icon n="upload" s={16} />Upload Excel</a>
      </>} />
      <div className="grid g2 mb16">
        <SrcCard k="meta" />
        <SrcCard k="google" />
        <div className="card">
          <div className="row sb top">
            <div className="row g12"><span className="srcic"><Icon n="file" s={20} /></span><div><div className="h3">Excel upload</div><div className="xs muted">Expos, partner lists, cold data</div></div></div>
            <Chip t={imp.length + ' uploads'} cls="s2" />
          </div>
          <Dl items={[['Last upload', imp[0] ? imp[0].file + ' · ' + rel(imp[0].at) : 'None'], ['Rows imported', nf(sum(imp, (x: any) => x.ok))], ['Duplicates skipped', nf(sum(imp, (x: any) => x.dup))]]} />
          <div className="row g6 wrap mt16">
            <a className="btn pri" href="#admin-importnew" data-go="admin-importnew">Upload a file</a>
            <a className="btn" href="#admin-import" data-go="admin-import">History</a>
          </div>
        </div>
        <div className="card">
          <div className="row sb top">
            <div className="row g12"><span className="srcic"><Icon n="userplus" s={20} /></span><div><div className="h3">Single lead</div><div className="xs muted">Walk-ins, referrals, phone calls</div></div></div>
            <Chip t="Always on" cls="s6" />
          </div>
          <p className="muted sm mt8">Agents add from My Leads and keep the lead. Admin adds from Leads and can place it anywhere. The same duplicate check runs.</p>
          <div className="row g6 wrap mt16"><button className="btn" type="button" data-open="add-lead"><Icon n="plus" s={14} />Add a lead</button></div>
        </div>
      </div>
      <Card title="Routing rules" bare cls="mb16" right={<button className="btn s" type="button" data-open="assign-info"><Icon n="info" s={14} />How assignment works</button>}>
        <p className="muted sm" style={{ padding: '0 20px 12px' }}>Each form decides where its new leads land. Uploads choose this on the upload screen. Duplicates are checked before any rule runs.</p>
        <div className="tw"><table className="tbl">
          <thead><tr><th>Source</th><th>Form</th><th>Campaign name in the CRM</th><th>Project</th><th>New leads go to</th><th className="num">Last 7 days</th><th></th></tr></thead>
          <tbody>
            {rules.map(([k, f]) => (
              <tr key={k + f.id}>
                <Tc first l="Source" className="sm">{eng.SRCN[k][0]}</Tc>
                <Tc l="Form" t={f.name}><b>{f.name}</b></Tc>
                <Tc l="Campaign name in the CRM" className="sm">{f.camp}</Tc>
                <Tc l="Project" className="sm">{projName(f)}</Tc>
                <Tc l="New leads go to" t={eng.ROUTEL(f.route)}><Chip t={eng.ROUTEL(f.route)} cls={f.route === 'pool' ? 's2' : 's4'} dot={false} /></Tc>
                <Tc l="Last 7 days" className="num">{String(f.n7)}</Tc>
                <Tc l="" className="tr" t="Edit"><button className="btn s" type="button" data-open={`src-route|${k}|${f.id}`}>Edit</button></Tc>
              </tr>
            ))}
          </tbody>
        </table></div>
      </Card>
    </>
  );
};
