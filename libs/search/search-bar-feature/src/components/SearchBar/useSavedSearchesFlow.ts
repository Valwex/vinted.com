'use client'

import { useEffect } from 'react'

import { useBrowserNavigation } from '@marketplace-web/browser/browser-navigation-util'
import { useSession } from '@marketplace-web/shared/session-data'
import { useDebounce } from '@marketplace-web/shared/ui-helpers'
import { useCatalogContext } from '@marketplace-web/catalog/catalog-page-data'

import { useSavedSearchesContext } from '../SavedSearchesProvider'
import { SEARCH_CHECK_DEBOUNCE_AMOUNT } from '../SavedSearchesProvider/constants'
import { filtersToApiParams } from '../SavedSearchesProvider/transformers'

const useSavedSearchesFlow = () => {
  const searches = useSavedSearchesContext()
  const { search_text, search_by_image_uuid } = useBrowserNavigation().searchParams

  const searchText = search_text ? String(search_text) : ''
  const searchByImageUuid = search_by_image_uuid ? String(search_by_image_uuid) : ''

  const {
    state: {
      general: { filtersChangeCount },
      dynamicFilters: { selectedDynamicFilters },
      filters,
    },
  } = useCatalogContext()

  const userId = useSession().user?.id

  const flow = async (forceUpdate: boolean) => {
    if (!userId || filters.disableSearchSaving || searchByImageUuid) return

    let { currentSearch } = searches

    if (searches.currentSearchId && !currentSearch) {
      currentSearch = await searches.actions.fetchSearch({ userId, id: searches.currentSearchId })
    }

    const isQuerySame = searchText === (currentSearch?.search_text || '')
    const shouldCreateRecent = !currentSearch || !isQuerySame || currentSearch.subscribed

    const searchParams = filtersToApiParams(filters, selectedDynamicFilters, searchText)

    if (shouldCreateRecent && !forceUpdate) {
      await searches.actions.createSearch({
        userId,
        search: { ...searchParams, subscribed: false },
      })
      await searches.actions.fetchSearches(userId)

      return
    }

    if (currentSearch) {
      await searches.actions.updateSearch({
        userId,
        id: currentSearch.id,
        search: { ...searchParams, subscribed: currentSearch.subscribed },
        keepLastVisitTime: false,
      })
      await searches.actions.fetchSearch({ id: currentSearch.id, userId })
    }
  }

  const flowDebounced = useDebounce(flow, SEARCH_CHECK_DEBOUNCE_AMOUNT)

  useEffect(() => {
    if (filtersChangeCount === 0) return
    flowDebounced(filtersChangeCount === 1)
  }, [flowDebounced, filtersChangeCount, searchByImageUuid])
}

export default useSavedSearchesFlow
