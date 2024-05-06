import { Cookies } from 'react-cookie'

const cookies = new Cookies()

export const getCookie = (key: string) => {
  return cookies.get(key)
}

/* 쿠키 만료기간은 하루로 고정 */
export const setCookie = (key: string, value: string | number) => {
  const oneDayFromNow = new Date()
  oneDayFromNow.setDate(oneDayFromNow.getDate() + 1)

  cookies.set(key, value, {
    path: '/',
    expires: oneDayFromNow,
  })
}

export const removeCookie = (key: string) => {
  cookies.remove(key, { path: '/' })
}
