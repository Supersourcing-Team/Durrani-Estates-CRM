import type { ScreenMap, ModalMap } from '../../app/types';
import { Login } from './Login';
import { LoginForgot } from './LoginForgot';
import { LoginReset } from './LoginReset';
import { Invite } from './Invite';
import { Notifications } from './Notifications';
import { Settings, MgmtSettings } from './Settings';
import { Schedule } from './Schedule';
import { AccountMenuModal } from './AccountMenuModal';
import { MoreNavModal } from './MoreNavModal';
import { PwChangeModal } from './PwChangeModal';

export const screens: ScreenMap = {
  login: Login,
  'login-forgot': LoginForgot,
  'login-reset': LoginReset,
  invite: Invite,
  'agent-notifications': Notifications,
  'agent-settings': Settings,
  'mgmt-settings': MgmtSettings,
  'mgmt-notifications': Notifications,
  'admin-notifications': Notifications,
  'agent-schedule': Schedule,
};
export const modals: ModalMap = {
  'account-menu': AccountMenuModal,
  'more-nav': MoreNavModal,
  'pw-change': PwChangeModal,
};
