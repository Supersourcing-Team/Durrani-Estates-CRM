import type { ScreenMap, ModalMap } from '../../app/types';
import { AdminHome } from './AdminHome';
import { AdminReports } from './AdminReports';
import { AdminAudit } from './AdminAudit';
import { AdminSettings } from './AdminSettings';
import { AdminSources } from './AdminSources';
import { AuditRowModal } from './AuditRowModal';
import { SlabEditModal } from './SlabEditModal';
import { DndAddModal } from './DndAddModal';
import { TplEditModal } from './TplEditModal';
import { SrcConnectModal } from './SrcConnectModal';
import { SrcRouteModal } from './SrcRouteModal';

/* Admin control screens: home, reports, audit log, settings, lead sources. */
export const screens: ScreenMap = {
  'admin-home': AdminHome,
  'admin-reports': AdminReports,
  'admin-audit': AdminAudit,
  'admin-settings': AdminSettings,
  'admin-sources': AdminSources,
};
export const modals: ModalMap = {
  'audit-row': AuditRowModal,
  'slab-edit': SlabEditModal,
  'dnd-add': DndAddModal,
  'tpl-edit': TplEditModal,
  'src-connect': SrcConnectModal,
  'src-route': SrcRouteModal,
};
