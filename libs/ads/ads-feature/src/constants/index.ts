import { AdPage } from '@marketplace-web/ads/ads-data'
import { PageId } from '@marketplace-web/environment/page-configuration-util'
import { Hostname } from '@marketplace-web/vinted-context/construct-headers-util'

export const SMALLEST_AD_HEIGHT = 50
export const STICKY_AD_SPACING = 20
export const REFRESH_AD_TIME = 15
export const USER_INACTIVE_TIME = 5
export const DEBOUNCE_TIME = 2000
export const ADS_BIDDER_TIMEOUT = 2000
export const AD_VISIBILITY_RATIO = 0.5
export const IS_AD_BLOCKER_USED_SESSION_KEY = 'isAdBlockerUsed'
export const AD_BLOCKER_VISITOR_KEY = 'adBlockerVisitor'
export const AD_REQUEST_CHECK_URL = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'
export const PLACEMENT_REFRESH_INTERVAL = 1000

export const APSTAG_PUB_ID = 3863

export const ACTIVITY_EVENTS = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart']

export const SHOULD_SHOW_ROKT_SESSION_KEY = 'shouldShowRokt'
export const HAS_ROKT_BEEN_SHOWN_SESSION_KEY = 'hasRoktBeenShown'
export const ROKT_ACCOUNT_ID = '3105142925732150316'

export const SHOULD_SHOW_VAN_OFFER_SESSION_KEY = 'shouldShowVanOffer'

export type PrebidBid = {
  adId: string
  cpm?: number
  currency?: string
  bidder?: string
  adUnitCode?: string
  timeToRespond?: number
}

export enum Bidder {
  Amazon = 'a9',
  Prebid = 'prebid',
}

export enum BidderState {
  Idle = 'idle',
  Fetched = 'fetched',
  TimedOut = 'timedout',
  NoBids = 'nobids',
  BadSizes = 'badsizes',
}

export enum GoogleEventName {
  SlotOnload = 'slotOnload',
  SlotRequested = 'slotRequested',
  SlotRenderEnded = 'slotRenderEnded',
  ImpressionViewable = 'impressionViewable',
}

export const MapPageIdToAdPage: Partial<Record<PageId, AdPage | undefined>> = {
  catalog: AdPage.Catalog,
  brand: AdPage.Catalog,
  'catalog-by-id': AdPage.Catalog,
  'catalog-brand': AdPage.Catalog,
  'member-items-favourite-list': AdPage.FavoriteItems,
  root: AdPage.Feed,
  item: AdPage.Item,
  inbox: AdPage.Messages,
  'inbox-message': AdPage.Messages,
  'notification-landings': AdPage.Notifications,
  'member-notifications': AdPage.Notifications,
}

export const MapHostnameToYieldbirdKey: Partial<Record<Hostname, string>> = {
  [Hostname.At]: 'f610af51-4a9b-44e0-b9fe-1096217e469c',
  [Hostname.Be]: 'aaa6f9be-006d-43dd-b59e-b00e52cd58e2',
  [Hostname.Us]: 'd1fa6960-9b98-4bfd-904b-3805d91d9b0a',
  [Hostname.Cz]: '8ef0c6cf-b290-4199-b2c5-68785146dbd0',
  [Hostname.De]: '8f1638ea-c14a-4bce-af0e-5263553a6949',
  [Hostname.Es]: 'd03d395d-3c46-43c0-990f-b10906a5d251',
  [Hostname.Hu]: '0d5c622c-bc49-4dad-b77b-742203544947',
  [Hostname.It]: '87c0352f-1f2c-4e6c-9d45-a5212a80108a',
  [Hostname.Lt]: 'fc1f0225-e0d2-4fac-ba93-31400401d06f',
  [Hostname.Lu]: '11244d35-f89f-4696-86dc-e5d4f08bc0d3',
  [Hostname.Nl]: '5ab50f3c-1ecd-4f82-bc87-190327181ed7',
  [Hostname.Pt]: '71fce85d-01a0-4f37-bd9e-31719c66e978',
  [Hostname.Ro]: '86bb14b2-8652-42aa-b28a-7acd6598bb96',
  [Hostname.Se]: '4ec9b925-8eb7-4858-abe4-09e756fc2f79',
  [Hostname.Sk]: '76347daa-cc20-4525-a291-dbc6561e4148',
  [Hostname.Fr]: '8d9afc26-9acb-4d12-a757-db592bf7580f',
  [Hostname.Pl]: '6b332917-e417-4b19-b60c-caef1e296484',
  [Hostname.Uk]: '181d93cf-bbde-4771-bbcd-6efc605f5183',
}
