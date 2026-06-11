import 'server-only'

import { cookies } from 'next/headers'
import { COOKIE } from './constants'
import { createHttpClient } from './core'

export { COOKIE }

const http = createHttpClient({
  baseURL: process.env.NEXT_PUBLIC_API_SERVER_URL,
  getHeaders: async () => {
    const token = (await cookies()).get(COOKIE.ACCESSTOKEN)?.value
    return token ? { Authorization: token } : undefined
  },
})

export default http
