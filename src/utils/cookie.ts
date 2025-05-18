import { Cookies } from 'react-cookie'

const cookies = new Cookies()

export const getCookie = (key: string) => {
  return cookies.get(key)
}

export const setCookie = (key: string, value: string) => {
  cookies.set(key, value, { path: '/' })
}

export const removeCookie = (key: string) => {
  cookies.remove(key, { path: '/' })
}
