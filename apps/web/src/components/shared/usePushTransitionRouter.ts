'use client'

import { useMemo } from 'react'
import { useRouteViewTransitionRouter } from './RouteViewTransitions'
import { finishPushRouteTransition, preparePushRouteTransition } from './pushRouteTransition'

type PushOptions = Parameters<ReturnType<typeof useRouteViewTransitionRouter>['push']>[1]
type ReplaceOptions = Parameters<ReturnType<typeof useRouteViewTransitionRouter>['replace']>[1]

export default function usePushTransitionRouter() {
  const router = useRouteViewTransitionRouter()

  return useMemo(
    () => ({
      ...router,
      push: (href: string, options?: PushOptions) => {
        const shouldAnimate = preparePushRouteTransition()
        router.push(href, withTransitionReady(options, shouldAnimate))
      },
      replace: (href: string, options?: ReplaceOptions) => {
        const shouldAnimate = preparePushRouteTransition()
        router.replace(href, withTransitionReady(options, shouldAnimate))
      },
    }),
    [router],
  )
}

function withTransitionReady<T extends PushOptions | ReplaceOptions>(options: T | undefined, shouldAnimate: boolean): T | undefined {
  if (!shouldAnimate && options?.onTransitionReady == null) return options

  return {
    ...options,
    onTransitionReady: () => {
      options?.onTransitionReady?.()
      if (shouldAnimate) {
        finishPushRouteTransition()
      }
    },
  } as T
}
