export const ROOT_CATALOG_ID = -1 as const
export const ROOT_CATALOG_ICON_NAME = 'dots'
export const WEB_CATALOG_ROOT_ALL_CODE = '_ALL'
export const ABOUT_TAB_ID = 'about-tab-id'
export const OUR_PLATFORM_ID = 'our-platform-id'
export const NAVIGATION_COOKIES_URL = '#'
export const CATALOG_SHRINK_THRESHOLD = 8

export const PER_PAGE = 20
export const CATALOG_PER_PAGE = 96
export const CATALOG_FETCH_ITEM_DEBOUNCE_AMOUNT = 100
export const MAX_OWNER_ITEMS_PER_PAGE = 24
export const MAX_FACETED_ITEMS_COUNT = 500

export const FILTER_PRICE_FROM = 'priceFrom'
export const FILTER_PRICE_TO = 'priceTo'

export const CATALOG_FILTERS_SEARCH_DEBOUNCE_AMOUNT = 300
export const SCROLL_TO_TOP_DELAY = 1000

export const CATALOG_ROUTE_REGEX = /^\/catalog\/(\d+).*$/
export const BRAND_ROUTE_REGEX = /^\/brand\/(\d+).*$/
export const CATALOG_BRAND_ROUTE_REGEX = /^\/catalog\/(\d+)[^/]*\/brand\/(\d+).*$/

export const NONE_CATALOG_ROUTE = '/catalog-rules'
export const CATALOG_MAIN_ROUTE = '/catalog'
export const CATALOG_BRAND_ROUTE = '/brand/'

export const CURRENCY_FALLBACK = 'EUR'
export const LOCALE_FALLBACK = 'en_GB'

export const catalogInsertPositions = {
  closetPromo: {
    wide: {
      first: 8,
      distance: 24,
    },
    desktops: {
      first: 6,
      distance: 24,
    },
    tablets: {
      first: 6,
      distance: 24,
    },
    phones: {
      first: 6,
      distance: 24,
    },
  },
  activationBanner: {
    wide: {
      first: 8,
      distance: 20,
    },
    desktops: {
      first: 6,
      distance: 18,
    },
    tablets: {
      first: 6,
      distance: 18,
    },
    phones: {
      first: 6,
      distance: 18,
    },
  },
  ivsGuidelineBanner: {
    wide: {
      first: 12,
      distance: 12,
    },
    desktops: {
      first: 12,
      distance: 12,
    },
    tablets: {
      first: 12,
      distance: 12,
    },
    phones: {
      first: 12,
      distance: 12,
    },
  },
  ads: {
    wide: {
      first: 16,
      distance: 0,
    },
    desktops: {
      first: 12,
      distance: 0,
    },
    tablets: {
      first: 12,
      distance: 0,
    },
    phones: {
      first: 18,
      distance: 24,
    },
  },
}

export enum CatalogPhotoThumbnail {
  Thumb24 = 'thumb24',
  Thumb48 = 'thumb48',
  Thumb70 = 'thumb70',
  Thumb150 = 'thumb150',
}

export enum CatalogAttribute {
  // 1 is controlled from legacy views
  Navigation = 1,
  Breadcrumb = 2,
  Filter = 3,
  Subcatalog = 4,
  Home = 5,
  StyleFilter = 6,
  ProfileFilters = 7,
}

export enum CatalogFrom {
  RecentPurchases = 0,
  IvsBlock = 3,
}

export enum CatalogCode {
  WomenRoot = 'WOMEN_ROOT',
  Mens = 'MENS',
  ChildrenNew = 'CHILDREN_NEW',
  PetCare = 'PET_CARE',
  Home = 'HOME',
  Entertainment = 'ENTERTAINMENT',
}

export enum CatalogFeature {
  MobileFilters = 'mobile_filters',
  Filters = 'filters',
  Items = 'items',
}

export enum ItemUiView {
  UserItems = 'userItems',
  SimilarItems = 'similarItems',
  CatalogItems = 'catalogItems',
}

export enum SearchStartType {
  SearchSuggestions = 'search_suggestions',
  SearchManual = 'search_manual',
  RecentSearch = 'recent_searches',
  SubscribedSearch = 'subscribed_searches',
  SearchByImage = 'search_by_image',
}

export enum ItemThumbnailSize {
  Large = 'thumb310x430',
}

// these parameters weaken the link's SEO effect
export const PROHIBITED_SEO_PARAMS = [
  'search_start_type',
  'homepage_session_id',
  'disabled_personalization',
  'catalog_from',
  'referrer',
  'time',
]
