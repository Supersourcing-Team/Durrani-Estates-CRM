/* AD21 Reports & MIS (prototype route admin-reports, tabs revenue/campaign/funnel/bookings/commission/activity). */
import React from 'react';
import { eng, nf } from '../../engine';
import { Card, Empty, PgHead, paged } from '../../ui';
import type { ScreenComp } from '../../app/types';
import { DlBtn, Tc } from './parts';

export const AdminReports: ScreenComp = ({ params }) => {
  const REPORTS: any[] = eng.REPORTS;
  const k: string = REPORTS.find((r) => r.k === params[0]) ? params[0] : 'revenue';
  const rp = REPORTS.find((r) => r.k === k);
  const r: { cols: string[]; rows: any[][] } = rp.build();
  const P = paged(r.rows, 'rep' + k, 15);
  const isNum = (c: any) => typeof c === 'number';

  return (
    <>
      <PgHead t="Reports & MIS" sub="October 2026 to date. Copy any report as CSV."
        right={<DlBtn label="Download CSV" text={eng.csvOf(r)} name={'report-' + k + '.csv'} />} />
      <div className="pills mb16">
        {REPORTS.map((x) => (
          <a key={x.k} className={'pill ' + (x.k === k ? 'on' : '')} href={'#admin-reports-' + x.k} data-go={'admin-reports-' + x.k} style={{ textDecoration: 'none' }}>{x.t}</a>
        ))}
      </div>
      <Card title={rp.t} bare>
        <p className="muted sm" style={{ padding: '0 20px 12px' }}>{rp.d} {r.rows.length} row{r.rows.length === 1 ? '' : 's'}.</p>
        {r.rows.length ? (
          <>
            <div className="tw"><table className="tbl">
              <thead><tr>{r.cols.map((c, i) => <th key={i} className={isNum(r.rows[0][i]) ? 'num' : ''}>{c}</th>)}</tr></thead>
              <tbody>
                {P.items.map((x, ri) => (
                  <tr key={ri}>
                    {x.map((c, i) => {
                      const txt = isNum(c) ? nf(c) : String(c);
                      return <Tc key={i} first={i === 0} l={r.cols[i]} className={isNum(c) ? 'num' : ''}>{txt}</Tc>;
                    })}
                  </tr>
                ))}
              </tbody>
            </table></div>
            {P.foot}
          </>
        ) : <Empty icn="chart" t="No data" d="Nothing to report yet." />}
      </Card>
    </>
  );
};
