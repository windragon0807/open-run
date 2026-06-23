'use client'

import { useCallback, useEffect, useRef, type UIEvent } from 'react'

import ChallengeSwiper from '@components/home/ChallengeSwiper'
import Header from '@components/home/Header'
import Recommendation from '@components/home/Recommendation'
import ScheduledBungs from '@components/home/ScheduledBungs'
import Spacing from '@shared/Spacing'
import useAppInsetSize from '@hooks/useAppInsetSize'

const HOME_SCROLL_RESTORATION_KEY = 'openrun:home-scroll-top'

export default function Page() {
  const appTopPadding = useAppInsetSize('top', 0)
  const contentPaddingTop = 200 + appTopPadding
  const scrollRef = useRef<HTMLElement>(null)

  const handleHomeScroll = useCallback((event: UIEvent<HTMLElement>) => {
    window.sessionStorage.setItem(HOME_SCROLL_RESTORATION_KEY, String(event.currentTarget.scrollTop))
  }, [])

  useEffect(() => {
    const savedScrollTop = Number(window.sessionStorage.getItem(HOME_SCROLL_RESTORATION_KEY) ?? 0)

    if (!Number.isFinite(savedScrollTop) || savedScrollTop <= 0) {
      return
    }

    const restoreHomeScroll = () => {
      if (scrollRef.current == null) {
        return
      }

      scrollRef.current.scrollTop = savedScrollTop
    }

    const frameId = window.requestAnimationFrame(restoreHomeScroll)
    const timeoutIds = [120, 360].map((delay) => window.setTimeout(restoreHomeScroll, delay))

    return () => {
      window.cancelAnimationFrame(frameId)
      timeoutIds.forEach((timeoutId) => window.clearTimeout(timeoutId))
    }
  }, [])

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
