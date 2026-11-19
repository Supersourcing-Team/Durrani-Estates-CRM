import { api } from "./axios";
import { apiEndpoints } from "./apiEndpoint";
import { workspaceMutationHeaders } from "./mutationHeaders";
import type { ApiResponse } from "./types";
import type {
  CallAttempt,
  LogCallPayload,
  NextActionPayload,
  PaginatedMeta,
  WorkspaceAction,
  WorkspaceActivity,
  WorkspaceCall,
  WorkspaceEscalation,
  WorkspaceNote,
  WorkspaceOptions,
} from "./workspace.types";

type Cycle = string | null | undefined;

function asList<T>(data: unknown): T[] {
  if (Array.isArray(data)) return data as T[];
  if (data && typeof data === "object") {
    const o = data as Record<string, unknown>;
    if (Array.isArray(o.results)) return o.results as T[];
    if (Array.isArray(o.items)) return o.items as T[];
  }
  return [];
}

function metaOf(envelope: ApiResponse<unknown>): PaginatedMeta | undefined {
  return (envelope.meta as PaginatedMeta) || undefined;
}

export async function getWorkspaceOptions() {
  const { data } = await api.get<ApiResponse<WorkspaceOptions>>(apiEndpoints.workspace.options);
  return data.data;
}

export async function startCallAttempt(leadId: string | number, ownershipCycle: Cycle) {
  const { data } = await api.post<ApiResponse<CallAttempt>>(
    apiEndpoints.workspace.callAttempts(leadId),
    {},
    { headers: workspaceMutationHeaders(ownershipCycle) },
  );
  return data.data;
}

export async function getPendingCallAttempt() {
  const { data } = await api.get<ApiResponse<CallAttempt | null>>(
    apiEndpoints.workspace.pendingAttempt,
  );
  return data.data;
}

export async function abandonCallAttempt(attemptId: string | number, reason = "abandoned") {
  const { data } = await api.post<ApiResponse<CallAttempt>>(
    apiEndpoints.workspace.abandonAttempt(attemptId),
    { reason },
  );
  return data.data;
}

export async function logCall(
  leadId: string | number,
  payload: LogCallPayload,
  ownershipCycle: Cycle,
) {
  const { data } = await api.post<ApiResponse<WorkspaceCall>>(
    apiEndpoints.workspace.calls(leadId),
    payload,
    { headers: workspaceMutationHeaders(ownershipCycle) },
  );
  return data.data;
}

export async function listCalls(leadId: string | number, params?: { limit?: number; offset?: number }) {
  const { data } = await api.get<ApiResponse<WorkspaceCall[]>>(apiEndpoints.workspace.calls(leadId), {
    params,
  });
  return { items: asList<WorkspaceCall>(data.data), meta: metaOf(data), raw: data };
}

export async function createNextAction(
  leadId: string | number,
  payload: NextActionPayload,
  ownershipCycle: Cycle,
) {
  const { data } = await api.post<ApiResponse<WorkspaceAction>>(
    apiEndpoints.workspace.nextActions(leadId),
    payload,
    { headers: workspaceMutationHeaders(ownershipCycle) },
  );
  return data.data;
}

export async function listNextActions(
  leadId: string | number,
  params?: { status?: string; limit?: number; offset?: number },
) {
  const { data } = await api.get<ApiResponse<WorkspaceAction[]>>(
    apiEndpoints.workspace.nextActions(leadId),
    { params },
  );
  return { items: asList<WorkspaceAction>(data.data), meta: metaOf(data), raw: data };
}

export async function updateNextAction(
  actionId: string | number,
  payload: Partial<NextActionPayload>,
  ownershipCycle: Cycle,
) {
  const { data } = await api.patch<ApiResponse<WorkspaceAction>>(
    apiEndpoints.workspace.nextActionById(actionId),
    payload,
    { headers: workspaceMutationHeaders(ownershipCycle) },
  );
  return data.data;
}

export async function completeNextAction(
  actionId: string | number,
  ownershipCycle: Cycle,
  outcome: string,
) {
  const { data } = await api.post<ApiResponse<WorkspaceAction>>(
    apiEndpoints.workspace.completeAction(actionId),
    { outcome },
    { headers: workspaceMutationHeaders(ownershipCycle) },
  );
  return data.data;
}

