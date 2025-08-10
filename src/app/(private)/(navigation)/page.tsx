'use client'

import ChallengeSwiper from '@components/home/ChallengeSwiper'
import Header from '@components/home/Header'
import Recommendation from '@components/home/Recommendation'
import ScheduledBungs from '@components/home/ScheduledBungs'
import Spacing from '@shared/Spacing'

export default function HomePage() {
  return (
    <div className='relative h-full overflow-y-auto bg-gray-lighten pb-96'>
      <Header />
      <ChallengeSwiper />
      <Spacing size={8} />
      <ScheduledBungs />
      <Spacing size={40} />
      <Recommendation />
    </div>
  )
}
