import { toParams } from '@marketplace-web/browser/url-util'

import { TrackingEvent } from '../types/tracking-event'
import { PreparedTrackingEvent, TrackingEventContext } from '../types'

export const EVENT_TRACKER_PLATFORM = 'web'
const EVENT_TRACKER_ID = 'v4'

const buildEvent = (
  event: TrackingEvent,
  context: TrackingEventContext,
  path = window.location.pathname,
): PreparedTrackingEvent => ({
  event: event.event,
  anon_id: context.anonId,
  user_id: event.userId || context.userId,
  lang_code: context.languageCode,
  extra: {
    path,
    screen: context.screen.name,
    utm_campaign: context.utm.campaign,
    utm_source: context.utm.source,
    utm_medium: context.utm.medium,
    utm_content: context.utm.content,
    utm_term: context.utm.term,
    ...event.extra,
  },
  time: Date.now(),
})

const buildRequestHeaders = (context: TrackingEventContext) => {
  const headers = {
    'X-Portal': context.portal,
    'X-Platform': context.platform || EVENT_TRACKER_PLATFORM,
    'X-Debug-Info': EVENT_TRACKER_ID,
    'X-Local-Time': String(Date.now()),
    'X-Screen-Width': String(context.screen.width),
    'X-Screen-Height': String(context.screen.height),
  }

  if (context.debugPin) headers['X-Debug-Pin'] = String(context.debugPin)

  return headers
}

const utmParams = ['utm_campaign', 'utm_source', 'utm_medium', 'utm_content', 'utm_term'] as const

type UtmParams = Partial<Record<(typeof utmParams)[number], string>>

const getScreenUtmParams = (search = window.location.search) => {
  const queryParams = toParams(search)

  return utmParams.reduce((accumulator: UtmParams, key) => {
    const param = queryParams[key]

    if (param && typeof param === 'string') accumulator[key] = param

    return accumulator
  }, {})
}

export { buildEvent, buildRequestHeaders, getScreenUtmParams }
