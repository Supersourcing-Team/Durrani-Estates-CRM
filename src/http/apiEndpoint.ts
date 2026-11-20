/**
 * Central API path registry.
 * Full paths including /v1 — base URL is host only.
 */
export const apiEndpoints = {
  auth: {
    login: "/v1/auth/login/",
    logout: "/v1/auth/logout/",
    refresh: "/v1/auth/refresh/",
    me: "/v1/auth/me/",
    invite: "/v1/auth/invite/",
    inviteByToken: (token: string) => `/v1/auth/invite/${token}/`,
    acceptInvite: "/v1/auth/accept-invite/",
    forgotPassword: "/v1/auth/forgot-password/",
    resetPasswordByToken: (token: string) => `/v1/auth/reset-password/${token}/`,
    resetPassword: "/v1/auth/reset-password/",
    changePassword: "/v1/auth/change-password/",
  },
  leads: {
    list: "/v1/leads/",
    byId: (id: string | number) => `/v1/leads/${id}/`,
    profile: (id: string | number) => `/v1/leads/${id}/profile/`,
    qualification: (id: string | number) => `/v1/leads/${id}/qualification/`,
    archive: (id: string | number) => `/v1/leads/${id}/archive/`,
    dnd: (id: string | number) => `/v1/leads/${id}/dnd/`,
    removeDnd: (id: string | number) => `/v1/leads/${id}/remove-dnd/`,
  },
  /** Lead sources list: not in the API doc yet, so these are tried in order (see http/leadSources.ts). */
  leadSources: {
    candidates: ["/v1/lead-sources/", "/v1/leads/sources/", "/v1/leads/lead-sources/", "/v1/sources/"],
  },
  /** Lead Pipeline — Workspace */
  workspace: {
    options: "/v1/workspace/options/",
    callAttempts: (leadId: string | number) => `/v1/workspace/leads/${leadId}/call-attempts/`,
    pendingAttempt: "/v1/workspace/call-attempts/pending/",
    abandonAttempt: (id: string | number) => `/v1/workspace/call-attempts/${id}/abandon/`,
    calls: (leadId: string | number) => `/v1/workspace/leads/${leadId}/calls/`,
    nextActions: (leadId: string | number) => `/v1/workspace/leads/${leadId}/next-actions/`,
    nextActionById: (id: string | number) => `/v1/workspace/next-actions/${id}/`,
    completeAction: (id: string | number) => `/v1/workspace/next-actions/${id}/complete/`,
    cancelAction: (id: string | number) => `/v1/workspace/next-actions/${id}/cancel/`,
    schedule: "/v1/workspace/schedule/",
    meetings: (leadId: string | number) => `/v1/workspace/leads/${leadId}/meetings/`,
    meetingNoShow: (id: string | number) => `/v1/workspace/meetings/${id}/no-show/`,
    notes: (leadId: string | number) => `/v1/workspace/leads/${leadId}/notes/`,
    timeline: (leadId: string | number) => `/v1/workspace/leads/${leadId}/timeline/`,
    escalations: "/v1/workspace/escalations/",
    escalate: (leadId: string | number) => `/v1/workspace/leads/${leadId}/escalations/`,
    escalationResponse: (id: string | number) => `/v1/workspace/escalations/${id}/responses/`,
    nudge: (leadId: string | number) => `/v1/workspace/leads/${leadId}/nudges/`,
  },
  /** Lead Pipeline — Rules engine */
  rulesEngine: {
    status: (leadId: string | number) => `/v1/rules-engine/leads/${leadId}/status/`,
    history: (leadId: string | number) => `/v1/rules-engine/leads/${leadId}/history/`,
    holds: (leadId: string | number) => `/v1/rules-engine/leads/${leadId}/holds/`,
    releaseHold: (leadId: string | number, holdId: string | number) =>
      `/v1/rules-engine/leads/${leadId}/holds/${holdId}/release/`,
  },
  /** Module 3 — Property Sales */
  catalogue: {
    developers: "/v1/catalogue/developers/",
    projects: "/v1/catalogue/projects/",
    projectById: (id: string | number) => `/v1/catalogue/projects/${id}/`,
    projectUnits: (id: string | number) => `/v1/catalogue/projects/${id}/units/`,
    unitById: (unitId: string | number) => `/v1/catalogue/units/${unitId}/`,
    releaseHold: (unitId: string | number) => `/v1/catalogue/units/${unitId}/release-hold/`,
    shortlist: "/v1/catalogue/shortlist/",
    availabilityRequests: "/v1/catalogue/availability-requests/",
    availabilityDecision: (id: string | number) =>
      `/v1/catalogue/availability-requests/${id}/decision/`,
  },
  deals: {
    bookings: "/v1/deals/bookings/",
    bookingById: (id: string | number) => `/v1/deals/bookings/${id}/`,
    approve: (id: string | number) => `/v1/deals/bookings/${id}/approve/`,
    requestChanges: (id: string | number) => `/v1/deals/bookings/${id}/request-changes/`,
    reject: (id: string | number) => `/v1/deals/bookings/${id}/reject/`,
    resubmit: (id: string | number) => `/v1/deals/bookings/${id}/resubmit/`,
    spaIssued: (id: string | number) => `/v1/deals/bookings/${id}/spa-issued/`,
    document: (id: string | number, category: string) =>
      `/v1/deals/bookings/${id}/documents/${category}/`,
    documentDecision: (id: string | number, category: string) =>
      `/v1/deals/bookings/${id}/documents/${category}/decision/`,
    payments: (id: string | number) => `/v1/deals/bookings/${id}/payments/`,
    close: (id: string | number) => `/v1/deals/bookings/${id}/close/`,
  },
  commission: {
    list: "/v1/commission/",
    byId: (id: string | number) => `/v1/commission/${id}/`,
    developerInvoiced: (id: string | number) => `/v1/commission/${id}/developer-invoiced/`,
    developerReceived: (id: string | number) => `/v1/commission/${id}/developer-received/`,
    release: (id: string | number) => `/v1/commission/${id}/release/`,
    adjust: (id: string | number) => `/v1/commission/${id}/adjust/`,
    slabs: "/v1/commission/slabs/",
  },
  /** Module 4 — Org settings */
  settings: {
    root: "/v1/settings/",
    cn: "/v1/settings/cn/",
    cnCommission: "/v1/settings/cn-commission/",
    fx: "/v1/settings/fx/",
    inactivityRules: "/v1/settings/inactivity-rules/",
    inactivityRuleById: (id: string | number) => `/v1/settings/inactivity-rules/${id}/`,
  },
  /** Module 4 — Convertible Notes */
  convertibleNotes: {
    calculator: "/v1/convertible-notes/calculator/",
    applications: "/v1/convertible-notes/applications/",
    applicationById: (id: string | number) => `/v1/convertible-notes/applications/${id}/`,
    share: (id: string | number) => `/v1/convertible-notes/applications/${id}/share/`,
    commit: (id: string | number) => `/v1/convertible-notes/applications/${id}/commit/`,
    startDocuments: (id: string | number) =>
      `/v1/convertible-notes/applications/${id}/start-documents/`,
    document: (id: string | number, category: string) =>
      `/v1/convertible-notes/applications/${id}/documents/${category}/`,
    documentDecision: (id: string | number, category: string) =>
      `/v1/convertible-notes/applications/${id}/documents/${category}/decision/`,
    pdcRegister: (id: string | number) => `/v1/convertible-notes/applications/${id}/pdc-register/`,
    submit: (id: string | number) => `/v1/convertible-notes/applications/${id}/submit/`,
    sendBack: (id: string | number) => `/v1/convertible-notes/applications/${id}/send-back/`,
    approve: (id: string | number) => `/v1/convertible-notes/applications/${id}/approve/`,
    notes: "/v1/convertible-notes/notes/",
    noteById: (id: string | number) => `/v1/convertible-notes/notes/${id}/`,
    payoutPay: (id: string | number, n: string | number) =>
      `/v1/convertible-notes/notes/${id}/payouts/${n}/pay/`,
    payoutBounce: (id: string | number, n: string | number) =>
      `/v1/convertible-notes/notes/${id}/payouts/${n}/bounce/`,
    payoutFix: (id: string | number, n: string | number) =>
      `/v1/convertible-notes/notes/${id}/payouts/${n}/fix/`,
    repayPrincipal: (id: string | number) => `/v1/convertible-notes/notes/${id}/repay-principal/`,
    renew: (id: string | number) => `/v1/convertible-notes/notes/${id}/renew/`,
    commissions: "/v1/convertible-notes/commissions/",
    commissionRelease: (id: string | number) =>
      `/v1/convertible-notes/commissions/${id}/release/`,
  },
};
