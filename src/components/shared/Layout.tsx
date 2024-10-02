import { CSSProperties, ReactNode } from 'react'

export default function Layout({
  children,
  className,
  style,
}: {
  children: ReactNode
  className?: string
  style?: CSSProperties
}) {
  return (
    <main className={`w-dvw h-dvh ${className}`} style={style}>
      <section className='w-full h-full mx-auto max-w-tablet overflow-hidden'>{children}</section>
    </main>
  )
}
