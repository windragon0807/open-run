import { NextResponse } from 'next/server'

export function proxy() {
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/',
    '/admin/:path*',
    '/avatar',
    '/bung/:bungId',
    '/explore',
    '/challenges',
    '/challenges/reward/:userChallengeId',
    '/notifications',
  ],
}
