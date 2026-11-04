/* Phone "More" menu (prototype modal more-nav): full navigation list, notifications, settings, sign out. */
import React from 'react';
import { eng } from '../../engine';
import { Icon, Modal } from '../../ui';
import type { ModalComp } from '../../app/types';
import { parseHash } from '../../app/route';

/** prototype: badgeFor(navKey) */
function NavBadge({ k }: { k: string }) {
  const S = eng.S;
  if (!S.session) return null;
  const r = S.session.role;
  let n = 0, red = false;
  if (k === 'admin-review') { n = eng.pendingReview().length; red = true; }
  else if (k === 'mgmt-leave') n = S.leave.filter((l: any) => l.status === 'pending' && eng.teamOf(l.user) === eng.me().team).length;
  else if (k === 'mgmt-leads') { n = eng.escalationsFor(eng.me()).filter((e: any) => e.status === 'open').length; red = true; }
  else if (k === 'agent-leads' && r === 'agent') { n = eng.myLeads(eng.me().id).filter((l: any) => eng.leadRisk(l).state === 'risk').length; red = true; }
  return n ? <span className={'bdg' + (red ? ' red' : '')}>{n}</span> : null;
}

export const MoreNavModal: ModalComp = () => {
  const r = eng.me().role;
  const cur = (parseHash() || ({} as any)).def;
  const ck = cur ? cur.nav || cur.key : '';
  const unread = eng.unreadCount();
  return (
    <Modal title="Menu" sub={eng.roleLabel(eng.me())}>
      <div className="col g4">
        {eng.NAVS[r].map(([k, l, i]: [string, string, string]) => (
          <a key={k} className={'nl ' + (ck === k ? 'on' : '')} href={'#' + k} data-go={k}><Icon n={i} s={18} /><span>{l}</span><NavBadge k={k} /></a>
        ))}
        <div className="navsep" />
        <a className="nl" href={`#${r}-notifications`} data-go={`${r}-notifications`}><Icon n="bell" s={18} /><span>Notifications</span>{unread ? <span className="bdg">{unread}</span> : null}</a>
        {r !== 'admin' ? <a className="nl" href={`#${r}-settings`} data-go={`${r}-settings`}><Icon n="cog" s={18} /><span>Settings</span></a> : null}
        <button type="button" className="nl" data-act="logout"><Icon n="out" s={18} /><span>Sign out</span></button>
      </div>
    </Modal>
  );
};
