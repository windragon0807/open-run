'use client'

import clsx from 'clsx'
import { usePathname } from 'next/navigation'
import { ReactNode, useEffect, useLayoutEffect, useRef, useState } from 'react'
import ChallengePage from '@components/challenges/ChallengePage'
import Explore from '@components/explore/Explore'
import HomePage from '@components/home/HomePage'
import Profile from '@components/profile/Profile'
import { getNavigationRouteIndex, NAVIGATION_ROUTES } from '@constants/navigationRoutes'

type Props = {
  fallback: ReactNode
}

type Direction = -1 | 0 | 1

const SWITCH_DURATION_MS = 340
const SWITCH_EASING = 'cubic-bezier(0.22, 1, 0.36, 1)'
const useEnhancedLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect

const NAVIGATION_PANES = [
  { key: NAVIGATION_ROUTES[0].key, Component: HomePage },
  { key: NAVIGATION_ROUTES[1].key, Component: Explore },
  { key: NAVIGATION_ROUTES[2].key, Component: ChallengePage },
  { key: NAVIGATION_ROUTES[3].key, Component: Profile },
] as const

const getDirection = (previousIndex: number | null, currentIndex: number | null): Direction => {
  if (previousIndex == null || currentIndex == null || previousIndex === currentIndex) return 0
  return currentIndex > previousIndex ? 1 : -1
}

const getRestingOffset = (paneIndex: number, activeIndex: number) => (paneIndex < activeIndex ? -100 : 100)

function usePrefersReducedMotion() {
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updatePreference = () => setShouldReduceMotion(media.matches)

    updatePreference()
    media.addEventListener('change', updatePreference)
    return () => media.removeEventListener('change', updatePreference)
  }, [])

  return shouldReduceMotion
}

export default function PersistentNavigationTabs({ fallback }: Props) {
  const pathname = usePathname()
  const activeIndex = getNavigationRouteIndex(pathname)
  const lastActiveIndexRef = useRef<number | null>(activeIndex)
  const [previousIndex, setPreviousIndex] = useState<number | null>(null)
  const [direction, setDirection] = useState<Direction>(0)
  const shouldReduceMotion = usePrefersReducedMotion()

  useEnhancedLayoutEffect(() => {
    if (activeIndex == null) return

    const lastActiveIndex = lastActiveIndexRef.current
    if (lastActiveIndex == null || lastActiveIndex === activeIndex) {
      lastActiveIndexRef.current = activeIndex
      setPreviousIndex(null)
      setDirection(0)
      return
    }

    setPreviousIndex(lastActiveIndex)
    setDirection(getDirection(lastActiveIndex, activeIndex))
    lastActiveIndexRef.current = activeIndex
  }, [activeIndex])

  useEffect(() => {
    if (previousIndex == null) return
    if (shouldReduceMotion) {
      setPreviousIndex(null)
      return
    }

    const timeout = window.setTimeout(() => setPreviousIndex(null), SWITCH_DURATION_MS)
    return () => window.clearTimeout(timeout)
  }, [previousIndex, shouldReduceMotion])

  if (activeIndex == null) {
    return <div className='h-full w-full'>{fallback}</div>
  }

  return (
    <div className='relative h-full w-full overflow-hidden bg-gray-lighten'>
      {NAVIGATION_PANES.map((pane, paneIndex) => {
        const Pane = pane.Component
        const isActive = paneIndex === activeIndex
        const isExiting = paneIndex === previousIndex
        const isVisible = isActive || isExiting
        const offset = isActive
          ? 0
          : isExiting
            ? direction > 0
              ? -100
              : 100
            : getRestingOffset(paneIndex, activeIndex)

        return (
          <section
            key={pane.key}
            aria-hidden={!isActive}
            inert={!isActive}
            className={clsx(
              'absolute inset-0 h-full w-full transform-gpu overflow-hidden bg-gray-lighten',
              !isActive && 'pointer-events-none',
            )}
            style={{
              zIndex: isActive ? 2 : isExiting ? 1 : 0,
              visibility: isVisible ? 'visible' : 'hidden',
              opacity: isVisible ? 1 : 0,
              transform: `translate3d(${shouldReduceMotion ? 0 : offset}%, 0, 0)`,
              transitionDuration: shouldReduceMotion ? '0ms' : `${SWITCH_DURATION_MS}ms`,
              transitionProperty: shouldReduceMotion ? 'opacity' : 'transform, opacity',
              transitionTimingFunction: SWITCH_EASING,
            }}>
            <Pane />
          </section>
        )
      })}
    </div>
  )
}