export async function cancelNextAction(
  actionId: string | number,
  ownershipCycle: Cycle,
  outcome: string,
) {
  const { data } = await api.post<ApiResponse<WorkspaceAction>>(
    apiEndpoints.workspace.cancelAction(actionId),
    { outcome },
    { headers: workspaceMutationHeaders(ownershipCycle) },
  );
  return data.data;
}

export async function getMySchedule(params?: {
  view?: string;
  from?: string;
  to?: string;
  status?: string;
  search?: string;
  limit?: number;
  offset?: number;
}) {
  const { data } = await api.get<ApiResponse<WorkspaceAction[]>>(apiEndpoints.workspace.schedule, {
    params,
  });
  return { items: asList<WorkspaceAction>(data.data), meta: metaOf(data), raw: data };
}

export async function listMeetings(leadId: string | number) {
  const { data } = await api.get<ApiResponse<unknown>>(apiEndpoints.workspace.meetings(leadId));
  return { items: asList(data.data), meta: metaOf(data), raw: data };
}

export async function markMeetingNoShow(
  meetingId: string | number,
  ownershipCycle: Cycle,
  outcome: string,
) {
  const { data } = await api.post<ApiResponse<WorkspaceAction>>(
    apiEndpoints.workspace.meetingNoShow(meetingId),
    { outcome },
    { headers: workspaceMutationHeaders(ownershipCycle) },
  );
  return data.data;
}

export async function createNote(leadId: string | number, text: string, ownershipCycle: Cycle) {
  const { data } = await api.post<ApiResponse<WorkspaceNote>>(
    apiEndpoints.workspace.notes(leadId),
    { text },
    { headers: workspaceMutationHeaders(ownershipCycle) },
  );
  return data.data;
}

export async function listNotes(
  leadId: string | number,
  params?: { limit?: number; offset?: number },
) {
  const { data } = await api.get<ApiResponse<WorkspaceNote[]>>(apiEndpoints.workspace.notes(leadId), {
    params,
  });
  return { items: asList<WorkspaceNote>(data.data), meta: metaOf(data), raw: data };
}

export async function getTimeline(
  leadId: string | number,
  params?: { limit?: number; offset?: number; kind?: string; search?: string },
) {
  const { data } = await api.get<ApiResponse<WorkspaceActivity[]>>(
    apiEndpoints.workspace.timeline(leadId),
    { params },
  );
  return { items: asList<WorkspaceActivity>(data.data), meta: metaOf(data), raw: data };
}

export async function listEscalations(params?: {
  status?: string;
  lead_id?: string | number;
  search?: string;
  limit?: number;
  offset?: number;
}) {
  const { data } = await api.get<ApiResponse<WorkspaceEscalation[]>>(
    apiEndpoints.workspace.escalations,
    { params },
  );
  return { items: asList<WorkspaceEscalation>(data.data), meta: metaOf(data), raw: data };
}

export async function createEscalation(
  leadId: string | number,
  payload: { category: string; explanation: string },
  ownershipCycle: Cycle,
) {
  const { data } = await api.post<ApiResponse<WorkspaceEscalation>>(
    apiEndpoints.workspace.escalate(leadId),
    payload,
    { headers: workspaceMutationHeaders(ownershipCycle) },
  );
  return data.data;
}

export async function respondEscalation(
  escalationId: string | number,
  payload: { decision: "information_requested" | "resolved" | string; explanation: string },
  ownershipCycle: Cycle,
) {
  const { data } = await api.post(
    apiEndpoints.workspace.escalationResponse(escalationId),
    payload,
    { headers: workspaceMutationHeaders(ownershipCycle) },
  );
  return data.data;
}

export async function sendNudge(leadId: string | number, ownershipCycle: Cycle, text: string) {
  const { data } = await api.post(
    apiEndpoints.workspace.nudge(leadId),
    { text },
    { headers: workspaceMutationHeaders(ownershipCycle) },
  );
  return data.data;
}
