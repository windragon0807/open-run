'use client'

import posthog from 'posthog-js'
import type { AnalyticsEventName, AnalyticsProperties } from '@analytics/events'

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com'

let initialized = false

function getIsAnalyticsEnabled() {
  return typeof window !== 'undefined' && Boolean(POSTHOG_KEY)
}

function sanitizeProperties(properties?: AnalyticsProperties) {
  if (properties == null) return undefined

  return Object.entries(properties).reduce<Record<string, string | number | boolean>>((acc, [key, value]) => {
    if (value == null) return acc
    acc[key] = value
    return acc
  }, {})
}

export function initAnalytics() {
  if (!getIsAnalyticsEnabled() || initialized) return

  posthog.init(POSTHOG_KEY!, {
    api_host: POSTHOG_HOST,
    defaults: '2026-05-30',
    autocapture: false,
    capture_pageview: false,
    capture_pageleave: false,
    capture_dead_clicks: false,
    capture_performance: false,
    capture_heatmaps: false,
    disable_scroll_properties: true,
    disable_session_recording: true,
    enable_heatmaps: false,
    person_profiles: 'identified_only',
  })

  initialized = true
}

export function trackEvent(eventName: AnalyticsEventName, properties?: AnalyticsProperties) {
  if (!getIsAnalyticsEnabled()) return

  initAnalytics()
  posthog.capture(eventName, sanitizeProperties(properties))
}

export function identifyUser(distinctId: string, properties?: AnalyticsProperties) {
  if (!getIsAnalyticsEnabled()) return

  initAnalytics()
  posthog.identify(distinctId, sanitizeProperties(properties))
}

export function resetAnalyticsUser() {
  if (!getIsAnalyticsEnabled()) return

  initAnalytics()
  posthog.reset()
}
