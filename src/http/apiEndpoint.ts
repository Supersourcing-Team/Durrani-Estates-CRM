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
    qualify: (id: string | number) => `/v1/leads/${id}/qualify/`,
    archive: (id: string | number) => `/v1/leads/${id}/archive/`,
    dnd: (id: string | number) => `/v1/leads/${id}/dnd/`,
    removeDnd: (id: string | number) => `/v1/leads/${id}/remove-dnd/`,
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
};
