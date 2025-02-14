'use client'

import Error from '@shared/Error'

export default function ErrorPage() {
  return (
    <section className='w-dvw h-dvh'>
      <Error type='large' />
    </section>
  )
}
