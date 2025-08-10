import { ReactNode } from 'react'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <main className='h-dvh w-dvw'>
      <section className='mx-auto h-full w-full max-w-tablet overflow-hidden'>{children}</section>
    </main>
  )
}
