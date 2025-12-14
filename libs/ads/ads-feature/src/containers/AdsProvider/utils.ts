import {
  Bid,
  RtbPlacementConfigModel,
  AmazonTagFetchBidsConfig,
  BackBidsResponses,
  RtbAdPlacement,
  YieldbirdUnfilledRecoveryEventDetail,
} from '@marketplace-web/ads/ads-data'
import { TrackingEvent } from '@marketplace-web/observability/event-tracker-data'

import { handleCpmLogging } from '../../components/AdScripts/setups/Prebid/utils'

import { CreatePlacementProps, GoogleCallbacks, RefreshManager, RequestManager } from './types'
import {
  AD_VISIBILITY_RATIO,
  ADS_BIDDER_TIMEOUT,
  Bidder,
  BidderState,
  GoogleEventName,
  USER_INACTIVE_TIME,
} from '../../constants'

export function isUserActive(refreshManager: RefreshManager) {
  const inactiveDuration = (Date.now() - refreshManager.lastActionTimestamp) / 1000

  return !document.hidden && inactiveDuration < USER_INACTIVE_TIME
}

export function setupGoogleEvents(googleSlot: googletag.Slot, callbacks: GoogleCallbacks) {
  const { googletag } = window

  if (!googletag) return

  Object.keys(callbacks).forEach(callbackKey => {
    const key = callbackKey as keyof googletag.events.EventTypeMap

    const callback = callbacks[key]

    if (!callback) return

    googletag.pubads().addEventListener(key, (event: googletag.events.Event) => {
      if (event.slot === googleSlot) callback(event)
    })
  })
}

export function handleUnfilledRecovery(event: Event) {
  const { detail } = event as CustomEvent<YieldbirdUnfilledRecoveryEventDetail>

  return (googleSlot: googletag.Slot, callbacks: GoogleCallbacks) => {
    const { slot, unfilledRecoveryAdUnit } = detail

    const googleSlotAdUnitPath = googleSlot.getAdUnitPath()

    const slotPathId = `${googleSlotAdUnitPath}#${googleSlot.getSlotElementId()}`

    if (slotPathId !== slot) return

    const yieldbirdRecoverySlot = googletag
      .pubads()
      .getSlots()
      .find(publicSlot => {
        return (
          publicSlot.getAdUnitPath() ===
          unfilledRecoveryAdUnit.substring(0, unfilledRecoveryAdUnit.indexOf('#'))
        )
      })

    if (!yieldbirdRecoverySlot) return

    setupGoogleEvents(yieldbirdRecoverySlot, callbacks)
  }
}

export function setupGoogleSlot(
  placement: RtbAdPlacement,
  placementId: string,
  callbacks: GoogleCallbacks,
  iframeTitle?: string,
  trackingContext?: {
    track: (event: TrackingEvent) => void
    countryCode: string
    isMobileWeb: boolean
  },
): RtbAdPlacement {
  const { googletag } = window

  if (!googletag) return placement

  googletag.cmd.push(() => {
    const { adUnitPath, sizes } = placement

    if (iframeTitle) googletag.setAdIframeTitle(iframeTitle)

    const googleSlot = googletag.defineSlot(adUnitPath, sizes, placementId)

    if (!googleSlot) return placement

    googleSlot.addService(googletag.pubads())
    googleSlot.setCollapseEmptyDiv(true)

    const enhancedCallbacks = {
      ...callbacks,
      [GoogleEventName.ImpressionViewable]: (event: googletag.events.ImpressionViewableEvent) => {
        // Call the original callback if it exists
        if (callbacks[GoogleEventName.ImpressionViewable]) {
          callbacks[GoogleEventName.ImpressionViewable](event)
        }

        handleCpmLogging(event, placementId, trackingContext)
      },
    }

    setupGoogleEvents(googleSlot, enhancedCallbacks)

    window.addEventListener('unfilledRecovery', (event: Event) =>
      handleUnfilledRecovery(event)(googleSlot, enhancedCallbacks),
    )

    return {
      ...placement,
      googleSlot,
    }
  })

  return placement
}

export function getAdUnitPath({ dfpAccountId, dfpCode }: RtbPlacementConfigModel) {
  return `/${dfpAccountId}/${dfpCode}`
}

export function getAdUnitName({ shape, page, mediation }: RtbPlacementConfigModel) {
  const adUnitNameParts = ['slot', shape, page]

  if (mediation) {
    adUnitNameParts.push(mediation)
  }

  return adUnitNameParts.join('-')
}

export function isBidderStateValid(requestManager: RequestManager, bidder: Bidder) {
  return requestManager[bidder] === BidderState.Fetched
}

export function sendAdserverRequest(
  placement: RtbAdPlacement,
  placementId: string,
  requestManager: RequestManager,
) {
  const { googletag, pbjs, apstag } = window

  const { isManuallyRendered } = placement

  googletag.cmd.push(() => {
    const placementSlot = googletag
      .pubads()
      .getSlots()
      .find(slot => slot.getSlotElementId() === placementId)

    if (isBidderStateValid(requestManager, Bidder.Prebid))
      pbjs.setTargetingForGPTAsync([placementId])

    if (isBidderStateValid(requestManager, Bidder.Amazon)) apstag.setDisplayBids()

    if (isManuallyRendered) googletag.display(placementId)

    if (placementSlot && !isManuallyRendered) googletag.pubads().refresh([placementSlot])
  })
}

