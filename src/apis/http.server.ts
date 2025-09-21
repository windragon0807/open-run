'server-only'

import { cookies } from 'next/headers'
import qs from 'qs'
import { COOKIE } from '@constants/cookie'

export const http = {
  get: async ({ url, params, options }: { url: string; params?: unknown; options?: RequestInit }) => {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get(COOKIE.ACCESSTOKEN)?.value
    const query = qs.stringify(params)

    try {
      const requestUrl = `${url}?${query}`
      const response = await fetch(requestUrl, {
        headers: accessToken != null ? { Authorization: accessToken } : undefined,
        ...options,
      })

      if (!response.ok) {
        const errorMessage = 'Failed to fetch'
        const errorDetails = {
          url: requestUrl,
          status: response.status,
          statusText: response.statusText,
        }
        throw new Error(errorMessage, { cause: errorDetails })
      }

      const data = await response.json()
      console.info('API Response:', requestUrl, data)

      return data
    } catch (error) {
      throw new Error('Failed to parse JSON', { cause: error })
    }
  },
}
