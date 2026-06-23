'use client'

import { useCallback, useEffect, useRef, type RefObject, type UIEvent } from 'react'

const RESTORE_DELAYS = [120, 360] as const

interface UseElementScrollRestorationOptions {
  storageKey: string
}

interface UseElementScrollRestorationReturn<TElement extends HTMLElement> {
  ref: RefObject<TElement | null>
  onScroll: (event: UIEvent<TElement>) => void
}

export default function useElementScrollRestoration<TElement extends HTMLElement>({
  storageKey,
}: UseElementScrollRestorationOptions): UseElementScrollRestorationReturn<TElement> {
  const ref = useRef<TElement>(null)
  const saveFrameRef = useRef<number | null>(null)
  const pendingScrollTopRef = useRef<number | null>(null)

  const flushScrollTop = useCallback(() => {
    if (pendingScrollTopRef.current == null) {
      return
    }

    window.sessionStorage.setItem(storageKey, String(pendingScrollTopRef.current))
  }, [storageKey])

  const handleScroll = useCallback(
    (event: UIEvent<TElement>) => {
      pendingScrollTopRef.current = event.currentTarget.scrollTop

      if (saveFrameRef.current != null) {
        return
      }

      saveFrameRef.current = window.requestAnimationFrame(() => {
        saveFrameRef.current = null
        flushScrollTop()
      })
    },
    [flushScrollTop],
  )

  useEffect(() => {
    const savedScrollTop = Number(window.sessionStorage.getItem(storageKey) ?? 0)

    if (!Number.isFinite(savedScrollTop) || savedScrollTop <= 0) {
      return
    }

    const restoreScrollTop = () => {
      if (ref.current == null) {
        return
      }

      ref.current.scrollTop = savedScrollTop
    }

    const frameId = window.requestAnimationFrame(restoreScrollTop)
    const timeoutIds = RESTORE_DELAYS.map((delay) => window.setTimeout(restoreScrollTop, delay))

    return () => {
      window.cancelAnimationFrame(frameId)
      timeoutIds.forEach((timeoutId) => window.clearTimeout(timeoutId))
    }
  }, [storageKey])

  useEffect(() => {
    return () => {
      if (saveFrameRef.current != null) {
        window.cancelAnimationFrame(saveFrameRef.current)
        saveFrameRef.current = null
      }

      flushScrollTop()
    }
  }, [flushScrollTop])

  return {
    ref,
    onScroll: handleScroll,
  }
}
