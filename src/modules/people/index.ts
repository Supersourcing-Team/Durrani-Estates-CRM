import type { ScreenMap, ModalMap } from '../../app/types';
import { AgentAttendance } from './AgentAttendance';
import { AgentAttCal, MgmtAttCal } from './AttCalendar';
import { AgentPerformance } from './AgentPerformance';
import { AgentLeaderboard } from './AgentLeaderboard';
import { MgmtAttendance } from './MgmtAttendance';
import { MgmtLeave } from './MgmtLeave';
import { AdminHr } from './AdminHr';
import { AdminPeople } from './AdminPeople';
import { AdminUser } from './AdminUser';
import { PunchModal } from './PunchModal';
import { LeaveReqModal } from './LeaveReqModal';
import { RegulariseModal } from './RegulariseModal';
import { AttDayModal } from './AttDayModal';
import { RegRejectModal, LeaveRejectModal } from './RejectModals';
import { LeaveApplyModal } from './LeaveApplyModal';
import { ReqUndoModal } from './ReqUndoModal';
import { UserFormModal } from './UserFormModal';
import { TeamFormModal } from './TeamFormModal';
import { DeactivateModal } from './DeactivateModal';
import { IpDetailModal } from './IpDetailModal';

export const screens: ScreenMap = {
  'agent-attendance': AgentAttendance,
  'agent-attcal': AgentAttCal,
  'agent-performance': AgentPerformance,
  'agent-leaderboard': AgentLeaderboard,
  'mgmt-attendance': MgmtAttendance,
  'mgmt-attcal': MgmtAttCal,
  'mgmt-myatt': AgentAttendance, /* prototype: R['agent-attendance'].render([]) with manager wording */
  'mgmt-leave': MgmtLeave,
  'admin-hr': AdminHr,
  'admin-people': AdminPeople,
  'admin-user': AdminUser,
};
export const modals: ModalMap = {
  punch: PunchModal,
  'leave-req': LeaveReqModal,
  regularise: RegulariseModal,
  'att-day': AttDayModal,
  'reg-reject': RegRejectModal,
  'leave-reject': LeaveRejectModal,
  'leave-apply': LeaveApplyModal,
  'req-undo': ReqUndoModal,
  'user-form': UserFormModal,
  'team-form': TeamFormModal,
  deactivate: DeactivateModal,
  'ip-detail': IpDetailModal,
};
