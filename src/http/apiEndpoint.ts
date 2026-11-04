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
};
