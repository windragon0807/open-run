'use client'

import axios from 'axios'
import { useRouter } from 'next/navigation'
import { ReactNode } from 'react'
import { useUserStore } from '@store/user'
import { useUserInfo } from '@apis/users/fetchUserInfo/query'

export default function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter()
  const { userInfo, setUserInfo } = useUserStore()

  useUserInfo({
    onSuccess: (data) => {
      if (axios.isAxiosError(data)) {
        router.push('/signin')
      }

      setUserInfo(data.data)
    },
  })

  if (userInfo == null) {
    return null
  }

  return children
}