export function isArrayOfNumbers(candidate: unknown): candidate is Array<number | Array<number>> {
  return (
    !!candidate &&
    Array.isArray(candidate) &&
    !candidate.find(candidateItem => {
      return Array.isArray(candidateItem)
        ? !!candidateItem.find(candidateItemItem =>
            Number.isNaN(Number.parseInt(candidateItemItem, 10)),
          )
        : Number.isNaN(Number.parseInt(candidateItem, 10))
    })
  )
}

export function fetchAmazonBids(
  placement: RtbAdPlacement,
  placementId: string,
  onBidderBack: (bidderName: Bidder.Amazon, placementId: string, state: BidderState) => void,
  isRefresh = false,
) {
  const { apstag } = window
  let hasTimedOut = false

  if (!apstag) return

  const { sizes, dfpCode } = placement

  if (sizes === 'fluid' || !isArrayOfNumbers(sizes)) {
    onBidderBack(Bidder.Amazon, placementId, BidderState.BadSizes)

    return
  }

  const config: AmazonTagFetchBidsConfig = {
    slots: [
      {
        slotID: placementId,
        slotName: dfpCode,
        sizes,
      },
    ],
    params: {
      adRefresh: isRefresh ? '1' : '0',
    },
  }

  const timeout = setTimeout(() => {
    hasTimedOut = true

    onBidderBack(Bidder.Amazon, placementId, BidderState.TimedOut)
  }, ADS_BIDDER_TIMEOUT)

  apstag.fetchBids(config, () => {
    if (hasTimedOut) return

    clearTimeout(timeout)
    onBidderBack(Bidder.Amazon, placementId, BidderState.Fetched)
  })
}

export function fetchPrebidBids(
  placement: RtbAdPlacement,
  placementId: string,
  onBidderBack: (bidderName: Bidder.Prebid, placementId: string, state: BidderState) => void,
  isRefresh = false,
) {
  const { pbjs } = window

  if (!pbjs) return

  if (!placement?.bids?.length) {
    onBidderBack(Bidder.Prebid, placementId, BidderState.NoBids)

    return
  }

  const { sizes, bids, adUnitName, adUnitPath, googleSlot, dfpAccountId, dfpCode, iabCategories } =
    placement
  const adagioBidParams = bids.find(bid => bid.bidder === 'adagio')?.params

  const gpid = `/${dfpAccountId}/${window.location.hostname}/${dfpCode}`

  const ortb2Imp = {
    ext: {
      gpid,
      data: {
        ...(iabCategories && { cat: iabCategories }),
        ...(adagioBidParams && adagioBidParams),
      },
    },
  }

  const prebidPlacement = {
    code: placementId,
    mediaTypes: {
      banner: {
        sizes,
      },
    },
    bids: bids.reduce<Array<Bid>>((acc, bid) => {
      const stringifiedBid = JSON.stringify(bid)
      const stringifiedBids = JSON.stringify(acc)

      if (stringifiedBids.includes(stringifiedBid)) return acc

      return [...acc, bid]
    }, []),
    ortb2Imp,
    pubstack: {
      adUnitPath,
      adUnitName,
    },
  }

  pbjs.que.push(() => {
    if (!isRefresh) pbjs.addAdUnits(prebidPlacement)

    pbjs.requestBids({
      adUnitCodes: [placementId],
      bidsBackHandler(_bids: BackBidsResponses, timedOut: boolean) {
        if (isRefresh) googleSlot?.setTargeting('ad_refresh', 'true')

        return onBidderBack(
          Bidder.Prebid,
          placementId,
          timedOut ? BidderState.TimedOut : BidderState.Fetched,
        )
      },
      timeout: ADS_BIDDER_TIMEOUT,
    })
  })
}

export function areAllBidsBack(
  placementId: string,
  individualRequestManager: Record<string, RequestManager>,
) {
  const bidders = Object.values(Bidder)
  const backStates = [
    BidderState.Fetched,
    BidderState.TimedOut,
    BidderState.BadSizes,
    BidderState.NoBids,
  ]
  const placementRequestManager = individualRequestManager[placementId]

  if (!placementRequestManager) return false

  return (
    bidders
      .map(bidder => placementRequestManager[bidder])
      .filter(bidderState => backStates.includes(bidderState)).length === bidders.length
  )
}

export function isAdVisible(node?: HTMLElement) {
  if (!node) return false

  const boundaries = node.getBoundingClientRect()

  if (!boundaries) return false

  // If all boundaries are 0, it means the node exists in the DOM,
  // but an ad wasn't filled (no measurements available),
  // so it's considered empty and eligible for refresh until filled.

  const isEmptyAdSlot =
    boundaries.height === 0 &&
    boundaries.width === 0 &&
    boundaries.top === 0 &&
    boundaries.bottom === 0

  if (isEmptyAdSlot) {
    return true
  }

  const offset = boundaries.height * AD_VISIBILITY_RATIO
  const isVisible = window.innerHeight > boundaries.top + offset && boundaries.bottom > offset

  return isVisible
}

export function createNewAdPlacement({
  id,
  placementConfig,
  node,
  isRefreshEnabled = false,
  isManuallyRendered = false,
  isManuallyRefreshed = false,
  iabCategories,
}: CreatePlacementProps): RtbAdPlacement {
  return {
    code: id,
    adUnitPath: getAdUnitPath(placementConfig),
    adUnitName: getAdUnitName(placementConfig),
    shape: placementConfig.shape,
    sizes: placementConfig.sizes,
    bids: placementConfig.bids,
    dfpCode: placementConfig.dfpCode,
    dfpAccountId: placementConfig.dfpAccountId,
    activeDuration: 0,
    isRefreshEnabled,
    isManuallyRendered,
    isManuallyRefreshed,
    isOutOfPageAd: false,
    node,
    iabCategories,
  }
}
