'use client'

import { noop } from 'lodash'
import { createContext } from 'react'

import { AdsPlacementModel, AdPlatform, AdShape } from '@marketplace-web/ads/ads-data'

import { RegisterPlacementProps, SlotInfo } from './types'

export type AdsContextType = {
  placements: Array<AdsPlacementModel>
  segments: Record<string, string>
  hasAdBlockerBeenTracked: boolean
  shouldMockAds: boolean
  isAdBlockerUsed: boolean | null
  adBlockerVisitorId: string | null
  setIsAdBlockerUsed: (isAdBlockerUsed: boolean) => void
  setHasAdBlockerBeenTracked: (hasAdBlockerBeenTracked: boolean) => void
  setAdBlockerVisitorId: (adBlockerVisitorId: string) => void
  registerPlacement: (props: RegisterPlacementProps) => void
  generatePlacementId: (adShape: AdShape) => string
  generateIncrementalPlacementId: () => string
  unregisterPlacement: (id: string) => void
  getAdsPlatform: (userAgent: string) => AdPlatform
  getSlotInfo: (placementId?: string) => SlotInfo | undefined
}

const AdsContext = createContext<AdsContextType>({
  placements: [],
  segments: {},
  hasAdBlockerBeenTracked: false,
  shouldMockAds: false,
  isAdBlockerUsed: null,
  adBlockerVisitorId: null,
  setIsAdBlockerUsed: noop,
  setHasAdBlockerBeenTracked: noop,
  setAdBlockerVisitorId: noop,
  registerPlacement: noop,
  generatePlacementId: () => 'slot-rectangle',
  unregisterPlacement: noop,
  getAdsPlatform: () => AdPlatform.Web,
  generateIncrementalPlacementId: () => 'adplacement-1',
  getSlotInfo: () => undefined,
})

export default AdsContext
