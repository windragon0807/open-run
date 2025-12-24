'use client'

import { useMotionValueEvent, useScroll } from 'framer-motion'
import { useRef, useState } from 'react'
import ChallengeSwiper from '@components/home/ChallengeSwiper'
import Header from '@components/home/Header'
import Recommendation from '@components/home/Recommendation'
import ScheduledBungs from '@components/home/ScheduledBungs'
import Spacing from '@shared/Spacing'

export default function Page() {
  const [isSmallHeaderActive, setIsSmallHeaderActive] = useState(false)

  const scrollRef = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll({
    container: scrollRef,
  })

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setIsSmallHeaderActive(latest >= 50)
  })

  return (
    <div className='relative h-full bg-gray-lighten'>
      <Header isSmallHeaderActive={isSmallHeaderActive} />
      <section ref={scrollRef} className='h-full overflow-y-auto pb-96 pt-200 app:pt-[264px]'>
        <ChallengeSwiper />
        <Spacing size={8} />
        <ScheduledBungs />
        <Spacing size={40} />
        <Recommendation />
      </section>
    </div>
  )
}
