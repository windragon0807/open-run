'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import useSignin from '@hooks/useSignin'

export default function NaverCallbackPage() {
  const router = useRouter()

  const params = useSearchParams()
  const code = params.get('code')
  const state = params.get('state')

  const { getToken } = useSignin()

  useEffect(() => {
    if (code == null) {
      alert('로그인에 실패했습니다.')
      router.replace('/signin')
    }

    getToken(
      {
        authServer: 'naver',
        code: code as string,
        state: state as string,
      },
      {
        onSuccess: () => {
          alert('로그인에 성공했습니다.')
          router.replace('/')
        },
        onError: () => {
          alert('토큰을 받아오는데 실패했습니다.')
          router.replace('/signin')
        },
      },
    )
  }, [code, state, router, getToken])

  // TODO 빠르게 처리되지 않으면 로딩 화면 띄워줘야 함
  return <div></div>
}
