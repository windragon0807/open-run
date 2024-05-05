'use client'

import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()

  return (
    <main>
      <button onClick={() => router.push('/signin')}>로그인 화면으로 돌아가기</button>
    </main>
  )
}
