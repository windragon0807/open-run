'use client'

import { CSSProperties, ReactNode } from 'react'
import { useAppMessage } from '@store/app'

export default function Layout({
  children,
  className,
  style,
}: {
  children: ReactNode
  className?: string
  style?: CSSProperties
}) {
  const { message } = useAppMessage()
  return (
    <main className={`w-dvw h-dvh ${className}`} style={{ ...style, paddingTop: message.statusBarHeight }}>
      <section className='w-full h-full mx-auto max-w-tablet overflow-hidden'>{children}</section>
    </main>
  )
}
