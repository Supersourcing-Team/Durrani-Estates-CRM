/* M Team Leave (prototype route mgmt-leave, plus the manager's own leave card added in a later file). */
import React from 'react';
import { eng, fds } from '../../engine';
import { Btn, Card, Chip, Empty, LeadLinks, PgHead } from '../../ui';
import type { ScreenComp } from '../../app/types';
import { LeaveSeg, ReqActs, ReqChip } from './parts';

const dates = (x: any) => fds(x.from) + (x.days > 1 ? ' to ' + fds(x.to) : '');

export const MgmtLeave: ScreenComp = () => {
  const S = eng.S, u = eng.me();
  const ids: string[] = eng.teamIds();
  const f = eng.UI.f.lf || 'pending';
  const all: any[] = S.leave.filter((l: any) => ids.includes(l.user)).sort((a: any, b: any) => b.from - a.from);
  const l = all.filter((x) => f === 'all' || x.status === f);
  const mine: any[] = S.leave.filter((x: any) => x.user === u.id).sort((a: any, b: any) => b.from - a.from);

  return (
    <>
      <PgHead t="Team Leave" sub="Approve or reject. There are no balances: leave is a request and a decision."
        right={<><Btn cls="pri" open="leave-req" ic="cal">Apply for my leave</Btn><Btn open="leave-apply" ic="plus">Apply for an employee</Btn></>} />
      <LeaveSeg f={f} pending={all.filter((x) => x.status === 'pending').length} />
      <Card bare>
        {l.length ? (
          <div className="tw">
            <table className="tbl">
              <thead><tr><th>Agent</th><th>Type</th><th>Dates</th><th className="num">Days</th><th>Reason</th><th>Clash</th><th>Status</th><th></th></tr></thead>
              <tbody>
                {l.map((x) => {
                  const clash = all.filter((y) => y.id !== x.id && y.status !== 'rejected' && y.status !== 'cancelled' && x.from <= y.to && x.to >= y.from);
                  return (
                    <tr key={x.id}>
                      <td>{eng.uname(x.user)}</td>
                      <td>{x.type}</td>
                      <td>{dates(x)}</td>
                      <td className="num">{x.days}</td>
                      <td className="sm"><LeadLinks text={x.reason} /></td>
                      <td className="sm">{clash.length ? <Chip t={clash.length + ' also off'} cls="s5" dot={false} /> : <span className="faint">None</span>}</td>
                      <td><ReqChip x={x} /></td>
                      <td className="tr"><ReqActs kind="leave" x={x} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : <Empty icn="cal" t="No requests" d="Nothing waiting for you." />}
      </Card>
      <Card title="My leave requests" bare cls="mt16" right={<Chip t="Approved by Admin" cls="s2" dot={false} />}>
        {mine.length ? (
          <div className="tw">
            <table className="tbl">
              <thead><tr><th>Type</th><th>Dates</th><th className="num">Days</th><th>Reason</th><th>Status</th><th></th></tr></thead>
              <tbody>
                {mine.map((x) => (
                  <tr key={x.id}>
                    <td>{x.type}</td>
                    <td>{dates(x)}</td>
                    <td className="num">{x.days}</td>
                    <td className="sm"><LeadLinks text={x.reason} /></td>
                    <td><ReqChip x={x} /></td>
                    <td className="tr"><ReqActs kind="leave" x={x} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <Empty icn="cal" t="No leave requests of your own" d="Your leave goes to Admin for approval, not to you."
              act={<button className="btn pri" type="button" data-open="leave-req">Apply for my leave</button>} />}
      </Card>
    </>
  );
};
