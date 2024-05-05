'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

type Props = {
  error: Error
  reset: () => void
}

export default function ErrorPage({ error, reset }: Props) {
  const router = useRouter()

  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div>
      <h2>Something went wrong!</h2>
      <button
        onClick={() => {
          // reset()
          router.replace('/')
        }}>
        Try again
      </button>
    </div>
  )
}
