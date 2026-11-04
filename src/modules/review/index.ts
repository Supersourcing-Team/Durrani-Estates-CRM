import type { ScreenMap, ModalMap } from '../../app/types';
import { ReviewQueue } from './ReviewQueue';
import { BookingReview } from './BookingReview';
import { Commission } from './Commission';
import { CommDetail } from './CommDetail';
import { DocViewModal } from './DocViewModal';
import { DocRejectModal } from './DocRejectModal';
import { BkChangesModal } from './BkChangesModal';
import { BkRejectModal } from './BkRejectModal';
import { PayProgressModal } from './PayProgressModal';
import { CommAdjustModal } from './CommAdjustModal';
import { CommReleaseModal } from './CommReleaseModal';

/* Admin approvals and money: Bookings Approval queue, booking review, commission. */
export const screens: ScreenMap = {
  'admin-review': ReviewQueue,
  'admin-booking': BookingReview,
  'admin-commission': Commission,
  'admin-comm': CommDetail,
};
export const modals: ModalMap = {
  'doc-view': DocViewModal,
  'doc-reject': DocRejectModal,
  'bk-changes': BkChangesModal,
  'bk-reject': BkRejectModal,
  'pay-progress': PayProgressModal,
  'comm-adjust': CommAdjustModal,
  'comm-release': CommReleaseModal,
};
