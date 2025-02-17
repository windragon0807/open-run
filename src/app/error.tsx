'use client'

import Error from '@shared/Error'

export default function ErrorPage() {
  return (
    <section className='w-screen h-screen'>
      <Error type='large' />
    </section>
  )
}
