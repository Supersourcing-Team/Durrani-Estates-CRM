/* AD13 Bookings Approval (prototype route admin-review, plus the later wrapper that turns
   "Review application" into a link to admin-cnapp-<id>). */
import React from 'react';
import { eng } from '../../engine';
import { BkChip, Card, Chip, Dl, Empty, LeadLinks, PgHead, Tabs } from '../../ui';
import type { ScreenComp } from '../../app/types';
import { C } from './shared';

const TABS = ['bookings', 'docs', 'closure', 'cn', 'sec'];
const T: Record<string, string> = { bookings: 'booking', docs: 'doc', closure: 'closure', cn: 'cn', sec: 'sec' };

/** "Recently decided" card under every tab */
function RecentlyDecided() {
  const decided = eng.S.bookings.filter((b: any) => ['approved', 'rejected', 'closed', 'expired', 'changes'].includes(b.status))
    .sort((a: any, b: any) => b.submitted - a.submitted).slice(0, 6);
  return (
    <Card title="Recently decided" bare right={<a className="btn s" href="#admin-commission" data-go="admin-commission">Commission</a>}>
      <div className="tw">
        <table className="tbl">
          <thead><tr><th>Booking</th><th>Agent</th><th>Unit</th><th>Status</th><th>Deal stage</th></tr></thead>
          <tbody>
            {decided.map((b: any) => {
              const g = 'admin-booking-' + eng.bkP(b.id);
              return (
                <tr key={b.id} className="click" data-go={g}>
                  <C first l="Booking" text={b.id}><a className="b" href={'#' + g} data-go={g}>{b.id}</a></C>
                  <C l="Agent" className="sm">{eng.uname(b.agent)}</C>
                  <C l="Unit" className="sm">{b.unit}</C>
                  <C l="Status" text={eng.BKS[b.status][0]}><BkChip s={b.status} /></C>
                  <C l="Deal stage" className="sm">{eng.dealStage(b)}</C>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

/** One Convertible Note application card (cn tab) */
function CnCard({ it }: { it: any }) {
  const l = it.l, c = l.cn;
  const S = eng.S;
  return (
    <div className="card">
      <div className="row sb">
        <div><div className="h2">{l.name}</div><div className="muted sm"><LeadLinks text={'LEAD-' + l.id + ' · ' + eng.uname(l.owner)} /></div></div>
        <Chip t="Admin review" cls="s5" />
      </div>
      <Dl items={[
        ['Amount', eng.mfull(c.amount, c.cur)],
        ['Tenure', c.tenure + ' months at ' + S.set.cn.rate + '% monthly'],
        ['Documents', eng.CNDOCS.filter(([k]: [string]) => c[k]).length + ' of ' + eng.CNDOCS.length],
        ['Submitted', eng.ft(c.submitted)],
      ]} />
      <div className="row g6 wrap mt16">
        <a className="btn pri" href={'#admin-cnapp-' + l.id} data-go={'admin-cnapp-' + l.id}>Review application</a>
        <a className="btn" href={'#admin-lead-' + l.id} data-go={'admin-lead-' + l.id}>Open lead</a>
      </div>
    </div>
  );
}

export const ReviewQueue: ScreenComp = ({ params }) => {
  const tab = TABS.includes(params[0]) ? params[0] : 'all';
  const all = eng.pendingReview().sort((a: any, b: any) => a.at - b.at);
  const n = (t: string) => all.filter((x: any) => x.type === T[t]).length;
  const list = tab === 'all' ? all : all.filter((x: any) => x.type === T[tab]);
  const hdr = (
    <>
      <PgHead t="Bookings Approval" sub="Everything waiting for an Admin decision, oldest first." />
      <Tabs cur={tab} items={[
        { k: 'all', l: 'All', go: 'admin-review', n: all.length },
        { k: 'bookings', l: 'New bookings', go: 'admin-review-bookings', n: n('bookings') },
        { k: 'docs', l: 'Documents', go: 'admin-review-docs', n: n('docs') },
        { k: 'closure', l: 'Closure', go: 'admin-review-closure', n: n('closure') },
        { k: 'cn', l: 'Convertible Notes', go: 'admin-review-cn', n: n('cn') },
        { k: 'sec', l: 'Secondary', go: 'admin-review-sec', n: n('sec') },
      ]} />
    </>
  );

  if (tab === 'cn') {
    return (
      <>
        {hdr}
        {list.length
          ? <div className="grid g2 mb16">{list.map((it: any) => <CnCard key={it.id} it={it} />)}</div>
          : <Card><Empty icn="check" t="No applications waiting" d="Submitted Convertible Note applications show here." /></Card>}
        <RecentlyDecided />
      </>
    );
  }

  return (
    <>
      {hdr}
      <Card bare cls="mb16">
        {list.length ? (
          <div className="tw">
            <table className="tbl">
              <thead><tr><th>Type</th><th>Item</th><th>From</th><th>Waiting</th><th /></tr></thead>
              <tbody>
                {list.map((it: any) => {
                  const g = eng.reviewGo(it);
                  const rt = eng.RT[it.type];
                  return (
                    <tr key={it.type + it.id} className="click" data-go={g}>
                      <C first l="Type" text={rt[0]}><Chip t={rt[0]} cls={rt[1]} /></C>
                      <C l="Item" className="sm b">{eng.reviewTitle(it)}</C>
                      <C l="From" className="sm">{eng.reviewWho(it)}</C>
                      <C l="Waiting" className="sm">{eng.rel(it.at).replace(' ago', '')}</C>
                      <C l="" className="tr" text={it.type === 'closure' ? 'Close deal' : 'Review'}>
                        <a className="btn s pri" href={'#' + g} data-go={g}>{it.type === 'closure' ? 'Close deal' : 'Review'}</a>
                      </C>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : <Empty icn="check" t="Nothing waiting here" d="New items show up as agents submit them." />}
      </Card>
      <RecentlyDecided />
    </>
  );
};
