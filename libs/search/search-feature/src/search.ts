import {
  getLocalStorageItem,
  getSessionStorageItem,
  removeLocalStorageItem,
  setLocalStorageItem,
  setSessionStorageItem,
} from '@marketplace-web/browser/browser-storage-util'
import { toParams } from '@marketplace-web/browser/url-util'

import {
  GLOBAL_CATALOG_BROWSE_SESSION_ID_KEY,
  GLOBAL_SEARCH_SESSION_ID_KEY,
  SEARCH_SESSION_ID_KEY,
  SEARCH_START_ID_KEY,
  SEARCH_START_TYPE_KEY,
} from './constants/search'
import { SearchStartType, SearchStartData } from './constants/tracking'

export const isValueSearchStartType = (value: string): value is SearchStartType =>
  Object.values<string>(SearchStartType).includes(value)

export const getSearchStartDataFromUrl = (): {
  searchStartId: string | null
  searchStartType: string | null
} => {
  const currentUrlParams = toParams(window.location.search)
  let searchStartId = (currentUrlParams.search_start_id as string) || null
  let searchStartType = (currentUrlParams.search_start_type as string) || null

  if (!searchStartType || !searchStartId) {
    searchStartId = null
    searchStartType = null
  }

  return {
    searchStartId,
    searchStartType,
  }
}

export const getSearchStartData = (): SearchStartData => {
  let searchStartTypeData = getSessionStorageItem(SEARCH_START_TYPE_KEY)
  let searchStartType: SearchStartType | null = null

  if (searchStartTypeData && isValueSearchStartType(searchStartTypeData)) {
    searchStartType = searchStartTypeData
  }

  if (!searchStartTypeData || !searchStartType) {
    searchStartTypeData = null
    searchStartType = null
  }

  return {
    searchStartId: getSessionStorageItem(SEARCH_START_ID_KEY),
    searchStartType,
  }
}

export const setSearchStartData = ({ searchStartId, searchStartType }: SearchStartData) => {
  if (!searchStartId || !searchStartType) return

  setSessionStorageItem(SEARCH_START_ID_KEY, searchStartId)
  setSessionStorageItem(SEARCH_START_TYPE_KEY, searchStartType)
}

export const getSearchSessionData = () => ({
  searchSessionId: getLocalStorageItem(SEARCH_SESSION_ID_KEY),
  globalSearchSessionId: getLocalStorageItem(GLOBAL_SEARCH_SESSION_ID_KEY),
  globalCatalogBrowseSessionId: getLocalStorageItem(GLOBAL_CATALOG_BROWSE_SESSION_ID_KEY),
})

export const setSearchSessionData = ({
  searchSessionId,
  globalSearchSessionId,
  globalCatalogBrowseSessionId,
}: {
  searchSessionId?: string
  globalSearchSessionId?: string | null
  globalCatalogBrowseSessionId?: string | null
}) => {
  if (searchSessionId) {
    setLocalStorageItem(SEARCH_SESSION_ID_KEY, searchSessionId)
  }

  if (globalSearchSessionId) {
    setLocalStorageItem(GLOBAL_SEARCH_SESSION_ID_KEY, globalSearchSessionId)
  }

  if (globalCatalogBrowseSessionId) {
    setLocalStorageItem(GLOBAL_CATALOG_BROWSE_SESSION_ID_KEY, globalCatalogBrowseSessionId)
  }
}

export const removeSearchSessionData = () => {
  removeLocalStorageItem(SEARCH_SESSION_ID_KEY)
}
