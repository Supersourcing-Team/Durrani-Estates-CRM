/*
 * Lead list: a table on desktop and cards on narrow screens, plus the pager.
 * prototype: leadTable(list, role, key, per, {owner}) in 05-shared.js. Used by My Leads and other lead lists.
 */
import React from 'react';
import { eng, ini } from '../../engine';
import { AvBox, Empty, Icon, LeadLinks, OwnerChip, StageChip, TempChip, isShort, paged } from '../../ui';
import { LeadFlag, LeadTags, NextTxt, hasLeadFlag, hasLeadTags, leadFlagText } from './leadBits';

export function LeadTable({ list, role, pageKey, per = 10, owner }: { list: any[]; role: string; pageKey: string; per?: number; owner?: boolean }) {
  const P = paged(list, pageKey, per);
  const base = role + '-lead-';
  if (!list.length) {
    return <Empty icn="user" t="No leads match" d="Try clearing a filter or search term." act={<button className="btn" type="button" data-act="clearf">Clear filters</button>} />;
  }
  return (
    <>
      <div className="tw responsive">
        <table className="tbl">
          <thead>
            <tr><th>Lead</th><th>Temp</th><th>Stage</th><th>Next action</th>{owner ? <th>Owner</th> : null}<th>Status</th><th className="chevc"></th></tr>
          </thead>
          <tbody>
            {P.items.map((l: any) => (
              <tr key={l.id} className="click" data-go={base + l.id}>
                <td>
                  <div className="row" style={{ gap: 11, alignItems: 'center' }}>
                    <AvBox t={ini(l.name)} />
                    <div className="cell2">
                      <a className="b" style={{ color: 'var(--tx)', textDecoration: 'none', fontWeight: 500 }} href={'#' + base + l.id} data-go={base + l.id}>{l.name}</a>
                      <span className="s"><LeadLinks text={`LEAD-${l.id} · ${l.phone}`} /></span>
                      {hasLeadTags(l) ? <span className="row g4 wrap" style={{ marginTop: 3 }}><LeadTags l={l} /></span> : null}
                    </div>
                  </div>
                </td>
                <td className={isShort(l.temp || 'Not set') ? 'nw' : undefined}><TempChip t={l.temp} /></td>
                <td className={isShort(l.stage) ? 'nw' : undefined}><StageChip s={l.stage} /></td>
                <td className="nw"><NextTxt l={l} /></td>
                {owner ? <td className={isShort(l.owner ? eng.uname(l.owner) : 'Admin pool') ? 'nw' : undefined}><OwnerChip id={l.owner} /></td> : null}
                <td className={isShort(hasLeadFlag(l) ? leadFlagText(l) : 'On track') ? 'nw' : undefined}>{hasLeadFlag(l) ? <LeadFlag l={l} /> : <span className="faint">On track</span>}</td>
                <td className="chevc"><Icon n="chev" s={16} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="lcards">
        {P.items.map((l: any) => (
          <div key={l.id} className="lc" role="link" tabIndex={0} data-go={base + l.id}>
            <div className="row sb top">
              <span className="row" style={{ gap: 10, minWidth: 0 }}>
                <AvBox t={ini(l.name)} />
                <span style={{ minWidth: 0 }}>
                  <span className="b trunc" style={{ display: 'block' }}>{l.name}</span>
                  <span className="xs muted">LEAD-{l.id}{owner ? ' · ' + (eng.uname(l.owner) || 'Admin pool') : ''}</span>
                </span>
              </span>
              {role === 'agent' && !l.archived
                ? <a className="iconbtn lccall" href={'tel:' + l.phone.replace(/\s/g, '')} data-act={`dial|${l.id}`} aria-label={'Call ' + l.name}><Icon n="phone" s={18} /></a>
                : <TempChip t={l.temp} />}
            </div>
            <div className="row g6 wrap" style={{ paddingLeft: 44 }}>
              <StageChip s={l.stage} />{role === 'agent' ? <TempChip t={l.temp} /> : null}<LeadFlag l={l} /><LeadTags l={l} />
            </div>
            <div className="sm" style={{ paddingLeft: 44 }}><NextTxt l={l} /></div>
          </div>
        ))}
      </div>
      {P.foot}
    </>
  );
}
