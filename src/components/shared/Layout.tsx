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
    <main className={`h-dvh w-dvw ${className}`} style={{ ...style, paddingTop: message.statusBarHeight }}>
      <section className='mx-auto h-full w-full max-w-tablet overflow-hidden'>{children}</section>
    </main>
  )
}
