'use client'

import { ReactNode, createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { noop } from 'lodash'

import { ItemUploadContextType } from '../types/context'
import { ConfigurationType } from '../types'
import { InitialItemUploadData } from '../types/initial-data'

const initialConfiguration: ConfigurationType = {
  photoTip: null,
  maxShippingPrice: null,
  abTests: {},
  firstTimeListingGuideline: null,
  uploadSessionId: '',
  priceRange: {
    minimum: { amount: '', currencyCode: '' },
    maximum: { amount: '', currencyCode: '' },
  },
  currency: 'USD',
  isFirstTimeLister: null,
}

export const ItemUploadContext = createContext<ItemUploadContextType>({
  configuration: initialConfiguration,
  setConfiguration: noop,
  isPreviousLister: false,
  isSecondDayLister: false,
  isABTestEnabled: () => false,
  getABTest: () => undefined,
  openPhotoInput: noop,
  fileInputRef: { current: null },
  isFormDisabled: false,
  enableForm: noop,
  disableForm: noop,
  initialItemUploadData: undefined,
})

export const ItemUploadContextProvider = ({
  initialItemUploadData,
  children,
}: {
  initialItemUploadData: InitialItemUploadData
  children: ReactNode
}) => {
  const [configuration, setConfiguration] = useState<ConfigurationType>(
    initialItemUploadData?.configuration || initialConfiguration,
  )
  const [isFormDisabled, setIsFormDisabled] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const isSecondDayLister = Boolean(initialItemUploadData?.isSecondDayLister)
  const isPreviousLister = Boolean(initialItemUploadData?.isPreviousLister)

  const disableForm = useCallback(() => setIsFormDisabled(true), [])
  const enableForm = useCallback(() => setIsFormDisabled(false), [])

  const handleAddPhotosClick = useCallback(() => {
    const { current } = fileInputRef

    if (!current) return

    current.click()
    current.focus()
  }, [])

  const isABTestEnabled = useCallback(
    (testName: string) => {
      const test = configuration.abTests[testName]

      if (!test) return false

      return test.variant?.toLowerCase() === 'on'
    },
    [configuration],
  )

  const getABTest = useCallback(
    (testName: string) => configuration.abTests[testName],
    [configuration],
  )

  const providerValue = useMemo(
    () => ({
      isSecondDayLister,
      isPreviousLister,
      configuration,
      setConfiguration,
      isABTestEnabled,
      getABTest,
      openPhotoInput: handleAddPhotosClick,
      fileInputRef,
      isFormDisabled,
      enableForm,
      disableForm,
      initialItemUploadData,
    }),
    [
      configuration,
      isPreviousLister,
      isSecondDayLister,
      isABTestEnabled,
      getABTest,
      handleAddPhotosClick,
      isFormDisabled,
      enableForm,
      disableForm,
      initialItemUploadData,
    ],
  )

  return <ItemUploadContext.Provider value={providerValue}>{children}</ItemUploadContext.Provider>
}

export const useItemUploadContext = () => {
  const context = useContext(ItemUploadContext)

  if (!context) {
    throw new Error('useItemUploadContext must be used within a useItemUploadContextProvider')
  }

  return context
}
