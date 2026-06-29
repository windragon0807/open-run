export const COOKIE = {
  ACCESSTOKEN: 'ACCESSTOKEN',
} as const

export const ACCESS_TOKEN_MAX_AGE_SECONDS = 60 * 60

export const AUTH_API_PATH = {
  REFRESH: '/v1/auth/refresh',
  LOGOUT: '/v1/auth/logout',
} as const
