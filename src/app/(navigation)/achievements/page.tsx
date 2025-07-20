import { Metadata } from 'next'
import AchievementPage from '@components/achievement'
import AuthGuard from '@shared/AuthGuard'
import Layout from '@shared/Layout'

export default async function Page() {
  return (
    <AuthGuard>
      <Layout className='bg-white'>
        <AchievementPage />
      </Layout>
    </AuthGuard>
  )
}

export const metadata: Metadata = {
  title: '도전 과제',
}
