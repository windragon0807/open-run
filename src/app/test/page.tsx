'use client'

import LoadingLogo from '@shared/LoadingLogo'

export default function TestPage() {
  return (
    <section className='flex items-center justify-center w-dvw h-dvh bg-primary'>
      <LoadingLogo color='var(--secondary)' size={100} />
    </section>
  )
}
