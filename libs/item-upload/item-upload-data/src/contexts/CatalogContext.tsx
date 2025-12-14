'use client'

import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { isEqual } from 'lodash'

import { isResponseError } from '@marketplace-web/core-api/api-client-util'

import { ItemAuthenticityModalModel, RequestItemAuthenticityModalArgs } from '../types/authenticity'
import { CatalogContextType } from '../types/context'
import { CatalogSelectType, CatalogsType } from '../types/catalog'
import { useUiStateContext } from './UiStateContext'
import { useAttributesContext } from './AttributesContext'
import { transformCatalogsResponse } from '../transformers/catalog'
import { getItemUploadCatalogs } from '../api'

export const CatalogContext = createContext<CatalogContextType>({
  catalogs: { ids: [], byId: {}, initialIds: [] },
  getCurrentCatalog: () => null,
  getChildCatalogsById: () => [],
  getCatalog: () => null,
  selectCatalog: () => null,
})

export const CatalogContextProvider = ({ children }: { children: ReactNode }) => {
  const { openCriticalErrorDialog } = useUiStateContext()

  const {
    attributes: { catalogId: currentCatalogId },
    isLuxuryBrand,
    setCatalogId,
    setSizeId,
    setStatusId,
  } = useAttributesContext()
  const [catalogs, setCatalogs] = useState<CatalogsType>({ ids: [], byId: {}, initialIds: [] })

  useEffect(() => {
    const fetchData = async () => {
      const response = await getItemUploadCatalogs()

      if (isResponseError(response)) {
        openCriticalErrorDialog()

        return
      }

      const transformedCatalogs = transformCatalogsResponse(response)

      const initialIds: Array<number> = []

      transformedCatalogs.forEach(catalog => {
        if (!catalog.parentId) {
          initialIds.push(catalog.id)
        }
      })

      const ids = transformedCatalogs.map(cat => cat.id)
      const byId: Record<number, CatalogSelectType> = {}

      transformedCatalogs.forEach(cat => {
        byId[cat.id] = cat
      })

      setCatalogs({ byId, ids, initialIds })
    }

    fetchData()
  }, [openCriticalErrorDialog])

  const getCatalog = useCallback(
    (id: number | null) => {
      if (!id) return null

      return catalogs.byId[id] ?? null
    },
    [catalogs],
  )

  const getChildCatalogsById = useCallback(
    (catalogId: number | null) => {
      const parentCatalog = getCatalog(catalogId)

      const ids = parentCatalog?.catalogIds ?? null
      const targetIds = ids?.length ? ids : catalogs.initialIds

      return targetIds.map(id => catalogs.byId[id]!)
    },
    [getCatalog, catalogs],
  )

  const getCurrentCatalog = useCallback(() => {
    if (!currentCatalogId) return null

    return catalogs.byId[currentCatalogId]
  }, [catalogs, currentCatalogId])

  const selectCatalog = useCallback(
    ({
      newCatalogId,
      requestItemAuthenticityModal,
      setAuthenticityModalContent,
      isPrefill,
    }: {
      newCatalogId: number | null
      requestItemAuthenticityModal: (args: RequestItemAuthenticityModalArgs) => void
      setAuthenticityModalContent: Dispatch<SetStateAction<ItemAuthenticityModalModel | null>>
      isPrefill?: boolean
    }) => {
      if (!newCatalogId && !isPrefill) return

      const newCatalog = getCatalog(newCatalogId)

      if (newCatalog?.restrictedToStatusId) {
        setStatusId(null)
      }

      const currentCatalog = getCurrentCatalog()

      if (currentCatalog) {
        if (!isEqual(currentCatalog.multipleSizeGroupIds, newCatalog?.multipleSizeGroupIds)) {
          setSizeId(null)
        }
      }

      setCatalogId(newCatalogId)
      setAuthenticityModalContent(null)

      if (isLuxuryBrand) {
        requestItemAuthenticityModal({ modalDataOnly: true, newCatalogId })
      }
    },
    [getCatalog, getCurrentCatalog, setCatalogId, isLuxuryBrand, setStatusId, setSizeId],
  )

  const providerValue = useMemo(
    () => ({
      catalogs,
      getCatalog,
      selectCatalog,
      currentCatalogId,
      getCurrentCatalog,
      getChildCatalogsById,
    }),
    [
      catalogs,
      getCatalog,
      selectCatalog,
      currentCatalogId,
      getCurrentCatalog,
      getChildCatalogsById,
    ],
  )

  return <CatalogContext.Provider value={providerValue}>{children}</CatalogContext.Provider>
}

export const useCatalogContext = () => {
  const context = useContext(CatalogContext)

  if (!context) {
    throw new Error('useCatalogContext must be used within a CatalogContextProvider')
  }

  return context
}
