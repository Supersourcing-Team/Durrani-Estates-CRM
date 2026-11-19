/* AD23 Settings (prototype route admin-settings: tabs rules, slabs, targets, cn, docs, dnd, plus the email-templates layer). */
import React from 'react';
import { eng, nf, ft, fts, pct } from '../../engine';
import { Bn, BusyBtn, Card, Chip, Empty, Fld, Icon, Kpi, PfInput, PgHead, Toggle } from '../../ui';
import type { ScreenComp } from '../../app/types';
import { Tc } from './parts';

/** Page header and section tabs, shared by every tab. */
function SettingsHead({ tab }: { tab: string }) {
  return (
    <>
      <PgHead t="Settings" sub="Rules the whole product follows. Every change is recorded in the audit log." />
      <nav className="tabs" aria-label="Settings sections">
        {eng.SETTABS.map(([k, t]: [string, string]) => {
          const go = 'admin-settings' + (k === 'rules' ? '' : '-' + k);
          return <a key={k} className={'tab ' + (k === tab ? 'on' : '')} href={'#' + go} data-go={go}>{t}</a>;
        })}
      </nav>
    </>
  );
}

/** prototype: num(k, label, value, {min, hint}) - a numeric page field with its error from UI.pf._e */
function Num({ k, label, v, min, hint }: { k: string; label: string; v: any; min?: number; hint?: string }) {
  const e = (eng.UI.pf && eng.UI.pf._e) || {};
  return (
    <Fld label={label} htmlFor={'p_' + k} err={e[k]} hint={hint}>
      <PfInput k={k} type="number" d={String(v)} bad={!!e[k]} min={min} />
    </Fld>
  );
}

/** Save + Discard buttons under each form. */
const SaveRow = ({ act, t }: { act: string; t: string }) => {
  const busy = !!eng.UI.pf._busy;
  return (
    <div className="row g6">
      <BusyBtn busy={busy} act={act} label={t} busyLabel="Saving…" />
      <button className="btn" type="button" data-act="setreset" disabled={busy || undefined}>Discard changes</button>
    </div>
  );
};

/* Lead rules */
function RulesTab() {
  const S = eng.S, st = S.set, NOW = eng.NOW();
  const X = +eng.pfv('inactX', st.inactX), Y = +eng.pfv('inactY', st.inactY);
  const idle = (l: any) => eng.daysBetween(l.lastCommit || l.assigned || l.created, NOW);
  const live = (l: any) => l.owner && !l.archived && !l.hold;
  const atrisk = S.leads.filter((l: any) => live(l) && idle(l) >= X && idle(l) < X + Y).length;
  const ret = S.leads.filter((l: any) => live(l) && idle(l) >= X + Y).length;
  return (
    <div className="grid g21">
      <div className="col g16">
        <Card title="Lead activity">
          <div className="frm">
            <Num k="inactX" label="Days without a next step before a lead is AT RISK" v={st.inactX} min={1} hint="Saved to inactivity policies for property, CN and secondary tracks. A dated next action resets the clock; notes alone do not." />
            <Num k="inactY" label="Further days at risk before it returns to the pool" v={st.inactY} min={1} hint="Grace days on each track policy after the at-risk threshold." />
          </div>
          <div className="frm">
            <Num k="capDefault" label="Default active lead ceiling per agent" v={st.capDefault} min={1} hint="Each agent can have their own ceiling on their profile." />
            <Num k="speed" label="Speed-to-lead target (minutes)" v={st.speed} min={1} hint="Time from assignment to first call." />
          </div>
        </Card>
        <Card title="Unit holds">
          <div className="frm">
            <Num k="holdHours" label="Hold length (hours)" v={st.holdHours} min={1} hint="How long a booked unit stays held while Admin decides." />
            <Num k="holdCap" label="Concurrent holds per agent" v={st.holdCap} min={1} />
          </div>
        </Card>
        <SaveRow act="setrules" t="Save rules" />
      </div>
      <div className="col g16">
        <Card title="What this would do today">
          <div className="col g16 sm">
            <div><b className={atrisk ? 'dangertx' : ''}>{atrisk}</b> lead{atrisk === 1 ? '' : 's'} would be at risk.</div>
            <div><b className={ret ? 'dangertx' : ''}>{ret}</b> lead{ret === 1 ? '' : 's'} would return to the pool on the next day change.</div>
            <div className="muted">Lowering these numbers takes effect straight away. Agents are not warned in advance, so announce changes first.</div>
          </div>
        </Card>
      </div>
    </div>
  );
}

