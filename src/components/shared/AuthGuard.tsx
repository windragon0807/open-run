'use client'

import { useRouter } from 'next/navigation'
import { ReactNode } from 'react'
import { useUserStore } from '@store/user'
import { useUserInfo } from '@apis/users/fetchUserInfo/query'

export default function AuthGuard({ children, loadingFallback }: { children: ReactNode; loadingFallback?: ReactNode }) {
  const router = useRouter()
  const { userInfo, setUserInfo } = useUserStore()

  useUserInfo({
    onSuccess: ({ data }) => {
      if (data?.nickname == null) {
        router.replace('/signin')
      }

      setUserInfo(data)
    },
  })

  if (userInfo == null) {
    return loadingFallback ?? null
  }

  return children
}
