'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

import { removeCookie } from '@utils/cookie'
import { COOKIE } from '@constants/cookie'

type Props = {
  error: Error
  reset: () => void
}

export default function ErrorPage({ error, reset }: Props) {
  const router = useRouter()

  useEffect(() => {
    console.error('ryong', error)
  }, [error])

  return (
    <div>
      <h2>Something went wrong!</h2>
      <button
        onClick={() => {
          // reset()
          removeCookie(COOKIE.ACCESSTOKEN)
          router.replace('/')
        }}>
        Try again
      </button>
    </div>
  )
}
