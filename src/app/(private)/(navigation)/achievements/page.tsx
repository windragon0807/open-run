import { Metadata } from 'next'
import AchievementPage from '@components/achievement'

export default async function Page() {
  return <AchievementPage />
}

export const metadata: Metadata = {
  title: '도전 과제',
}
