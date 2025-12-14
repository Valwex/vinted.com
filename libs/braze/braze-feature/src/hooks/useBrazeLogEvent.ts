'use client'

import { useCallback, useContext, useEffect, useRef } from 'react'

import { CatalogNavigationDto } from '@marketplace-web/catalog/catalog-data'
import { BrazeCustomEvent } from '@marketplace-web/braze/braze-data'
import { UiState } from '@marketplace-web/shared/ui-state-util'

import { getCategoriesFromCatalogTree } from '../utils/catalog-utils'
import { brazeLogCustomEvent } from '../utils/custom-event'
import BrazeContext from '../containers/BrazeProvider/BrazeContext'

const useBrazeLogCustomEvent = () => {
  const userExternalId = useContext(BrazeContext).userExternalId.value

  const loggedEvents = useRef<Array<string>>([])
  const logBrazeEvent = useCallback(
    (event: BrazeCustomEvent, extra?: Record<string, unknown>) => {
      const reference = `${event}_${JSON.stringify(extra)}`
      if (loggedEvents.current.includes(reference) || !userExternalId) return
      brazeLogCustomEvent({
        event,
        extra,
        userExternalId,
      })

      loggedEvents.current.push(reference)
    },
    [userExternalId],
  )

  return logBrazeEvent
}

export const useLogSearchedBrandEvent = (
  brandIds?: string | number | Array<string> | undefined,
) => {
  const logBrazeEvent = useBrazeLogCustomEvent()

  useEffect(() => {
    if (!brandIds) return

    const brand = Array.isArray(brandIds) ? brandIds : [brandIds.toString()]

    logBrazeEvent(BrazeCustomEvent.SearchedBrand, { brand })
  }, [brandIds, logBrazeEvent])
}

export const useLogViewCategoryEvent = (
  catalogId: string | number | undefined,
  catalogTree: Array<CatalogNavigationDto> = [],
) => {
  const logBrazeEvent = useBrazeLogCustomEvent()

  useEffect(() => {
    if (catalogTree.length === 0 || !catalogId) return

    const extra = getCategoriesFromCatalogTree(catalogId, catalogTree)

    logBrazeEvent(BrazeCustomEvent.ViewedCategory, extra)
  }, [catalogId, catalogTree, logBrazeEvent])
}

export const useLogEmptyUploadFormViewEvent = (uiState?: UiState, screen?: string) => {
  const logBrazeEvent = useBrazeLogCustomEvent()

  useEffect(() => {
    if (uiState === UiState.Success && screen === 'upload_item')
      logBrazeEvent(BrazeCustomEvent.EmptyUploadFormView)
  }, [uiState, screen, logBrazeEvent])
}

export const useLogItemUploadFormFillingStartedEvent = (isFormDirty?: boolean, screen?: string) => {
  const logBrazeEvent = useBrazeLogCustomEvent()

  useEffect(() => {
    if (isFormDirty && screen === 'upload_item')
      logBrazeEvent(BrazeCustomEvent.ItemUploadFormFillingStarted)
  }, [isFormDirty, screen, logBrazeEvent])
}
