import Header from '@components/home/Header'
import Permission from '@components/home/Permission'
import Recommendation from '@components/home/Recommendation'
import ScheduledBungs from '@components/home/ScheduledBungs'
import AuthGuard from '@shared/AuthGuard'
import Layout from '@shared/Layout'
import Spacing from '@shared/Spacing'

export default async function HomePage() {
  return (
    <AuthGuard>
      <Layout className='bg-gray-lighten'>
        <Permission />
        <div className='h-full overflow-y-auto'>
          <Header />
          <Spacing size={40} />
          {/* 참여 예정 */}
          <ScheduledBungs />
          <Spacing size={40} />
          {/* 추천 */}
          <Recommendation />
          <Spacing size={96} />
        </div>
      </Layout>
    </AuthGuard>
  )
}
