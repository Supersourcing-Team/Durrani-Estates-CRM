/* Sign-out button with a loader while the logout API call is in flight. */
import React from 'react';
import { BusyBtn, Icon } from '../../ui';
import { isLoggingOut } from '../session';

type Props = {
  /** Visual style: block button (account menu), nav row (More menu) or default button (Settings). */
  variant?: 'blk' | 'nl' | 'btn' | 'pri';
};

export function SignOutButton({ variant = 'btn' }: Props) {
  const busy = isLoggingOut();
  const cls = variant === 'blk' ? 'btn blk' : variant === 'nl' ? 'nl' : variant === 'pri' ? 'btn pri' : 'btn';
  const iconSize = variant === 'nl' ? 18 : 16;
  const label = variant === 'nl'
    ? <><Icon n="out" s={iconSize} /><span>Sign out</span></>
    : variant === 'pri'
      ? <>Sign out</>
      : <><Icon n="out" s={iconSize} />Sign out</>;
  return <BusyBtn busy={busy} cls={cls} act="logout" label={label} busyLabel="Signing out…" />;
}