/* Commission slabs */
function SlabsTab() {
  const S = eng.S;
  return (
    <>
      <Card title="Commission slabs" bare right={<button className="btn s pri" type="button" data-open="slab-edit"><Icon n="plus" s={16} />Add slab</button>}>
        <p className="muted sm" style={{ padding: '0 20px 12px' }}>An agent's slab is assigned by Admin on their profile. It does not change by itself when they sell more. The rate applies to the developer commission on each closed booking.</p>
        <div className="tw"><table className="tbl">
          <thead><tr><th>Slab</th><th className="num">Revenue threshold (AED)</th><th className="num">Rate</th><th className="num">Agents</th><th></th></tr></thead>
          <tbody>
            {S.set.slabs.map((s: any) => (
              <tr key={s.id}>
                <Tc first l="Slab" className="b">{s.name}</Tc>
                <Tc l="Revenue threshold (AED)" className="num">{nf(s.from)}</Tc>
                <Tc l="Rate" className="num">{s.rate + '%'}</Tc>
                <Tc l="Agents" className="num">{String(S.users.filter((u: any) => u.slab === s.id && u.status !== 'removed').length)}</Tc>
                <Tc l="" className="tr" t="Edit"><button className="btn s" type="button" data-open={'slab-edit|' + s.id}>Edit</button></Tc>
              </tr>
            ))}
          </tbody>
        </table></div>
      </Card>
      <div className="mt16"><Bn kind="info" title="Worked example" body="A AED 1,200,000 unit at 4% developer commission pays AED 48,000. On Slab B (30%) the agent earns AED 14,400." /></div>
    </>
  );
}

/* Targets */
function TargetsTab() {
  const a = eng.S.set.targets.agent, m = eng.S.set.targets.mgmt;
  return (
    <div className="grid g2">
      <div className="col g16">
        <Card title="Per agent, per month">
          <div className="frm">
            <Num k="t_rev" label="Revenue (AED)" v={a.rev} min={1} />
            <Num k="t_book" label="Bookings" v={a.book} min={1} />
            <Num k="t_calls" label="Calls" v={a.calls} min={1} />
            <Num k="t_meet" label="Meetings" v={a.meet} min={1} />
            <Num k="t_fu" label="Follow-ups" v={a.fu} min={1} />
          </div>
        </Card>
      </div>
      <div className="col g16">
        <Card title="Per team, per month">
          <div className="frm">
            <Num k="m_rev" label="Revenue (AED)" v={m.rev} min={1} />
            <Num k="m_book" label="Bookings" v={m.book} min={1} />
          </div>
        </Card>
        <SaveRow act="settargets" t="Save targets" />
      </div>
    </div>
  );
}

/* Convertible Notes terms + FX + CN commission defaults (Module 4) */
function CnTab() {
  const st = eng.S.set, c = st.cn;
  const cc = st.cnCommission || { agent: 5, teamLead: 1, businessHead: 1 };
  return (
    <div className="grid g2">
      <div className="col g16">
        <Card title="Terms">
          <div className="frm">
            <Num k="c_ten" label="Tenure (months)" v={c.tenure} min={1} />
            <Num k="c_rate" label="Monthly payout rate (%)" v={c.rate} min={0.1} hint="Paid monthly on the principal. Principal returns at maturity." />
          </div>
          <Fld label="Currencies"><div className="row g6">{c.cur.map((x: string) => <Chip key={x} t={x} cls="s4" dot={false} />)}</div></Fld>
        </Card>
        <Card title="CN commission defaults">
          <div className="frm">
            <Num k="cn_agent" label="Agent %" v={cc.agent} min={0} hint="Applies to new notes only." />
            <Num k="cn_tl" label="Team lead %" v={cc.teamLead} min={0} />
            <Num k="cn_bh" label="Business head %" v={cc.businessHead} min={0} />
          </div>
        </Card>
      </div>
      <div className="col g16">
        <Card title="Exchange rate">
          <Num k="fx" label="1 AED in INR" v={st.fx} min={1} hint="Used only to show an AED figure next to INR amounts." />
        </Card>
        <SaveRow act="setcn" t="Save" />
      </div>
    </div>
  );
}

/* Document lists (fixed in this release) */
function DocsTab() {
  const st = eng.S.set;
  const Ck = ({ t }: { t: string }) => <div className="ck ok"><Icon n="check" s={14} />{t}</div>;
  return (
    <>
      <div className="grid g2">
        <Card title="Property booking">
          <p className="muted sm mb8">The booking closes only when every document is approved by Admin.</p>
          <div className="col g6">{st.checklist.property.map((x: string) => <Ck key={x} t={x} />)}</div>
        </Card>
        <Card title="Convertible Note application">
          <p className="muted sm mb8">The application goes to Admin only when all are received.</p>
          <div className="col g6">{eng.CNDOCS.map(([k, t]: [string, string]) => <Ck key={k} t={t} />)}</div>
        </Card>
      </div>
      <div className="mt16"><Bn kind="info" title="These lists are fixed in this release." body="Changing a list changes agent screens and review rules, so it goes through a change request." /></div>
    </>
  );
}

