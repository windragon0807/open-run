'use client'

import { useRouter } from 'next/navigation'
import { ReactNode, createContext, startTransition, useCallback, useContext, useEffect, useMemo, useState } from 'react'

type FinishViewTransition = () => void
type RegisterFinishViewTransition = (finishViewTransition: FinishViewTransition) => void

type TransitionOptions = {
  onTransitionReady?: () => void
}

type Router = ReturnType<typeof useRouter>
type RouterPushOptions = Parameters<Router['push']>[1] & TransitionOptions
type RouterReplaceOptions = Parameters<Router['replace']>[1] & TransitionOptions

type RouteViewTransitionRouter = Router & {
  push: (href: string, options?: RouterPushOptions) => void
  replace: (href: string, options?: RouterReplaceOptions) => void
}

const RouteViewTransitionContext = createContext<RegisterFinishViewTransition | null>(null)

export default function RouteViewTransitions({ children }: { children: ReactNode }) {
  const [finishViewTransition, setFinishViewTransition] = useState<FinishViewTransition | null>(null)

  const registerFinishViewTransition = useCallback<RegisterFinishViewTransition>((nextFinishViewTransition) => {
    setFinishViewTransition(() => nextFinishViewTransition)
  }, [])

  useEffect(() => {
    if (finishViewTransition == null) return

    finishViewTransition()
    setFinishViewTransition(null)
  }, [finishViewTransition])

  return (
    <RouteViewTransitionContext.Provider value={registerFinishViewTransition}>
      {children}
    </RouteViewTransitionContext.Provider>
  )
}

export function useRouteViewTransitionRouter(): RouteViewTransitionRouter {
  const router = useRouter()
  const registerFinishViewTransition = useContext(RouteViewTransitionContext)

  if (registerFinishViewTransition == null) {
    throw new Error('useRouteViewTransitionRouter must be used within RouteViewTransitions')
  }

  const triggerTransition = useCallback(
    (navigate: () => void, { onTransitionReady }: TransitionOptions = {}) => {
      if (!('startViewTransition' in document)) {
        navigate()
        return
      }

      const transition = document.startViewTransition(
        () =>
          new Promise<void>((resolve) => {
            startTransition(() => {
              navigate()
              registerFinishViewTransition(resolve)
            })
          }),
      )

      if (onTransitionReady != null) {
        void transition.ready.then(onTransitionReady)
      }
    },
    [registerFinishViewTransition],
  )

  const push = useCallback(
    (href: string, { onTransitionReady, ...options }: RouterPushOptions = {}) => {
      triggerTransition(() => router.push(href, options), { onTransitionReady })
    },
    [router, triggerTransition],
  )

  const replace = useCallback(
    (href: string, { onTransitionReady, ...options }: RouterReplaceOptions = {}) => {
      triggerTransition(() => router.replace(href, options), { onTransitionReady })
    },
    [router, triggerTransition],
  )

  return useMemo(
    () => ({
      ...router,
      push,
      replace,
    }),
    [push, replace, router],
  )
}
