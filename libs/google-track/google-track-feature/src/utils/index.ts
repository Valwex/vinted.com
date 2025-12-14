import { GTM_EC_EVENT_FIELD, GoogleTagManagerEvent } from '../constants'

export const googleTagManagerTrack = (
  event: GoogleTagManagerEvent,
  data: NonNullable<typeof window.dataLayer>[number],
  isGtmEcFieldEnabled = false,
) => {
  const eventData = {
    ...data,
    event,
  }

  if (!isGtmEcFieldEnabled) {
    delete eventData[GTM_EC_EVENT_FIELD]
  }

  window.dataLayer = window.dataLayer || []

  window.dataLayer.push(eventData)
}
