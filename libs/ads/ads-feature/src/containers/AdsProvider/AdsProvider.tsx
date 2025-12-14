'use client'

import { useCallback, useMemo, useRef, useState } from 'react'

import {
  AdsPlacementModel,
  AdPlatform,
  RtbAdPlacement,
  AdShape,
} from '@marketplace-web/ads/ads-data'
import { serverSide } from '@marketplace-web/environment/environment-util'
import { isMobile } from '@marketplace-web/consent/consent-feature'

import AdsContext from './AdsContext'
import {
  AdPlacements,
  IndividualRequestManager,
  LocationManager,
  RefreshManager,
  RegisterPlacementProps,
  RequestManager,
  SlotInfo,
} from './types'

import {
  areAllBidsBack,
  createNewAdPlacement,
  fetchAmazonBids,
  fetchPrebidBids,
  isAdVisible,
  isUserActive,
  sendAdserverRequest,
  setupGoogleSlot,
} from './utils'
import {
  ACTIVITY_EVENTS,
  Bidder,
  BidderState,
  DEBOUNCE_TIME,
  GoogleEventName,
  PLACEMENT_REFRESH_INTERVAL,
  REFRESH_AD_TIME,
} from '../../constants'

type Props = {
  placements: Array<AdsPlacementModel>
  segments: Record<string, string>
  shouldMockAds: boolean
  children: React.ReactNode
}

const REFRESH_MANAGER: RefreshManager = {
  isOn: false,
  lastActionTimestamp: Date.now(),
}

const LOCATION_MANAGER: LocationManager = {
  isLocationChangeEventSetup: false,
  lastHref: serverSide ? '/' : window.location.href,
}

const requestManager: RequestManager = Object.values(Bidder).reduce(
  (acc, bidder) => ({ ...acc, [bidder]: BidderState.Idle }),
  {},
)

