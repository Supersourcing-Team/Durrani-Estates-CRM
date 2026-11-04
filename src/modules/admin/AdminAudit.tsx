/* AD22 Audit Log (prototype route admin-audit, final layer "audit log, easier to read"). */
import React from 'react';
import { eng, fd, fhm, ft, DAY } from '../../engine';
import { Av, Card, Empty, Icon, LeadLinks, PgHead, Search, Sel, paged } from '../../ui';
import type { ScreenComp } from '../../app/types';
import { DlBtn, Tc } from './parts';

const catName = (action: string): string => eng.AUDCAT.find((c: any) => c[0] === eng.audCat(action))[1];

/** One audit entry as a table row; opens the audit-row detail. */
function AuditRow({ a }: { a: any }) {
  const u = eng.userById(a.actor);
  const name = u ? u.name : 'System', role = u ? eng.ROLEN[u.role] : 'Automatic rule';
  const has = a.before || a.after;
  const b = a.before || 'empty', af = a.after || 'empty';
  return (
    <tr className="click" data-open={'audit-row|' + a.id}>
      <Tc first l="Time" className="sm nw" t={fhm(a.at)}><b>{fhm(a.at)}</b></Tc>
      <Tc l="Done by" t={name + role}>
        <div className="row g6" style={{ flexWrap: 'nowrap' }}>
          <Av n={name} cls="sm" />
          <span><span className="sm b">{name}</span><span className="xs faint" style={{ display: 'block' }}>{role}</span></span>
        </div>
      </Tc>
      <Tc l="What happened" t={a.action + catName(a.action)}>
        <span className="sm b"><LeadLinks text={a.action} /></span><div className="xs faint">{catName(a.action)}</div>
      </Tc>
      <Tc l="Record" className="sm" t={a.entity}><LeadLinks text={a.entity} /></Tc>
      <Tc l="Change" className="sm" t={has ? b + '  ' + af : ''}>
        {has ? <><span className="audb"><LeadLinks text={b} /></span> <Icon n="chev" s={12} /> <b><LeadLinks text={af} /></b></> : null}
      </Tc>
    </tr>
  );
}

export const AdminAudit: ScreenComp = () => {
  const S = eng.S, UI = eng.UI;
  const NOW = eng.NOW();
  const q = (UI.f.aq || '').toLowerCase(), cat = UI.f.ac || 'all', who = UI.f.aw || 'all', per = UI.f.ap || 'all';
  const lim = ({ today: eng.startOfDay(NOW), d7: NOW - 7 * DAY, d30: NOW - 30 * DAY, all: 0 } as Record<string, number>)[per];
  const l: any[] = S.audit.filter((a: any) => (!q || (a.action + a.entity + a.before + a.after).toLowerCase().includes(q))
    && (cat === 'all' || eng.audCat(a.action) === cat) && (who === 'all' || a.actor === who) && a.at >= lim);
  const P = paged(l, 'aud', 20);
  const csv = 'Time,Person,Role,Action,Record,Before,After\n' + l.map((a) => [ft(a.at), eng.uname(a.actor) || 'System',
    a.actor === 'system' ? 'System' : (eng.ROLEN[(eng.userById(a.actor) || {}).role] || ''), a.action, a.entity, a.before, a.after]
    .map((c) => '"' + String(c).replace(/"/g, '""') + '"').join(',')).join('\n');

  // Rows grouped by day: a "Today" / "Yesterday" / date header row before each new day.
  const rows: React.ReactNode[] = [];
  let lastD = '';
  P.items.forEach((a) => {
    const d = eng.dayKey(a.at);
    if (d !== lastD) {
      const lbl = eng.sameDay(a.at, NOW) ? 'Today' : eng.sameDay(a.at, NOW - DAY) ? 'Yesterday' : fd(a.at);
      rows.push(<tr key={'g' + d} className="grp"><Tc first l="Time" colSpan={5}>{lbl}</Tc></tr>);
    }
    lastD = d;
    rows.push(<AuditRow key={a.id} a={a} />);
  });

  const people: [string, string][] = S.users.filter((u: any) => S.audit.some((a: any) => a.actor === u.id)).map((u: any) => [u.id, u.name]);

  return (
    <>
      <PgHead t="Audit Log" sub="Who changed what, and when. Entries are written by the system and cannot be edited or deleted."
        right={<DlBtn label="Download CSV" text={csv} name="audit-log.csv" />} />
      <div className="grid g3 keep mb16">
        <div className="card soft sm"><div className="b"><Icon n="user" s={14} /> Who and when</div><div className="muted mt4">The person who made the change, or System for automatic rules like auto-return.</div></div>
        <div className="card soft sm"><div className="b"><Icon n="zap" s={14} /> What happened</div><div className="muted mt4">The action and the record it touched. Click a row for the full detail.</div></div>
        <div className="card soft sm"><div className="b"><Icon n="repeat" s={14} /> Before and after</div><div className="muted mt4">The old value, then the new one. Empty means it did not exist before.</div></div>
      </div>
      <div className="pills mb8">
        {eng.AUDCAT.map(([k, t]: [string, string]) => <button key={k} type="button" className={'pill ' + (cat === k ? 'on' : '')} data-act={'ui|ac|' + k}>{t}</button>)}
      </div>
      <div className="row g6 wrap mb16 fbar">
        <div style={{ flex: 1, minWidth: 220 }}><Search bind="aq" val={UI.f.aq} ph="Search action, record or value" /></div>
        <Sel bind="aw" cur={who} opts={[['all', 'Anyone'], ['system', 'System'], ...people]} />
        <Sel bind="ap" cur={per} opts={[['all', 'Any time'], ['today', 'Today'], ['d7', 'Last 7 days'], ['d30', 'Last 30 days']]} />
      </div>
      <Card title="" bare>
        {l.length ? (
          <>
            <div className="tw"><table className="tbl">
              <thead><tr><th>Time</th><th>Done by</th><th>What happened</th><th>Record</th><th>Change</th></tr></thead>
              <tbody>{rows}</tbody>
            </table></div>
            {P.foot}
          </>
        ) : <Empty icn="hist" t="No entries" d="Nothing matches these filters." />}
      </Card>
    </>
  );
};
