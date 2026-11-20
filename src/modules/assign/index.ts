import type { ScreenMap, ModalMap } from '../../app/types';
import { MgmtLeads } from './MgmtLeads';
import { MgmtAssign } from './MgmtAssign';
import { AdminLeads } from './AdminLeads';
import { AdminAssign } from './AdminAssign';
import { AdminImport } from './AdminImport';
import { AdminImportNew } from './AdminImportNew';
import { EscRespondModal } from './EscRespondModal';
import { AssignInfoModal } from './AssignInfoModal';
import { AutodistModal } from './AutodistModal';
import { AssignLeadModal } from './AssignLeadModal';
import { BulkReassignModal } from './BulkReassignModal';

export { AgentOpts, TeamOpts, ReasonFld } from './parts';

/* Lead lists and lead distribution for managers and Admin */
export const screens: ScreenMap = {
  'mgmt-leads': MgmtLeads,
  'mgmt-assign': MgmtAssign,
  'admin-leads': AdminLeads,
  'admin-assign': AdminAssign,
  'admin-import': AdminImport,
  'admin-importnew': AdminImportNew,
};
export const modals: ModalMap = {
  'esc-respond': EscRespondModal,
  'assign-info': AssignInfoModal,
  'autodist': AutodistModal,
  'bulk-reassign': BulkReassignModal,
  'assign-lead': AssignLeadModal,
};
