import { Metadata } from 'next'
import Profile from '@components/profile/Profile'
import AuthGuard from '@shared/AuthGuard'

export default function Page() {
  return (
    <AuthGuard>
      <Profile />
    </AuthGuard>
  )
}

export const metadata: Metadata = {
  title: '프로필',
}
