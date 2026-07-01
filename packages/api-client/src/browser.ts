import 'client-only'

import { getCookie } from './cookie'
import { COOKIE } from './constants'
import { createHttpClient } from './core'

export { COOKIE }

const http = createHttpClient({
  baseURL: process.env.NEXT_PUBLIC_API_SERVER_URL,
  getHeaders: () => {
    const token = getCookie(COOKIE.ACCESSTOKEN)
    return token ? { Authorization: token } : undefined
  },
})

export default http
