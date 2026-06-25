'use client'

import { MouseEvent, ReactNode, useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'framer-motion'
import Link from 'next/link'

type LegalPath = '/privacy' | '/support'

const routeOrder: Record<LegalPath, number> = {
  '/privacy': 0,
  '/support': 1,
}

export function LegalNav({ activePath }: { activePath: LegalPath }) {
  const shouldReduceMotion = useReducedMotion()
  const [visualPath, setVisualPath] = useState(activePath)

  useEffect(() => {
    setVisualPath(activePath)
  }, [activePath])

  return (
    <LayoutGroup id='legal-document-nav'>
      <nav className='flex rounded-8 border border-white/10 bg-white/5 p-4 text-12 font-black leading-none'>
        <LegalNavLink
          href='/privacy'
          active={visualPath === '/privacy'}
          current={activePath === '/privacy'}
          reduceMotion={shouldReduceMotion}
          onNavigate={setVisualPath}>
          PRIVACY
        </LegalNavLink>
        <LegalNavLink
          href='/support'
          active={visualPath === '/support'}
          current={activePath === '/support'}
          reduceMotion={shouldReduceMotion}
          onNavigate={setVisualPath}>
          SUPPORT
        </LegalNavLink>
      </nav>
    </LayoutGroup>
  )
}

function LegalNavLink({
  href,
  active,
  current,
  reduceMotion,
  onNavigate,
  children,
}: {
  href: LegalPath
  active: boolean
  current: boolean
  reduceMotion: boolean | null
  onNavigate: (href: LegalPath) => void
  children: ReactNode
}) {
  return (
    <Link
      href={href}
      aria-current={current ? 'page' : undefined}
      onClick={(event) => {
        if (isModifiedClick(event)) return
        onNavigate(href)
      }}
      className={clsx(
        'relative isolate rounded-4 px-10 py-8 font-jost italic tracking-[0.08em] transition-colors',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary',
        active ? 'text-black-darken' : 'text-white/70 hover:text-white',
      )}>
      {active &&
        (reduceMotion ? (
          <span className='absolute inset-0 -z-10 rounded-4 bg-secondary' aria-hidden />
        ) : (
          <motion.span
            layoutId='legal-document-nav-pill'
            className='absolute inset-0 -z-10 rounded-4 bg-secondary'
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            aria-hidden
          />
        ))}
      <span className='relative'>{children}</span>
    </Link>
  )
}

function isModifiedClick(event: MouseEvent<HTMLAnchorElement>) {
  return event.button !== 0 || event.metaKey || event.altKey || event.ctrlKey || event.shiftKey
}

export function LegalRouteTransition({ routeKey, children }: { routeKey: LegalPath; children: ReactNode }) {
  const shouldReduceMotion = useReducedMotion()
  const currentOrder = routeOrder[routeKey]
  const previousOrderRef = useRef(currentOrder)
  const direction = currentOrder >= previousOrderRef.current ? 1 : -1

  useEffect(() => {
    previousOrderRef.current = currentOrder
  }, [currentOrder])

  if (shouldReduceMotion) {
    return <>{children}</>
  }

  return (
    <AnimatePresence mode='wait' initial={false}>
      <motion.div
        key={routeKey}
        initial={{ opacity: 0, x: direction * 10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: direction * -10 }}
        transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}>
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
