'use client'

import { ReactNode, useEffect, useState } from 'react'
import MarketingLayout from './MarketingLayout'

export default function Layout({ children }: { children: ReactNode }) {
  const [isDesktop, setIsDesktop] = useState(true)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 576)
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  // 576px 이상: 마케팅 화면
  if (isDesktop) {
    return (
      <main className='h-dvh w-dvw'>
        <MarketingLayout />
      </main>
    )
  }

  // 576px 이하: 원래 Layout
  return (
    <main className='h-dvh w-dvw'>
      <section className='mx-auto h-full w-full max-w-tablet overflow-hidden'>{children}</section>
    </main>
  )
}
