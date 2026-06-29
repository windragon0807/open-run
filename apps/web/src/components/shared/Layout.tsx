'use client'

import { ReactNode, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { ROOT_PORTAL_ID } from '@constants/layout'
import AppStatusBarController from './AppStatusBarController'
import MarketingLayout from './MarketingLayout'

export default function Layout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [isDesktop, setIsDesktop] = useState(true)
  const isPublicDocument = pathname === '/privacy' || pathname === '/support'

  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 576)
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  useEffect(() => {
    if (!isPublicDocument) return

    document.body.classList.remove('touch-none')
    document.body.classList.add('touch-pan-y')

    return () => {
      document.body.classList.add('touch-none')
      document.body.classList.remove('touch-pan-y')
    }
  }, [isPublicDocument])

  if (isPublicDocument) {
    return (
      <>
        <AppStatusBarController />
        <main className='h-dvh w-full touch-pan-y overflow-y-auto overscroll-contain bg-gray-lighten'>{children}</main>
      </>
    )
  }

  if (pathname.startsWith('/admin')) {
    return (
      <>
        <AppStatusBarController />
        <main className='h-dvh w-dvw overflow-hidden'>
          {children}
          <div id={ROOT_PORTAL_ID} />
        </main>
      </>
    )
  }

  // 576px 이상: 마케팅 화면 안 phone mockup에 children을 직접 렌더 (iframe self-embed 제거).
  // 모달 portal은 MarketingLayout 내부 베젤 영역에 배치되어 fixed 자식이 mockup 안에 갇힌다.
  if (isDesktop) {
    return (
      <>
        <AppStatusBarController />
        <main className='h-dvh w-dvw'>
          <MarketingLayout>{children}</MarketingLayout>
        </main>
      </>
    )
  }

  // 576px 이하: 원래 모바일 Layout
  return (
    <>
      <AppStatusBarController />
      <main className='h-dvh w-dvw'>
        <section className='app-route-view-transition-scope mx-auto h-full w-full max-w-tablet overflow-hidden'>
          {children}
        </section>
        <div id={ROOT_PORTAL_ID} />
      </main>
    </>
  )
}
