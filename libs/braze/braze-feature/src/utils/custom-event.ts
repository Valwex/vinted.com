import { isEqual, throttle } from 'lodash'

import {
  BrazeCustomEvent,
  EVENTS_WITH_PROPERTIES_FROM_BACKEND,
  getBrazeEventProperties,
  logBrazeMessage,
} from '@marketplace-web/braze/braze-data'
import {
  getLocalStorageItem,
  removeLocalStorageItem,
  setLocalStorageItem,
} from '@marketplace-web/browser/browser-storage-util'

import { flushBraze } from './async-utils'

export type BrazeCustomEventPayload = {
  event: BrazeCustomEvent
  userExternalId: string | undefined | null
  modelId?: number
  extra?: Record<string, unknown>
  screen?: string
}

export const DEFERRED_BRAZE_EVENTS_STORAGE_KEY = 'cached_braze_custom_events'

export function retrieveDeferredBrazeCustomEvents(): ReadonlyArray<BrazeCustomEventPayload> {
  try {
    const currentEvents = getLocalStorageItem(DEFERRED_BRAZE_EVENTS_STORAGE_KEY)

    return currentEvents ? JSON.parse(currentEvents) : []
  } catch {
    // TODO: add error logging
    return []
  }
}

export function deferBrazeCustomEvent(payload: BrazeCustomEventPayload) {
  setLocalStorageItem(
    DEFERRED_BRAZE_EVENTS_STORAGE_KEY,
    JSON.stringify([...retrieveDeferredBrazeCustomEvents(), payload]),
  )
}

/**
 * Removes *provided* Braze custom events that are stored in the local storage
 */
export function removeDeferredBrazeCustomEvents(
  eventPayloads: ReadonlyArray<BrazeCustomEventPayload>,
) {
  setLocalStorageItem(
    DEFERRED_BRAZE_EVENTS_STORAGE_KEY,
    JSON.stringify(
      retrieveDeferredBrazeCustomEvents().filter(
        deferredEvent =>
          !eventPayloads.some(eventToRemove => isEqual(eventToRemove, deferredEvent)),
      ),
    ),
  )
}

const WAS_BRAZE_EVENT_LOGGED_OR_DEFERRED_STORAGE_KEY = (
  event: BrazeCustomEvent,
  userExternalId: string,
) => `was_braze_${event}_logged_or_deferred_${userExternalId}`

export function removeAllDeferredBrazeCustomEvents() {
  removeLocalStorageItem(DEFERRED_BRAZE_EVENTS_STORAGE_KEY)
}

function wasLoggedOrDeferred(event: BrazeCustomEvent, userExternalId: string) {
  try {
    return (
      getLocalStorageItem(WAS_BRAZE_EVENT_LOGGED_OR_DEFERRED_STORAGE_KEY(event, userExternalId)) ===
      'true'
    )
  } catch {
    return false
  }
}

function markAsLoggedOrDeferred(event: BrazeCustomEvent, userExternalId: string) {
  try {
    setLocalStorageItem(
      WAS_BRAZE_EVENT_LOGGED_OR_DEFERRED_STORAGE_KEY(event, userExternalId),
      'true',
    )
  } catch {
    // Do nothing
  }
}

/**
 * @param {boolean} options.defer - if true, defers the event for later logging with `flushCustomEvents`
 * @param {boolean} options.once - if true, logs the event only once
 */
export async function brazeLogCustomEvent(
  payload: BrazeCustomEventPayload,
  options?: {
    defer?: true
    oncePerUser?: true
  },
) {
  const { event, userExternalId, extra: extraEventProperties, screen, modelId } = payload
  if (!userExternalId) {
    // Temporary logging
    logBrazeMessage('Attempted to log Braze custom event without externalId')
    logBrazeMessage(`Attempted to log Braze ${event} event without externalId`)
  }

  async function getEventProperties() {
    const baseEventProperties = screen ? { screen } : {}

    if (extraEventProperties) return { ...baseEventProperties, ...extraEventProperties }
    if (!EVENTS_WITH_PROPERTIES_FROM_BACKEND.includes(event)) return baseEventProperties

    const response = await getBrazeEventProperties({ modelId, eventName: event })

    if ('errors' in response) throw new Error('failed retrieving properties')

    return { ...baseEventProperties, ...response.properties }
  }

  try {
    if (options?.oncePerUser && userExternalId) {
      if (wasLoggedOrDeferred(event, userExternalId)) return

      markAsLoggedOrDeferred(event, userExternalId)
    }

    if (options?.defer) {
      deferBrazeCustomEvent(payload)

      return
    }

    const { logCustomEvent } = await import('@braze/web-sdk')

    const customEventSuccessful = logCustomEvent(event, await getEventProperties())

    if (!customEventSuccessful) throw new Error('failed logging custom event')
  } catch (error: unknown) {
    if (userExternalId) deferBrazeCustomEvent(payload)

    const errorMessage = error instanceof Error ? error.message : ''

    if (errorMessage === 'Braze must be initialized before calling methods') return

    logBrazeMessage(
      `eventLoggingError(event: ${event}, reason: ${errorMessage})`,
      `userExternalId: ${String(userExternalId)}`,
    )
  }
}

export async function flushCustomEventsInLocalStorage(userExternalId: string) {
  const eventsToFlush = retrieveDeferredBrazeCustomEvents().filter(
    event => event.userExternalId === userExternalId,
  )

  if (eventsToFlush.length === 0) return

  const loggedEvents = (
    await Promise.allSettled(eventsToFlush.map(payload => brazeLogCustomEvent(payload)))
  )
    .map((result, index) => (result.status === 'fulfilled' ? eventsToFlush[index] : null))
    .filter((event): event is BrazeCustomEventPayload => event !== null)

  removeDeferredBrazeCustomEvents(loggedEvents)
}

export const flushCustomEvents = (userExternalId: string) => {
  Promise.allSettled([flushCustomEventsInLocalStorage(userExternalId)]).then(flushBraze)
}

const FLUSH_CUSTOM_EVENTS_MIN_INTERVAL = 7000

export const flushCustomEventsThrottled = throttle(
  flushCustomEvents,
  FLUSH_CUSTOM_EVENTS_MIN_INTERVAL,
  {
    leading: true,
    trailing: true,
  },
)
