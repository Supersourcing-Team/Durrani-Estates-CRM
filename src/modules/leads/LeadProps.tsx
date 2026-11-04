/* A04 Lead detail, Properties tab (prototype: leadProps(role, l) in 06-leads.js). */
import React from 'react';
import { eng, money } from '../../engine';
import { Btn, Card, Chip, Empty, Icon } from '../../ui';
import type { LeadTabProps } from './LeadScreen';

export function LeadProps({ role, l }: LeadTabProps) {
  const mine = role === 'agent' && !l.archived;
  return (
    <Card title="Shortlisted properties" right={mine ? <a className="btn s" href="#agent-catalogue" data-go="agent-catalogue"><Icon n="plus" s={14} />Add from catalogue</a> : null}>
      {l.shortlist.length ? (
        <div className="lcols">
          {l.shortlist.map((s: any) => {
            const p = eng.projById(s.p);
            const pg = `${role}-project-${p.id}`;
            return (
              <div className="card soft" key={p.id}>
                <div className="row sb">
                  <a className="h2" style={{ color: 'var(--tx)', textDecoration: 'none' }} href={'#' + pg} data-go={pg}>{p.name}</a>
                  {s.primary ? <Chip t="Primary" cls="s3" /> : null}
                </div>
                <div className="muted sm">{p.area} · {money(p.from)} to {money(p.to)}</div>
                <div className="row g6 wrap mt8">
                  <a className="btn s" href={'#' + pg} data-go={pg}>View</a>
                  {mine ? (
                    <>
                      <button className="btn s" type="button" data-open={`share|${l.id}|${p.id}`}>Share</button>
                      <a className="btn s pri" href={`#agent-bookingnew-${l.id}-${p.id}`} data-go={`agent-bookingnew-${l.id}-${p.id}`}>Start booking</a>
                      <button className="btn s" type="button" data-act={`shortdel|${l.id}|${p.id}`}>Remove</button>
                    </>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      ) : <Empty icn="building" t="Nothing shortlisted" d="Browse the catalogue and add projects this client likes." act={mine ? <Btn t="Open catalogue" go="agent-catalogue" cls="pri" /> : null} />}
    </Card>
  );
}
