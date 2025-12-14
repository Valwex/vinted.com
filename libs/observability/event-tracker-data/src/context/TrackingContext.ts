'use client'

import { createContext } from 'react'

import EventTracker from '../utils/client-event-tracker'

type TrackingContextValue = {
  tracker: EventTracker
  screen?: string
}

const TrackingContext = createContext<TrackingContextValue | undefined>(undefined)

export default TrackingContext
