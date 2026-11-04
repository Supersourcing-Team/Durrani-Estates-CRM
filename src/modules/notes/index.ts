import type { ScreenMap, ModalMap } from '../../app/types';
import { CnList } from './CnList';
import { CnListMgmt } from './CnListMgmt';
import { CnListAdmin } from './CnListAdmin';
import { CnCalc } from './CnCalc';
import { CnApp } from './CnApp';
import { CnAppReview } from './CnAppReview';
import { CnNote } from './CnNote';
import { SecList } from './SecList';
import { SecListMgmt } from './SecListMgmt';
import { SecListAdmin } from './SecListAdmin';
import { SecDetail } from './SecDetail';
import { CnShareModal } from './CnShareModal';
import { CnCommitModal } from './CnCommitModal';
import { CnDocModal } from './CnDocModal';
import { CnPdcModal } from './CnPdcModal';
import { SecReqModal } from './SecReqModal';
import { SecInfoModal } from './SecInfoModal';
import { SecStatusModal } from './SecStatusModal';
import { CnEditModal } from './CnEditModal';
import { PayoutFixModal } from './PayoutFixModal';
import { PayoutPayModal } from './PayoutPayModal';
import { CnInfoModal } from './CnInfoModal';
import { CnReviewModal } from './CnReviewModal';
import { SecNewModal } from './SecNewModal';
import { SecAcceptModal } from './SecAcceptModal';
import { CnDocViewModal } from './CnDocViewModal';
import { CnDocRejModal } from './CnDocRejModal';
import { withRole } from './parts';

/* Convertible notes and the secondary market (agent, manager and Admin web). */
export const screens: ScreenMap = {
  'agent-cn': CnList,
  'mgmt-cn': CnListMgmt,
  'admin-cn': CnListAdmin,
  'agent-cncalc': CnCalc,
  'agent-cnapp': CnApp,
  'mgmt-cnapp': withRole(CnAppReview, 'mgmt'),
  'admin-cnapp': withRole(CnAppReview, 'admin'),
  'agent-cnnote': withRole(CnNote, 'agent'),
  'mgmt-cnnote': withRole(CnNote, 'mgmt'),
  'admin-cnnote': withRole(CnNote, 'admin'),
  'agent-secondary': SecList,
  'mgmt-secondary': SecListMgmt,
  'admin-secondary': SecListAdmin,
  'agent-sec': withRole(SecDetail, 'agent'),
  'mgmt-sec': withRole(SecDetail, 'mgmt'),
  'admin-sec': withRole(SecDetail, 'admin'),
};
export const modals: ModalMap = {
  'cn-share': CnShareModal,
  'cn-commit': CnCommitModal,
  'cn-doc': CnDocModal,
  'cn-pdc': CnPdcModal,
  'sec-req': SecReqModal,
  'sec-info': SecInfoModal,
  'sec-status': SecStatusModal,
  'cn-edit': CnEditModal,
  'payout-fix': PayoutFixModal,
  'payout-pay': PayoutPayModal,
  'cn-info': CnInfoModal,
  'cn-review': CnReviewModal,
  'sec-new': SecNewModal,
  'sec-accept': SecAcceptModal,
  'cn-docview': CnDocViewModal,
  'cn-docrej': CnDocRejModal,
};
