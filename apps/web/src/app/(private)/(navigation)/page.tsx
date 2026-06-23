'use client'

import ChallengeSwiper from '@components/home/ChallengeSwiper'
import Header from '@components/home/Header'
import Recommendation from '@components/home/Recommendation'
import ScheduledBungs from '@components/home/ScheduledBungs'
import Spacing from '@shared/Spacing'
import useElementScrollRestoration from '@hooks/useElementScrollRestoration'
import useAppInsetSize from '@hooks/useAppInsetSize'

const HOME_SCROLL_RESTORATION_KEY = 'openrun:home-scroll-top'

export default function Page() {
  const appTopPadding = useAppInsetSize('top', 0)
  const contentPaddingTop = 200 + appTopPadding
  const { ref: scrollRef, onScroll: handleHomeScroll } = useElementScrollRestoration<HTMLElement>({
    storageKey: HOME_SCROLL_RESTORATION_KEY,
  })

  return (
    <div className='relative h-full bg-gray-lighten'>
      <Header />
      <section
        ref={scrollRef}
        className='scrollbar-hidden h-full overflow-y-auto pb-96'
        style={{ paddingTop: contentPaddingTop }}
        onScroll={handleHomeScroll}
      >
        {/* <ChallengeSwiper /> */}
        <Spacing size={8} />
        <ScheduledBungs />
        <Spacing size={40} />
        <Recommendation />
      </section>
    </div>
  )
}
