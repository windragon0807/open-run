'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import useSignin from '@hooks/useSignin'

export default function KakaoCallbackPage() {
  const router = useRouter()

  const params = useSearchParams()
  const code = params.get('code')

  const { getToken } = useSignin()

  useEffect(() => {
    if (code == null) {
      alert('로그인에 실패했습니다.')
      router.replace('/signin')
    }

    getToken(
      {
        authServer: 'kakao',
        code: code as string,
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
  }, [code, router, getToken])

  // TODO 빠르게 처리되지 않으면 로딩 화면 띄워줘야 함
  return <div></div>
}
