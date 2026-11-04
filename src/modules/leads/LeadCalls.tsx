/* A04 Lead detail, Calls tab (prototype: leadCalls(role, l) in 06-leads.js). */
import React from 'react';
import { fts } from '../../engine';
import { Card, Chip, DispChip, Empty, Icon, LeadLinks } from '../../ui';
import type { LeadTabProps } from './LeadScreen';

/* Result chip colour. Table cells carry data-l labels for the stacked phone layout (prototype: labelTables). */
const resCls = (res: string) => (res === 'Connected' ? 's6' : res === 'Wrong number' || res === 'DND requested' ? 's7' : 's2');

export function LeadCalls({ role, l }: LeadTabProps) {
  const mine = role === 'agent';
  const calls = [...l.calls].sort((a: any, b: any) => b.t - a.t);
  return (
    <>
      <Card title="Call history" bare
        right={mine && !l.archived ? <button className="btn s" type="button" data-open={`call-log|${l.id}`}><Icon n="plus" s={14} />Log a call made outside the app</button> : null}>
        {calls.length ? (
          <div className="tw">
            <table className="tbl">
              <thead><tr><th>When</th><th>Result</th><th>Disposition</th><th className="num">Duration</th><th>Notes</th></tr></thead>
              <tbody>
                {calls.map((c: any, i: number) => (
                  <tr key={i}>
                    <td data-l="When">{fts(c.t)}</td>
                    <td data-l="Result"><Chip t={c.res} cls={resCls(c.res)} /></td>
                    <td data-l="Disposition">{c.disp ? <DispChip d={c.disp} /> : <span className="faint">No disposition</span>}</td>
                    <td className="num" data-l="Duration">{c.res === 'Connected' ? <>{'~' + c.dur + ' min'}{c.flag ? <>{' '}<Chip t="Flagged" cls="s5" dot={false} /></> : null}</> : <span className="faint">None</span>}</td>
                    <td className="sm" data-l="Notes"><LeadLinks text={c.note || ''} />{c.manual ? <>{' '}<span className="tag">Manual log</span></> : null}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <Empty icn="phone" t="No calls yet" d="The first call you log shows up here." />}
      </Card>
      <p className="muted sm mt8">Call length is what you type when you log the call. Keep it honest: it feeds your activity numbers.</p>
    </>
  );
}
