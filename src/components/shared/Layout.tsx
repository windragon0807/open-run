import { ReactNode } from 'react'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <main className='w-[100dvw] h-[100dvh]'>
      <section className='w-full h-full mx-auto max-w-tablet overflow-hidden'>{children}</section>
    </main>
  )
}
