'use client'

import Error from '@shared/Error'

export default function ErrorPage() {
  return (
    <section className='h-screen w-screen'>
      <Error type='large' />
    </section>
  )
}
