import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 인증이 필요하지 않은 public 경로들
const publicPaths = [
  '/signin',
  '/signup',
  '/naver/callback',
  '/kakao/callback',
  '/',
  '/favicon.ico',
  '/fonts',
  '/images',
  '/api',
]

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('ACCESSTOKEN')?.value
  const path = request.nextUrl.pathname

  // public 경로는 통과
  if (publicPaths.some((publicPath) => path.startsWith(publicPath))) {
    return NextResponse.next()
  }

  // 토큰이 없는 경우 로그인 페이지로 리다이렉트
  if (!token) {
    return NextResponse.redirect(new URL('/signin', request.url))
  }

  try {
    // 토큰 유효성 검증을 위한 API 호출
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/v1/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      // 토큰이 유효하지 않은 경우 로그인 페이지로 리다이렉트
      return NextResponse.redirect(new URL('/signin', request.url))
    }

    return NextResponse.next()
  } catch (error) {
    // API 호출 실패 시 로그인 페이지로 리다이렉트
    return NextResponse.redirect(new URL('/signin', request.url))
  }
}

// 미들웨어를 적용할 경로 설정
export const config = {
  matcher: [
    /*
     * 다음 경로들을 제외한 모든 페이지 요청에 대해 미들웨어 적용:
     * - api (API 라우트)
     * - _next (Next.js 시스템 파일)
     * - public paths (signin, signup)
     */
    '/((?!api|_next).*)',
  ],
}
