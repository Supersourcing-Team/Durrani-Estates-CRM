import type { ScreenMap, ModalMap } from '../../app/types';
import { AgentLeads } from './AgentLeads';
import { AgentLeadScreen, MgmtLeadScreen, AdminLeadScreen } from './LeadScreen';

export { LeadTable } from './LeadTable';
export { LeadPage } from './LeadScreen';

export const screens: ScreenMap = { 'agent-leads': AgentLeads, 'agent-lead': AgentLeadScreen, 'mgmt-lead': MgmtLeadScreen, 'admin-lead': AdminLeadScreen };
export const modals: ModalMap = {};
