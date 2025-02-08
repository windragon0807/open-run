import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { COOKIE } from '@constants/cookie'
import { certifyAuth } from '@apis/middlewares/certifyAuth/api'

export async function middleware(request: NextRequest) {
  /* 카카오, 네이버 로그인 처리 */
  const pathname = request.nextUrl.pathname
  if (pathname.includes('/callback')) {
    const authServer = pathname.split('/')[1] as 'kakao' | 'naver'
    const response = await certifyAuth({
      authServer,
      code: request.nextUrl.searchParams.get('code') as string,
      state: request.nextUrl.searchParams.get('state'),
    })

    if (response.data.nickname == null) {
      return NextResponse.redirect(new URL('/register', request.url))
    }

    const jwtToken = response.data.jwtToken

    const next = NextResponse.redirect(new URL('/', request.url))
    next.cookies.set(COOKIE.ACCESSTOKEN, jwtToken)
    return next
  }

  /* 토큰이 없는 경우 로그인 페이지로 리다이렉트 */
  const token = request.cookies.get(COOKIE.ACCESSTOKEN)?.value
  if (!token) {
    return NextResponse.redirect(new URL('/signin', request.url))
  }
}

// 미들웨어를 적용할 경로 설정
export const config = {
  matcher: ['/', '/kakao/callback', '/naver/callback', '/avatar', '/bung/:bungId'],
}