/* Do Not Call list */
function DndTab() {
  const S = eng.S;
  return (
    <Card title={'Do Not Call list (' + S.dnd.length + ')'} bare right={<button className="btn s pri" type="button" data-open="dnd-add"><Icon n="plus" s={16} />Add number</button>}>
      {S.dnd.length ? (
        <div className="tw"><table className="tbl">
          <thead><tr><th>Number</th><th>Name</th><th>Added by</th><th>When</th><th>Reason</th><th></th></tr></thead>
          <tbody>
            {S.dnd.map((d: any, i: number) => (
              <tr key={i}>
                <Tc first l="Number" className="b">{d.no}</Tc>
                <Tc l="Name">{d.name || ''}</Tc>
                <Tc l="Added by" className="sm">{eng.uname(d.by)}</Tc>
                <Tc l="When" className="sm">{ft(d.at)}</Tc>
                <Tc l="Reason" className="sm">{d.reason || ''}</Tc>
                <Tc l="" className="tr" t="Remove"><button className="btn s" type="button" data-act={'dndremove|' + i}>Remove</button></Tc>
              </tr>
            ))}
          </tbody>
        </table></div>
      ) : <Empty icn="shield" t="Nobody on the list" d="Numbers agents or you add show up here." />}
    </Card>
  );
}

/* Email templates (layer added after the other tabs) */
function EmailTab() {
  const S = eng.S;
  const uses = (id: string) => S.emails.filter((e: any) => e.tpl === id).length;
  const sent = S.emails.length, op = S.emails.filter((e: any) => e.status === 'Opened').length, bo = S.emails.filter((e: any) => e.status === 'Bounced').length;
  return (
    <>
      <div className="grid g4c keep mb16">
        <Kpi l="Templates" n={String(S.tpls.filter((t: any) => t.active).length)} d={S.tpls.filter((t: any) => !t.active).length + ' turned off'} />
        <Kpi l="Emails sent" n={String(sent)} d="This month" />
        <Kpi l="Opened" n={pct(op, sent) + '%'} d={op + ' of ' + sent} />
        <Kpi l="Bounced" n={String(bo)} d={bo ? 'Check addresses' : 'All delivered'} cls={bo ? 'warn' : ''} />
      </div>
      <div className="grid g21">
        <div className="col g16">
          <Card title="Templates" bare right={<button className="btn pri s" type="button" data-open="tpl-edit"><Icon n="plus" s={14} />New template</button>}>
            <div className="tw"><table className="tbl">
              <thead><tr><th>Template</th><th>Category</th><th>Language</th><th className="num">Used</th><th>On</th><th></th></tr></thead>
              <tbody>
                {S.tpls.map((t: any) => (
                  <tr key={t.id}>
                    <Tc first l="Template" t={t.name + t.subject}>
                      <div className="cell2"><span>{t.name}</span><span className="s trunc" style={{ maxWidth: 320 }}>{t.subject}</span></div>
                    </Tc>
                    <Tc l="Category">{eng.TPLCAT[t.cat]}</Tc>
                    <Tc l="Language">{t.lang === 'ar' ? 'Arabic' : 'English'}</Tc>
                    <Tc l="Used" className="num">{String(uses(t.id))}</Tc>
                    <Tc l="On" t=""><Toggle on={t.active} act={'tpltog|' + t.id} /></Tc>
                    <Tc l="" className="tr" t="Edit"><button className="btn s" type="button" data-open={'tpl-edit|' + t.id}>Edit</button></Tc>
                  </tr>
                ))}
              </tbody>
            </table></div>
          </Card>
        </div>
        <div className="col g16">
          <Card title="How templates work">
            <div className="col g6 sm">
              <div>Agents can only send emails from these templates. They pick one, the CRM fills in the client and project details, and it sends from their Durrani address.</div>
              <div>Every email is logged on the lead with its status: Sent, Delivered, Opened or Bounced.</div>
              <div>Turning a template off hides it from agents straight away. Past emails stay in the log.</div>
            </div>
          </Card>
          <Card title="Recent emails">
            <div className="mlist">
              {S.emails.slice(0, 6).map((x: any, i: number) => {
                const l = eng.leadById(x.lead);
                return (
                  <a key={i} className="mrow" href={'#admin-lead-' + x.lead} data-go={'admin-lead-' + x.lead}>
                    <div className="dr-m"><div className="b trunc">{x.subject}</div><div className="xs muted">{(l ? l.name : '') + ' · ' + eng.uname(x.by) + ' · ' + fts(x.at)}</div></div>
                    <Chip t={x.status} cls={eng.EMST[x.status] || 's2'} />
                  </a>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

export const AdminSettings: ScreenComp = ({ params }) => {
  const tab: string = eng.SETTABS.find((t: any) => t[0] === params[0]) ? params[0] : 'rules';
  const body = tab === 'rules' ? <RulesTab /> : tab === 'slabs' ? <SlabsTab /> : tab === 'targets' ? <TargetsTab />
    : tab === 'cn' ? <CnTab /> : tab === 'docs' ? <DocsTab /> : tab === 'email' ? <EmailTab /> : <DndTab />;
  return <><SettingsHead tab={tab} />{body}</>;
};
