'use client'

import ChallengeSwiper from '@components/home/ChallengeSwiper'
import Header from '@components/home/Header'
import Recommendation from '@components/home/Recommendation'
import ScheduledBungs from '@components/home/ScheduledBungs'
import AuthGuard from '@shared/AuthGuard'
import Layout from '@shared/Layout'
import Spacing from '@shared/Spacing'

export default function HomePage() {
  return (
    <AuthGuard>
      <Layout className='bg-gray-lighten'>
        <div className='relative h-full overflow-y-auto pb-96'>
          <Header />
          <ChallengeSwiper />
          <Spacing size={8} />
          <ScheduledBungs />
          <Spacing size={40} />
          <Recommendation />
        </div>
      </Layout>
    </AuthGuard>
  )
}
