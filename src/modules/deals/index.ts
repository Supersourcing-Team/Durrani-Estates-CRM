import type { ScreenMap, ModalMap } from '../../app/types';
import { Catalogue, MgmtProjects } from './Catalogue';
import { AdminProjects } from './AdminProjects';
import { ProjectDetail, projectDetail } from './ProjectDetail';
import { Bookings } from './Bookings';
import { MgmtBookings } from './MgmtBookings';
import { BookingNew } from './BookingNew';
import { BookingDetail, MgmtBookingDetail } from './BookingDetail';
import { ShortlistAddModal } from './ShortlistAddModal';
import { PaymentModal } from './PaymentModal';
import { AvailModal } from './AvailModal';
import { PickLeadModal } from './PickLeadModal';
import { BkSpaModal } from './BkSpaModal';
import { BkDocModal } from './BkDocModal';
import { BkResubmitModal } from './BkResubmitModal';
import { ProjectEditModal } from './ProjectEditModal';
import { UnitEditModal } from './UnitEditModal';

export const screens: ScreenMap = {
  'agent-catalogue': Catalogue,
  'agent-project': ProjectDetail,
  'agent-bookings': Bookings,
  'agent-bookingnew': BookingNew,
  'agent-booking': BookingDetail,
  /* Manager */
  'mgmt-projects': MgmtProjects,
  'mgmt-project': projectDetail('mgmt'),
  'mgmt-bookings': MgmtBookings,
  'mgmt-booking': MgmtBookingDetail,
  /* Admin */
  'admin-projects': AdminProjects,
  'admin-project': projectDetail('admin'),
};
export const modals: ModalMap = {
  'shortlist-add': ShortlistAddModal,
  payment: PaymentModal,
  avail: AvailModal,
  'pick-lead': PickLeadModal,
  'bk-spa': BkSpaModal,
  'bk-doc': BkDocModal,
  'bk-resubmit': BkResubmitModal,
  'project-edit': ProjectEditModal,
  'unit-edit': UnitEditModal,
};
