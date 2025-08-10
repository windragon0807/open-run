import { Metadata } from 'next'
import Explore from '@components/explore/Explore'
import AuthGuard from '@shared/AuthGuard'

export default function Page() {
  return (
    <AuthGuard>
      <Explore />
    </AuthGuard>
  )
}

export const metadata: Metadata = {
  title: '탐색',
}
