'use client'

import { RefObject, createContext } from 'react'

import { CatalogState } from '@marketplace-web/catalog/catalog-data'

import { CatalogAction } from './reducers/actionTypes'
import { initialState } from './catalog-initial-state'

type CatalogContextType = {
  state: CatalogState
  dispatch: React.Dispatch<CatalogAction>
  refs: CatalogRefs
}

type CatalogRefs = {
  dynamicFilterRequestVersion: RefObject<number> | undefined
  pendingFacetsType: RefObject<string | null>
  isFiltersFetching: RefObject<boolean>
}

const CatalogContext = createContext<CatalogContextType>({
  state: initialState,
  dispatch: () => null,
  refs: {
    dynamicFilterRequestVersion: undefined,
    pendingFacetsType: { current: null },
    isFiltersFetching: { current: false },
  },
})

export default CatalogContext
