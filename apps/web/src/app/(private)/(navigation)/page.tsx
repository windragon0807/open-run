'use client'

import ChallengeSwiper from '@components/home/ChallengeSwiper'
import Header from '@components/home/Header'
import Recommendation from '@components/home/Recommendation'
import ScheduledBungs from '@components/home/ScheduledBungs'
import Spacing from '@shared/Spacing'
import { useAppStore } from '@store/app'

export default function Page() {
  const { isApp, insets } = useAppStore()

  const appTopPadding = insets ? insets.top + 5 : isApp ? 64 : 0
  const contentPaddingTop = 200 + appTopPadding

  return (
    <div className='relative h-full bg-gray-lighten'>
      <Header />
      <section className='h-full overflow-y-auto pb-96' style={{ paddingTop: contentPaddingTop }}>
        {/* <ChallengeSwiper /> */}
        <Spacing size={8} />
        <ScheduledBungs />
        <Spacing size={40} />
        <Recommendation />
      </section>
    </div>
  )
}
