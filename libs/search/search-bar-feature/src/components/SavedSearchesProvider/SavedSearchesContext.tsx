'use client'

import { createContext } from 'react'

import {
  SavedSearchApiParams,
  SavedSearchDto,
  UpdateSavedSearchArgs,
  GetSavedSearchArgs,
  CreateSavedSearchArgs,
} from '@marketplace-web/search/search-bar-data'

export type SavedSearchesContextType = {
  searches: Array<SavedSearchDto>
  currentSearch: SavedSearchDto | undefined
  currentSearchId: number | undefined
  actions: {
    createSearch: (arg: CreateSavedSearchArgs) => Promise<void>
    fetchSearch: (arg: GetSavedSearchArgs) => Promise<SavedSearchDto | undefined>
    toggleCurrentSearchSubscription: (arg: SavedSearchApiParams, userId: number) => Promise<void>
    fetchSearches: (userId: number) => Promise<void>
    toggleSearchSubscription: (searchId: number, userId: number) => Promise<void>
    updateSearch: (arg: UpdateSavedSearchArgs) => Promise<void>
  }
}

const noop = () => Promise.resolve()

export const savedSearchesContextDefault: SavedSearchesContextType = {
  searches: [],
  currentSearch: undefined,
  currentSearchId: undefined,
  actions: {
    fetchSearches: noop,
    createSearch: noop,
    fetchSearch: () => Promise.resolve(undefined),
    toggleCurrentSearchSubscription: noop,
    toggleSearchSubscription: noop,
    updateSearch: noop,
  },
}

const SavedSearchesContext = createContext<SavedSearchesContextType>(savedSearchesContextDefault)

export default SavedSearchesContext