const AdsProvider = ({ placements, segments, shouldMockAds, children }: Props) => {
  const [hasAdBlockerBeenTracked, setHasAdBlockerBeenTracked] = useState<boolean>(false)
  const [isAdBlockerUsed, setIsAdBlockerUsed] = useState<boolean | null>(null)
  const [adBlockerVisitorId, setAdBlockerVisitorId] = useState<string | null>(null)

  const adPlacementsRef = useRef<AdPlacements>({})
  const adCountRef = useRef(0)
  const slotInfoRef = useRef<Array<SlotInfo>>([])

  const refreshManager = useRef<RefreshManager>(REFRESH_MANAGER)
  const locationManager = useRef<LocationManager>(LOCATION_MANAGER)
  const individualRequestManager = useRef<IndividualRequestManager>({})

  const generateIncrementalPlacementId = useCallback(() => {
    adCountRef.current += 1

    return `adplacement-${adCountRef.current}-int`
  }, [])

  const generatePlacementId = useCallback((adShape: AdShape) => {
    return `slot-${adShape}-int`
  }, [])

  const headerBidderBack = useCallback(
    (bidder: Bidder, placementId: string, state: BidderState) => {
      const placementRequestManager = individualRequestManager.current[placementId] || {
        ...requestManager,
      }

      placementRequestManager[bidder] = state
      individualRequestManager.current[placementId] = placementRequestManager

      const areBidsBack = areAllBidsBack(placementId, individualRequestManager.current)
      const placement = adPlacementsRef.current[placementId]

      if (!placement || !areBidsBack) return

      sendAdserverRequest(placement, placementId, placementRequestManager)
    },
    [],
  )

  const requestHeaderBidding = useCallback(
    (placement: RtbAdPlacement, id: string, refresh = false) => {
      fetchAmazonBids(placement, id, headerBidderBack, refresh)
      fetchPrebidBids(placement, id, headerBidderBack, refresh)
    },
    [headerBidderBack],
  )

  const refreshAd = useCallback(
    (placementId: string) => {
      const placement = adPlacementsRef.current[placementId]

      if (!placement || !individualRequestManager.current[placementId]) return

      individualRequestManager.current[placementId] = { ...requestManager }

      requestHeaderBidding(placement, placementId, true)

      const newPlacement = {
        ...placement,
        activeDuration: 1,
      }

      adPlacementsRef.current[placementId] = newPlacement
    },
    [requestHeaderBidding],
  )

  const handleLocationChange = useCallback(() => {
    if (
      window.location.href !== locationManager.current.lastHref &&
      !!window.adPlacements &&
      !refreshManager.current.debounceTimer
    ) {
      refreshManager.current.debounceTimer = setTimeout(() => {
        refreshManager.current.debounceTimer = undefined
      }, DEBOUNCE_TIME)

      Object.keys(window.adPlacements).forEach(placementId => {
        const placement = adPlacementsRef.current[placementId]

        if (!placement) return

        const { node, isOutOfPageAd } = placement

        if (!isOutOfPageAd && !node) return

        refreshAd(placementId)
      })
    }

    locationManager.current.lastHref = window.location.href
  }, [refreshAd])

  const setupUrlChangeHandler = useCallback(() => {
    if (locationManager.current.isLocationChangeEventSetup || !('Proxy' in window)) return

    window.history.pushState = new Proxy(window.history.pushState, {
      apply: (target, thisArg, argArray: [any, string, string | URL | null | undefined]) => {
        window.dispatchEvent(new Event('locationchange'))

        return target.apply(thisArg, argArray)
      },
    })

    window.addEventListener('locationchange', handleLocationChange)

    locationManager.current.isLocationChangeEventSetup = true
  }, [handleLocationChange])

  const handleRefreshTick = useCallback(() => {
    if (!isUserActive(refreshManager.current)) return

    Object.keys(adPlacementsRef.current)
      .filter(placementId => {
        const placement = adPlacementsRef.current[placementId]

        if (!placement) return false

        const { isManuallyRefreshed, isRefreshEnabled } = placement

        return isRefreshEnabled && !isManuallyRefreshed
      })
      .forEach(placementId => {
        const placement = adPlacementsRef.current[placementId]

        if (!placement) return

        const { isOutOfPageAd, node, activeDuration } = placement
        const isRefreshAvailable = isOutOfPageAd || isAdVisible(node)

        if (!isRefreshAvailable) return

        if (activeDuration >= REFRESH_AD_TIME) {
          refreshAd(placementId)

          return
        }

        adPlacementsRef.current = {
          ...adPlacementsRef.current,
          [placementId]: {
            ...placement,
            activeDuration: activeDuration + 1,
          },
        }
      })
  }, [refreshAd])

  const handleActivityEvent = useCallback(() => {
    refreshManager.current.lastActionTimestamp = Date.now()
  }, [])

  const setupRefresh = useCallback(() => {
    refreshManager.current.isOn = true
    refreshManager.current.refreshInterval = setInterval(
      handleRefreshTick,
      PLACEMENT_REFRESH_INTERVAL,
    )

    ACTIVITY_EVENTS.forEach(event => window.addEventListener(event, handleActivityEvent))

    setupUrlChangeHandler()
  }, [handleRefreshTick, setupUrlChangeHandler, handleActivityEvent])

  const stopAdRefresh = useCallback(() => {
    if (refreshManager.current.refreshInterval)
      clearInterval(refreshManager.current.refreshInterval)

    refreshManager.current.isOn = false

    ACTIVITY_EVENTS.forEach(event => window.removeEventListener(event, handleActivityEvent))

    window.removeEventListener('locationchange', handleLocationChange)
  }, [handleLocationChange, handleActivityEvent])

  const unregisterPlacement = useCallback(
    (placementId: string) => {
      const adPlacement = adPlacementsRef.current[placementId]

      if (!adPlacement) return

      const { googletag } = window

      if (googletag && adPlacement.googleSlot) {
        const slot = adPlacement.googleSlot

        googletag.cmd.push(() => {
          googletag.destroySlots([slot])
        })
      }

      delete individualRequestManager.current[placementId]
      delete adPlacementsRef.current[placementId]

      if (!Object.keys(adPlacementsRef.current).length) stopAdRefresh()
    },
    [stopAdRefresh],
  )

  const getAdsPlatform = useCallback((userAgent: string) => {
    return isMobile(userAgent) ? AdPlatform.Mobile : AdPlatform.Web
  }, [])

  const getSlotInfo = useCallback((placementId?: string) => {
    return slotInfoRef.current.find(info => info.placementId === placementId)
  }, [])

  const registerPlacement = useCallback(
    ({
      id,
      placementConfig,
      onPlacementLoad,
      onPlacementRenderEnded,
      onPlacementRequest,
      onImpressionViewable,
      isRefreshEnabled = false,
      isManuallyRendered = false,
      isManuallyRefreshed = false,
      iframeTitle,
      iabCategories,
      trackingContext,
    }: RegisterPlacementProps) => {
      const node = document.getElementById(id)

      const existingAdPlacement = adPlacementsRef.current[id]

      if (!node || existingAdPlacement) return

      const newAdPlacement = createNewAdPlacement({
        id,
        placementConfig,
        node,
        isRefreshEnabled,
        isManuallyRendered,
        isManuallyRefreshed,
        iabCategories,
      })

      const handleSlotRenderEnded = (event: googletag.events.SlotRenderEndedEvent) => {
        const slotInfo: SlotInfo = {
          placementId: id,
          creativeId: event.creativeId,
          lineItemId: event.lineItemId,
          advertiserId: event.advertiserId,
          campaignId: event.campaignId,
          creativeTemplateId: event.creativeTemplateId,
          sourceAgnosticLineItemId: event.sourceAgnosticLineItemId,
          sourceAgnosticCreativeId: event.sourceAgnosticCreativeId,
        }

        slotInfoRef.current = [
          ...slotInfoRef.current.filter(info => info.placementId !== id),
          slotInfo,
        ]

        if (onPlacementRenderEnded) {
          onPlacementRenderEnded(event)
        }
      }

      const newAdPlacementWithGoogleSlot = setupGoogleSlot(
        newAdPlacement,
        id,
        {
          [GoogleEventName.SlotOnload]: onPlacementLoad,
          [GoogleEventName.SlotRequested]: onPlacementRequest,
          [GoogleEventName.SlotRenderEnded]: handleSlotRenderEnded,
          [GoogleEventName.ImpressionViewable]: onImpressionViewable,
        },
        iframeTitle,
        trackingContext,
      )

      adPlacementsRef.current = {
        ...adPlacementsRef.current,
        [id]: newAdPlacementWithGoogleSlot,
      }

      requestHeaderBidding(newAdPlacementWithGoogleSlot, id)

      if (!refreshManager.current.isOn && isRefreshEnabled) setupRefresh()
    },
    [requestHeaderBidding, setupRefresh],
  )

  const value = useMemo(
    () => ({
      placements,
      segments,
      shouldMockAds,
      isAdBlockerUsed,
      hasAdBlockerBeenTracked,
      adBlockerVisitorId,
      setIsAdBlockerUsed,
      setHasAdBlockerBeenTracked,
      setAdBlockerVisitorId,
      registerPlacement,
      generatePlacementId,
      unregisterPlacement,
      getAdsPlatform,
      generateIncrementalPlacementId,
      getSlotInfo,
    }),
    [
      placements,
      segments,
      shouldMockAds,
      adBlockerVisitorId,
      isAdBlockerUsed,
      hasAdBlockerBeenTracked,
      setIsAdBlockerUsed,
      setHasAdBlockerBeenTracked,
      setAdBlockerVisitorId,
      registerPlacement,
      generatePlacementId,
      unregisterPlacement,
      getAdsPlatform,
      generateIncrementalPlacementId,
      getSlotInfo,
    ],
  )

  return <AdsContext.Provider value={value}>{children}</AdsContext.Provider>
}

export default AdsProvider
