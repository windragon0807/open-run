'use client'

import { useRouter } from 'next/navigation'
import { ReactNode } from 'react'
import { useUserStore } from '@store/user'
import { useUserInfo } from '@apis/v1/users/query'

export default function AuthGuard({ children }: { children: ReactNode }) {
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

  if (userInfo.nickname == null) {
    return null
  }

  return children
}
