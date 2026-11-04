/* A-notifications: all notifications with All / Unread filter (prototype route agent-notifications). */
import React from 'react';
import { eng, rel } from '../../engine';
import { AvBox, Card, Empty, Icon, PgHead, paged } from '../../ui';
import type { ScreenComp } from '../../app/types';

export const Notifications: ScreenComp = () => {
  const f = eng.UI.f.nf || 'all';
  let list: any[] = eng.myNotifs();
  if (f === 'unread') list = list.filter((n) => !n.read);
  const P = paged(list, 'notif', 12);
  return (
    <>
      <PgHead t="Notifications" sub="Everything that needs your attention, newest first."
        right={<button className="btn" type="button" data-act="readall"><Icon n="check" s={16} />Mark all read</button>} />
      <div className="seg mb16">
        <button className={f === 'all' ? 'on' : ''} data-act="ui|nf|all">All</button>
        <button className={f === 'unread' ? 'on' : ''} data-act="ui|nf|unread">Unread ({eng.unreadCount()})</button>
      </div>
      <Card bare>
        {list.length ? (
          <>
            <div>
              {P.items.map((n) => (
                <button key={n.id} type="button" className={'ddi ' + (n.read ? '' : 'un')} data-act={`notifgo|${n.id}`}>
                  <AvBox cls="sm"><Icon n={n.ic || 'bell'} s={13} /></AvBox>
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span className="b" style={{ display: 'block' }}>{n.t}</span>
                    <span className="muted sm" style={{ display: 'block' }}>{n.d || ''}</span>
                  </span>
                  <span className="faint xs nowrap">{rel(n.at)}</span>
                </button>
              ))}
            </div>
            {P.foot}
          </>
        ) : <Empty icn="bell" t="Nothing here" d="You are all caught up. New activity will show up here." />}
      </Card>
    </>
  );
};
