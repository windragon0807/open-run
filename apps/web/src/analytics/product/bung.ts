'use client'

import {
  ANALYTICS_EVENTS,
  BungCardClickedProperties,
  BungCompletedProperties,
  BungCreatedProperties,
  BungIdProperties,
} from '@analytics/events'
import { trackEvent } from '@analytics/client'

type BungIdInput = {
  bungId: string | number
}

type BungCardClickedInput = BungIdInput & {
  source: BungCardClickedProperties['source']
  position: number
  isOwner?: boolean
  remainingCount?: number
}

type BungCreatedInput = {
  distance: number
  memberNumber: number
  hasAfterRun: boolean
  hashtagCount: number
}

type BungCompletedInput = BungIdInput & {
  memberCount: number
}

export const bungAnalytics = {
  cardClicked({ bungId, source, position, isOwner, remainingCount }: BungCardClickedInput) {
    trackEvent(ANALYTICS_EVENTS.BUNG_CARD_CLICKED, {
      bung_id: bungId,
      source,
      position,
      is_owner: isOwner,
      remaining_count: remainingCount,
    } satisfies BungCardClickedProperties)
  },

  createStarted() {
    trackEvent(ANALYTICS_EVENTS.CREATE_BUNG_STARTED)
  },

  created({ distance, memberNumber, hasAfterRun, hashtagCount }: BungCreatedInput) {
    trackEvent(ANALYTICS_EVENTS.BUNG_CREATED, {
      distance,
      member_number: memberNumber,
      has_after_run: hasAfterRun,
      hashtag_count: hashtagCount,
    } satisfies BungCreatedProperties)
  },

  createFailed() {
    trackEvent(ANALYTICS_EVENTS.BUNG_CREATE_FAILED)
  },

  joinClicked({ bungId }: BungIdInput) {
    trackBungIdEvent(ANALYTICS_EVENTS.BUNG_JOIN_CLICKED, { bungId })
  },

  joinSucceeded({ bungId }: BungIdInput) {
    trackBungIdEvent(ANALYTICS_EVENTS.BUNG_JOIN_SUCCEEDED, { bungId })
  },

  joinFailed({ bungId }: BungIdInput) {
    trackBungIdEvent(ANALYTICS_EVENTS.BUNG_JOIN_FAILED, { bungId })
  },

  completed({ bungId, memberCount }: BungCompletedInput) {
    trackEvent(ANALYTICS_EVENTS.BUNG_COMPLETED, {
      bung_id: bungId,
      member_count: memberCount,
    } satisfies BungCompletedProperties)
  },
}

function trackBungIdEvent(
  eventName:
    | typeof ANALYTICS_EVENTS.BUNG_JOIN_CLICKED
    | typeof ANALYTICS_EVENTS.BUNG_JOIN_SUCCEEDED
    | typeof ANALYTICS_EVENTS.BUNG_JOIN_FAILED,
  { bungId }: BungIdInput,
) {
  trackEvent(eventName, { bung_id: bungId } satisfies BungIdProperties)
}
