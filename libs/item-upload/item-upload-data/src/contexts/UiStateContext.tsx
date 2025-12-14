'use client'

/* eslint-disable react/hook-use-state */
import { noop } from 'lodash'
import { ReactNode, createContext, useCallback, useContext, useMemo, useState } from 'react'

import { UiState } from '@marketplace-web/shared/ui-state-util'

import { UiStateContextType } from '../types/context'
import { ItemUploadFieldName, ItemStatus, ISBNRecordsStatus } from '../constants'
import { InitialUiStateData } from '../types/initial-data'

export const UiStateContext = createContext<UiStateContextType>({
  itemStatus: [ItemStatus.New, noop],
  screen: 'upload_item',
  errors: [{ byName: {}, names: [] }, noop],
  setUiState: noop,
  uiState: UiState.Pending,
  price: {
    hasSimilarItems: [false, noop],
  },
  canBumpItem: [false, noop],
  visibleFields: [],
  updateFieldVisibility: noop,
  openErrorDialog: noop,
  closeErrorDialog: noop,
  openCriticalErrorDialog: noop,
  isErrorDialogOpen: false,
  isCriticalErrorDialogOpen: false,
  isbnRecordsStatusWithSetter: [ISBNRecordsStatus.Initial, noop],
})

export const UiStateContextProvider = ({
  initialUiStateData,
  children,
}: {
  initialUiStateData: InitialUiStateData
  children: ReactNode
}) => {
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false)
  const [isCriticalErrorDialogOpen, setIsCriticalErrorDialogOpen] = useState(false)
  const [uiState, setUiState] = useState<UiState>(
    initialUiStateData ? UiState.Success : UiState.Pending,
  )
  const [visibleFields, setVisibleFields] = useState<Array<ItemUploadFieldName | string>>([])
  const itemStatus = useState<ItemStatus>(initialUiStateData?.itemStatus || ItemStatus.New)
  const errors = useState<{ byName: { [fieldName: string]: string }; names: Array<string> }>({
    byName: {},
    names: [],
  })
  const hasSimilarItems = useState(false)
  const canBumpItem = useState(initialUiStateData?.canBumpItem || false)
  const isbnRecordsStatusWithSetter = useState(ISBNRecordsStatus.Initial)

  const screen = useMemo(() => {
    switch (itemStatus[0]) {
      case ItemStatus.Edit:
        return 'edit_item'
      case ItemStatus.DraftEdit:
        return 'edit_draft'
      default:
        return 'upload_item'
    }
  }, [itemStatus])

  const updateFieldVisibility = useCallback(
    ({ fieldName, isVisible }: { fieldName: ItemUploadFieldName | string; isVisible: boolean }) => {
      setVisibleFields(prev => {
        const fields = new Set(prev)
        if (isVisible) {
          fields.add(fieldName)
        } else {
          fields.delete(fieldName)
        }

        return Array.from(fields)
      })
    },
    [],
  )

  const openCriticalErrorDialog = useCallback(() => {
    setIsCriticalErrorDialogOpen(true)
  }, [])

  const openErrorDialog = useCallback(() => {
    setIsErrorDialogOpen(true)
  }, [])

  const closeErrorDialog = useCallback(() => {
    setIsErrorDialogOpen(false)
  }, [])

  const providerValue = useMemo(
    () =>
      ({
        itemStatus,
        screen,
        errors,
        price: { hasSimilarItems },
        setUiState,
        uiState,
        canBumpItem,
        visibleFields,
        updateFieldVisibility,
        isErrorDialogOpen,
        isCriticalErrorDialogOpen,
        openErrorDialog,
        closeErrorDialog,
        openCriticalErrorDialog,
        isbnRecordsStatusWithSetter,
      }) as const,
    [
      itemStatus,
      screen,
      errors,
      hasSimilarItems,
      setUiState,
      uiState,
      canBumpItem,
      visibleFields,
      updateFieldVisibility,
      isErrorDialogOpen,
      isCriticalErrorDialogOpen,
      openErrorDialog,
      closeErrorDialog,
      openCriticalErrorDialog,
      isbnRecordsStatusWithSetter,
    ],
  )

  return <UiStateContext.Provider value={providerValue}>{children}</UiStateContext.Provider>
}

export const useUiStateContext = () => {
  const context = useContext(UiStateContext)

  if (!context) {
    throw new Error('useUiStateContext must be used within a UiStateContextProvider')
  }

  return context
}
