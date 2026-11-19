/* Account menu pop-up (prototype modal account-menu): settings, notifications, sign out. */
import React from 'react';
import { eng } from '../../engine';
import { Icon, Modal } from '../../ui';
import type { ModalComp } from '../../app/types';
import { SignOutButton } from './SignOutButton';

export const AccountMenuModal: ModalComp = () => {
  const u = eng.me();
  const r = u.role;
  const unread = eng.unreadCount();
  return (
    <Modal title={u.name} sub={eng.roleLabel(u) + ' · ' + u.emp} size="">
      <div className="col g6">
        <a className="btn blk" href={`#${r}-settings`} data-go={`${r}-settings`}><Icon n="cog" s={16} />Settings</a>
        <a className="btn blk" href={`#${r}-notifications`} data-go={`${r}-notifications`}><Icon n="bell" s={16} />Notifications{unread ? ' (' + unread + ')' : ''}</a>
        <SignOutButton variant="blk" />
      </div>
    </Modal>
  );
};
