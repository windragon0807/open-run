'use client'

import { ReactNode, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAdminMeQuery } from '@apis/v1/admin/query'
import { logoutSession } from '@openrun/api-client/auth'
import { COOKIE } from '@openrun/api-client/constants'
import { removeCookie } from '@openrun/api-client/cookie'
import { LoadingLogo } from '@openrun/ui'

export default function AdminAuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter()
  const { data, isError, isSuccess } = useAdminMeQuery()
  const isAdmin = data?.data.admin === true

  useEffect(() => {
    if (isError || (isSuccess && !isAdmin)) {
      void logoutSession()
      removeCookie(COOKIE.ACCESSTOKEN)
      router.replace('/signin')
    }
  }, [isAdmin, isError, isSuccess, router])

  if (!isSuccess || !isAdmin) {
    return (
      <main className='flex min-h-dvh items-center justify-center bg-gray-lighten'>
        <LoadingLogo className='w-120 text-primary' />
      </main>
    )
  }

  return children
}
