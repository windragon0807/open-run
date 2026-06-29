const PUSH_ROUTE_VIEW_TRANSITION_CLASS = 'push-route-view-transition'
const PUSH_ROUTE_VIEW_TRANSITION_DURATION_MS = 340
const PUSH_ROUTE_VIEW_TRANSITION_READY_TIMEOUT_MS = 10000
const PUSH_ROUTE_VIEW_TRANSITION_CLEANUP_BUFFER_MS = 120

let cleanupTimer: number | null = null

export function preparePushRouteTransition() {
  if (typeof window === 'undefined') return false
  if (!('startViewTransition' in document)) return false
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false

  if (cleanupTimer != null) {
    window.clearTimeout(cleanupTimer)
  }

  document.documentElement.classList.add(PUSH_ROUTE_VIEW_TRANSITION_CLASS)
  cleanupTimer = window.setTimeout(() => {
    document.documentElement.classList.remove(PUSH_ROUTE_VIEW_TRANSITION_CLASS)
    cleanupTimer = null
  }, PUSH_ROUTE_VIEW_TRANSITION_READY_TIMEOUT_MS)

  return true
}

export function finishPushRouteTransition() {
  if (typeof window === 'undefined') return

  if (cleanupTimer != null) {
    window.clearTimeout(cleanupTimer)
  }

  cleanupTimer = window.setTimeout(() => {
    document.documentElement.classList.remove(PUSH_ROUTE_VIEW_TRANSITION_CLASS)
    cleanupTimer = null
  }, PUSH_ROUTE_VIEW_TRANSITION_DURATION_MS + PUSH_ROUTE_VIEW_TRANSITION_CLEANUP_BUFFER_MS)
}
