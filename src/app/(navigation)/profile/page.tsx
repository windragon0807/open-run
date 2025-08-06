import { Metadata } from 'next'
import Profile from '@components/profile/Profile'
import AuthGuard from '@shared/AuthGuard'
import Layout from '@shared/Layout'

export default function Page() {
  return (
    <AuthGuard>
      <Layout>
        <Profile />
      </Layout>
    </AuthGuard>
  )
}

export const metadata: Metadata = {
  title: '프로필',
}
