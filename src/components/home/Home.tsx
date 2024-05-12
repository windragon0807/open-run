'use client'

import { getUserInfo } from '@/apis/auth/getUserInfo/api'
import { useRouter } from 'next/navigation'
import { useQuery } from 'react-query'

export default function HomePage() {
  const router = useRouter()

  const { data } = useQuery({ queryKey: ['users'], queryFn: () => getUserInfo() })

  console.log('ryong', data)

  return (
    <article>
      <button onClick={() => router.push('/signin')}>로그인 화면으로 돌아가기</button>
    </article>
  )
}
