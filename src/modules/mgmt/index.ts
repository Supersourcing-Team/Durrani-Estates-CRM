import type { ScreenMap, ModalMap } from '../../app/types';
import { MgmtHome } from './MgmtHome';
import { MgmtActivity } from './MgmtActivity';
import { MgmtPerformance } from './MgmtPerformance';
import { MgmtAgent } from './MgmtAgent';

/* Manager screens. mgmt-notifications / admin-notifications / mgmt-settings are registered in features/account. */
export const screens: ScreenMap = {
  'mgmt-home': MgmtHome,
  'mgmt-activity': MgmtActivity,
  'mgmt-performance': MgmtPerformance,
  'mgmt-agent': MgmtAgent,
};
export const modals: ModalMap = {};
