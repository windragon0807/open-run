'use client'

import { ANALYTICS_EVENTS, ProfileFeedbackClickedProperties } from '@analytics/events'
import { trackEvent } from '@analytics/client'

export const profileAnalytics = {
  feedbackClicked({ bungId }: { bungId: string | number }) {
    trackEvent(ANALYTICS_EVENTS.PROFILE_FEEDBACK_CLICKED, {
      bung_id: bungId,
    } satisfies ProfileFeedbackClickedProperties)
  },
}
