/* eslint no-restricted-globals:0 */

'use client'

import { useMemo } from 'react'

import Relay from '../utils/relay'
import Store from '../utils/store'
import EventTracker from '../utils/client-event-tracker'

import TrackingContext from './TrackingContext'

const EVENT_TRACKER_STORE_NAMESPACE = 'VintedEvents'
const EVENT_TRACKER_RELAY_URL = '/relay/events'

const TrackingProvider = ({ children }) => {
  const tracker = useMemo(
    () =>
      new EventTracker({
        store: new Store(EVENT_TRACKER_STORE_NAMESPACE),
        relay: new Relay(EVENT_TRACKER_RELAY_URL),
        context: null,
      }),
    [],
  )
  const contextValue = useMemo(() => ({ tracker }), [tracker])

  return <TrackingContext.Provider value={contextValue}>{children}</TrackingContext.Provider>
}

export default TrackingProvider
