import {
  PrebidConsentManagementCmpApiType,
  receivedAdRevenueEvent,
  PrebidBid,
} from '@marketplace-web/ads/ads-data'
import { TrackingEvent } from '@marketplace-web/observability/event-tracker-data'

const TIME_OUT = 8000
const CPM_LOGGING_DELAY = 100

function getSyncDelay(abTest: string | undefined) {
  if (abTest === 'a') return 300
  if (abTest === 'b') return 3000

  return 0
}

function getBidderTimeout(abTest: string | undefined) {
  if (abTest === 'a') return 2000
  if (abTest === 'b') return 1000

  return 3000
}

export function initPrebidSetup(adagioParams: object | undefined, abTest?: string) {
  window.pbjs = window.pbjs || {}
  window.pbjs.que = window.pbjs.que || []

  const syncDelay = getSyncDelay(abTest)
  const bidderTimeout = getBidderTimeout(abTest)

  window.pbjs.que.push(() => {
    window.pbjs.bidderSettings = {
      standard: {
        storageAllowed: true,
      },
    }

    window.pbjs.setConfig({
      timeout: TIME_OUT,
      bidderTimeout,
      allowAuctionWithoutConsent: false,
      fallback: {
        nonPersonalizedAds: true,
      },
      accessDevice: true,
      transmitTid: true,
      enableTIDs: true,
      syncDelay,
      realTimeData: adagioParams
        ? {
            dataProviders: [{ name: 'adagio', params: adagioParams }],
          }
        : undefined,
      useBidCache: true,
      priceGranularity: {
        buckets: [
          {
            precision: 2,
            min: 0,
            max: 20,
            increment: 0.01,
          },
          {
            precision: 2,
            min: 21,
            max: 99,
            increment: 1,
          },
        ],
      },
      enableSendAllBids: false,
      currency: {
        adServerCurrency: 'EUR',
        granularityMultiplier: 1,
      },
      timeoutBuffer: 200,
      userSync: {
        filterSettings: {
          iframe: {
            bidders: '*',
            filter: 'include',
          },
        },
        userIds: [
          {
            name: 'id5Id',
            params: {
              partner: 700,
            },
            storage: {
              type: 'html5',
              name: 'id5id',
              expires: 90,
              refreshInSeconds: 8 * 3600,
            },
          },
          {
            name: 'criteo',
          },
        ],
        auctionDelay: 50,
      },
    })
  })
}

export function setPrebidConsentManagement(isCookieConsentVersion: boolean) {
  if (!isCookieConsentVersion) return

  window.pbjs.que.push(() => {
    window.pbjs.mergeConfig({
      consentManagement: {
        gdpr: {
          cmpApi: PrebidConsentManagementCmpApiType.IAB,
          defaultGdprScope: true,
          timeout: TIME_OUT,
        },
        usp: {
          cmpApi: PrebidConsentManagementCmpApiType.IAB,
        },
      },
    })
  })
}

export function handleCpmLogging(
  event: googletag.events.ImpressionViewableEvent,
  placementId: string,
  trackingContext?: {
    track: (event: TrackingEvent) => void
    countryCode: string
    isMobileWeb: boolean
  },
) {
  if (event.slot.getSlotElementId() !== placementId) return
  if (!trackingContext) return

  setTimeout(() => {
    const bids = window.pbjs?.getHighestCpmBids(placementId)
    if (!bids?.length) return

    const winningBid = bids[0] as unknown as PrebidBid

    trackingContext.track(
      receivedAdRevenueEvent({
        placementId,
        isMobileWeb: trackingContext.isMobileWeb,
        countryCode: trackingContext.countryCode!,
        cpm: winningBid?.cpm,
        currency: winningBid?.currency,
      }),
    )
  }, CPM_LOGGING_DELAY)
}
