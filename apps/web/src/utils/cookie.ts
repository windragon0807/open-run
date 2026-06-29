import { Cookies } from 'react-cookie'

const cookies = new Cookies()

export const getCookie = (key: string) => {
  return cookies.get(key)
}

export const setCookie = (key: string, value: string, maxAge?: number) => {
  cookies.set(key, value, {
    path: '/',
    maxAge,
    sameSite: 'lax',
    secure: typeof window !== 'undefined' && window.location.protocol === 'https:',
  })
}

export const removeCookie = (key: string) => {
  cookies.remove(key, { path: '/' })
}
