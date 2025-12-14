'use client'

import { ReactNode, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'

import { isResponseError } from '@marketplace-web/core-api/api-client-util'
import { useLatestCallback } from '@marketplace-web/shared/ui-state-util'
import { toParams, toUrlQuery } from '@marketplace-web/browser/url-util'
import {
  SavedSearchDto,
  createSavedSearch,
  getSavedSearch,
  getSortedSavedSearches,
  updateSavedSearch,
  SavedSearchApiParams,
} from '@marketplace-web/search/search-bar-data'

import { SEARCH_ID } from './constants'
import SavedSearchesContext, { SavedSearchesContextType } from './SavedSearchesContext'
import { searchDtoToApiParams } from './transformers'

type Props = {
  children: ReactNode
}

const SavedSearchesProvider = ({ children }: Props) => {
  const searchParams = useSearchParams()

  const [searchesById, setSearchesById] = useState<Record<number, SavedSearchDto>>({})
  const [searchIds, setSearchIds] = useState<Array<number>>([])

  const currentSearchId = Number(searchParams?.get(SEARCH_ID)) || undefined

  // todo: replace this with useLocation once context is scaled
  const setCurrentSearchId = (id: number) => {
    const stringValue = String(id)

    const url = new URL(window.location.href)
    const params = toParams(url.search)
    params[SEARCH_ID] = stringValue

    window.history.replaceState(null, '', `${url.pathname}?${toUrlQuery(params)}`)
  }

  const currentSearch = currentSearchId ? searchesById[currentSearchId] : undefined

  const searches = useMemo<Array<SavedSearchDto>>(() => {
    return searchIds.map(id => searchesById[id]).filter(Boolean)
  }, [searchesById, searchIds])

  const updateSearchesById = (items: Array<SavedSearchDto>) => {
    setSearchesById(prev => {
      const clone = { ...prev }

      items.forEach(search => {
        clone[search.id] = search
      })

      return clone
    })
  }

  const setSearches = (items: Array<SavedSearchDto>) => {
    setSearchIds(items.map(item => item.id))
    updateSearchesById(items)
  }

  const fetchSearches = useLatestCallback(async (userId: number) => {
    const response = await getSortedSavedSearches(userId)

    if (isResponseError(response)) return
    setSearches(response.searches)
  })

  const fetchSearch = useLatestCallback(async (...params: Parameters<typeof getSavedSearch>) => {
    const response = await getSavedSearch(...params)

    if (isResponseError(response)) return undefined
    updateSearchesById([response.search])

    return response.search
  })

  const createSearch = useLatestCallback(
    async (...params: Parameters<typeof createSavedSearch>) => {
      const [{ userId }] = params
      const response = await createSavedSearch(...params)

      if (isResponseError(response)) return

      await fetchSearch({ id: response.search.id, userId })
      setCurrentSearchId(response.search.id)
    },
  )

  const updateSearch = useLatestCallback(
    async (...params: Parameters<typeof updateSavedSearch>) => {
      const response = await updateSavedSearch(...params)
      if (isResponseError(response)) return

      const current = searchesById[response.search.id]
      if (!current) return

      updateSearchesById([{ ...current, ...response.search }])
    },
  )

  const toggleSearchSubscription = useLatestCallback(async (searchId: number, userId: number) => {
    const search = searchesById[searchId]
    if (!search) return

    await updateSearch({
      userId,
      search: { ...searchDtoToApiParams(search), subscribed: !search.subscribed },
      id: search.id,
      keepLastVisitTime: true,
    })
  })

  const toggleCurrentSearchSubscription = useLatestCallback(
    async (arg: SavedSearchApiParams, userId: number) => {
      if (currentSearchId && currentSearch?.subscribed) {
        // user unsubscribed a search, should mutate,
        // as otherwise saved search would still be in the list
        await toggleSearchSubscription(currentSearchId, userId)

        return
      }

      await createSearch({ userId, search: { ...arg, subscribed: true } })
    },
  )

  const actions = useMemo<SavedSearchesContextType['actions']>(
    () => ({
      createSearch,
      fetchSearch,
      fetchSearches,
      toggleCurrentSearchSubscription,
      toggleSearchSubscription,
      updateSearch,
    }),
    [
      createSearch,
      fetchSearch,
      fetchSearches,
      toggleCurrentSearchSubscription,
      toggleSearchSubscription,
      updateSearch,
    ],
  )

  const value = useMemo<SavedSearchesContextType>(
    () => ({
      currentSearchId,
      currentSearch,
      searches,
      actions,
    }),
    [actions, currentSearch, currentSearchId, searches],
  )

  return <SavedSearchesContext.Provider value={value}>{children}</SavedSearchesContext.Provider>
}

export default SavedSearchesProvider
