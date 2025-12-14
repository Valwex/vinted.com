import { throttle } from 'lodash'

import { isPrSandboxHostname } from '@marketplace-web/browser/url-util'

import { TrackingEvent } from '../types/tracking-event'
import { TrackingEventContext } from '../types'
import { buildEvent, buildRequestHeaders, getScreenUtmParams } from './helpers'
import Relay from './relay'
import Store from './store'

export type EventTrackerOptions = {
  relay: Relay
  store: Store
  context: TrackingEventContext | null
}

const EVENT_SYNC_RATE = 1000
export const FAILURES_TO_DISABLE = 3

class EventTracker {
  eventStore: Store

  relay: Relay

  context: TrackingEventContext | null = null

  errorState = {
    consecutiveFailures: 0,
    isDisabled: false,
  }

  // Used when requested events could not be built (due to unavailable context, for example)
  eventQueue: Array<TrackingEvent> = []

  syncThrottled: () => void

  constructor({ relay, store, context }: EventTrackerOptions) {
    this.eventStore = store
    this.relay = relay
    this.context = context
    this.syncThrottled = throttle(this.sync, EVENT_SYNC_RATE)
  }

  drainEventQueue() {
    if (!this.eventQueue.length) return

    this.eventQueue.forEach(event => this.track(event))
    this.eventQueue = []
  }

  updateContext(context: TrackingEventContext) {
    this.context = context
  }

  track = (event: TrackingEvent) => {
    if (this.errorState.isDisabled) return

    // Context may not be available yet, therefore we need to queue the event for it to be built and
    // sent at a later time.
    if (!this.context) {
      this.eventQueue.push(event)

      return
    }

    const screen = {
      width: window.screen.width,
      height: window.screen.height,
      name: this.context.screen?.name,
    }
    const utmParams = getScreenUtmParams()
    const utm = {
      campaign: utmParams.utm_campaign,
      source: utmParams.utm_source,
      medium: utmParams.utm_medium,
      content: utmParams.utm_content,
      term: utmParams.utm_term,
    }
    const preparedEvent = buildEvent(event, { ...this.context, screen, utm })
    this.eventStore.add(preparedEvent)
    this.syncThrottled()
  }

  sync() {
    if (!this.context) return

    const events = this.eventStore.events.pending
    const headers = buildRequestHeaders(this.context)

    const success = () => {
      this.errorState.consecutiveFailures = 0

      this.eventStore.clear('outgoing')
    }

    const failure = () => {
      // temporary workaround so that event tracking can be manually tested in PR sandboxes
      // should be removed when ephemeral environments are reworked
      const isPrSandbox = isPrSandboxHostname(window.location.hostname)

      this.errorState.consecutiveFailures += 1

      if (this.errorState.consecutiveFailures >= FAILURES_TO_DISABLE) {
        if (!isPrSandbox) this.errorState.isDisabled = true
        this.eventQueue = []
        this.eventStore.clear('outgoing')
        this.eventStore.clear('pending')

        return
      }

      // Add outgoing events back to pending queue
      events.forEach(event => this.eventStore.add(event))

      this.eventStore.clear('outgoing')
    }

    this.eventStore.movePending()
    this.relay.transport({ payload: events, headers, success, failure })
  }
}

export default EventTracker
