/* Lead pop-ups opened from a lead by an agent, manager or Admin (prototype MD keys). */
import type { ScreenMap, ModalMap } from '../../app/types';
import { AddLeadModal } from './AddLeadModal';
import { SchedModal } from './SchedModal';
import { SendConfirmModal } from './SendConfirmModal';
import { ShareModal } from './ShareModal';
import { EscalateModal } from './EscalateModal';
import { NoteModal } from './NoteModal';
import { ArchiveModal } from './ArchiveModal';
import { DndModal } from './DndModal';
import { EmailComposeModal } from './EmailComposeModal';
import { CallLogModal } from './CallLogModal';
import { DocUploadModal } from './DocUploadModal';
import { DocViewLeadModal } from './DocViewLeadModal';
import { BlockedModal } from './BlockedModal';
import { ReassignModal } from './ReassignModal';
import { HoldModal } from './HoldModal';
import { NudgeModal } from './NudgeModal';
import { LeadEditModal } from './LeadEditModal';
import { LeadQualEditModal } from './LeadQualEditModal';
import { LeadShortlistAddModal } from './LeadShortlistAddModal';

export { AgentOpts, TeamOpts, ReasonFld } from './assignParts';

export const screens: ScreenMap = {};
export const modals: ModalMap = {
  'add-lead': AddLeadModal,
  sched: SchedModal,
  'send-confirm': SendConfirmModal,
  share: ShareModal,
  escalate: EscalateModal,
  note: NoteModal,
  archive: ArchiveModal,
  dnd: DndModal,
  'email-compose': EmailComposeModal,
  'call-log': CallLogModal,
  'doc-upload': DocUploadModal,
  'doc-view-lead': DocViewLeadModal,
  blocked: BlockedModal,
  // manager / Admin
  reassign: ReassignModal,
  hold: HoldModal,
  nudge: NudgeModal,
  // Admin lead editing
  'lead-edit': LeadEditModal,
  'lead-qual-edit': LeadQualEditModal,
  'lead-shortlist-add': LeadShortlistAddModal,
};
