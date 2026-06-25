'use client'

import type { WearingAvatar } from '@type/avatar'
import { ANALYTICS_EVENTS, AvatarSavedProperties } from '@analytics/events'
import { trackEvent } from '@analytics/client'

export const avatarAnalytics = {
  saved(avatar: WearingAvatar) {
    trackEvent(ANALYTICS_EVENTS.AVATAR_SAVED, {
      equipped_slot_count: getEquippedSlotCount(avatar),
    } satisfies AvatarSavedProperties)
  },

  saveFailed() {
    trackEvent(ANALYTICS_EVENTS.AVATAR_SAVE_FAILED)
  },
}

function getEquippedSlotCount(avatar: WearingAvatar) {
  const mainSlotCount = [
    avatar.fullSet,
    avatar.upperClothing,
    avatar.lowerClothing,
    avatar.footwear,
    avatar.face,
    avatar.skin,
    avatar.hair,
  ].filter(Boolean).length
  const accessorySlotCount = Object.values(avatar.accessories).filter(Boolean).length

  return mainSlotCount + accessorySlotCount
}
