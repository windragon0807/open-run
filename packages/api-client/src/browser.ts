import 'client-only'

import { getCookie, removeCookie, setCookie } from './cookie'
import { ACCESS_TOKEN_MAX_AGE_SECONDS, AUTH_API_PATH, COOKIE } from './constants'
import { createHttpClient } from './core'
import type { ApiResponse } from './type'

export { COOKIE }

type RefreshTokenResponse = ApiResponse<{
  jwtToken: string
}>

const baseURL = process.env.NEXT_PUBLIC_API_SERVER_URL
let refreshPromise: Promise<boolean> | null = null

const http = createHttpClient({
  baseURL,
  getHeaders: () => {
    const token = getCookie(COOKIE.ACCESSTOKEN)
    return token ? { Authorization: token } : undefined
  },
  onUnauthorized: refreshAccessToken,
})

export default http

export async function logoutSession() {
  try {
    await fetch(buildApiUrl(AUTH_API_PATH.LOGOUT), {
      method: 'POST',
      credentials: 'include',
    })
  } catch {
    // Local logout should continue even if the backend session is already unavailable.
  } finally {
    removeCookie(COOKIE.ACCESSTOKEN)
  }
}

function refreshAccessToken() {
  refreshPromise ??= requestRefreshToken().finally(() => {
    refreshPromise = null
  })
  return refreshPromise
}

async function requestRefreshToken() {
  try {
    const response = await fetch(buildApiUrl(AUTH_API_PATH.REFRESH), {
      method: 'POST',
      credentials: 'include',
    })

    if (!response.ok) {
      removeCookie(COOKIE.ACCESSTOKEN)
      return false
    }

    const body = (await response.json()) as RefreshTokenResponse
    const jwtToken = body.data?.jwtToken
    if (!jwtToken) {
      removeCookie(COOKIE.ACCESSTOKEN)
      return false
    }

    setCookie(COOKIE.ACCESSTOKEN, jwtToken, ACCESS_TOKEN_MAX_AGE_SECONDS)
    return true
  } catch {
    removeCookie(COOKIE.ACCESSTOKEN)
    return false
  }
}

function buildApiUrl(path: string) {
  if (baseURL == null) return path
  return new URL(path, baseURL).toString()
}
