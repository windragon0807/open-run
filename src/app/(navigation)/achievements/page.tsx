import { Metadata } from 'next'
import AchievementPage from '@components/achievement'
import AuthGuard from '@shared/AuthGuard'

export default async function Page() {
  return (
    <AuthGuard>
      <AchievementPage />
    </AuthGuard>
  )
}

export const metadata: Metadata = {
  title: '도전 과제',
}
