import { Metadata } from 'next'
import AchievementPage from '@components/achievement/AchievementModal'
import AuthGuard from '@shared/AuthGuard'
import Layout from '@shared/Layout'

/**
 * 도전과제 페이지
 *
 * 도전과제 모달 컴포넌트를 렌더링하는 페이지입니다.
 */
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
