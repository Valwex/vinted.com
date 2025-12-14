'use client'

import { ReactNode, createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { noop } from 'lodash'

import { ItemAlertStatus } from '../constants/item-alert-status'
import { ParcelModel } from '../types/parcel'
import useFieldErrors from '../hooks/useFieldErrors'
import { Attributes, AttributesContextType } from '../types/context'
import { InitialAttributesData } from '../types/initial-data'
import { ItemUploadFieldName } from '../constants'
import { ItemEditModel } from '../types/item-edit'
import { ModelMetadata } from '../types'

export const AttributesContext = createContext<AttributesContextType>({
  alertType: null,
  feedbackId: null,
  setFeedbackId: noop,
  isBumpChecked: false,
  setIsBumpChecked: noop,
  isLuxuryBrand: null,
  isPromoted: false,
  setBrand: noop,
  setCatalogId: noop,
  setSizeId: noop,
  setDescription: noop,
  setTitle: noop,
  setIsUnisex: noop,
  setMeasurementWidth: noop,
  setMeasurementLength: noop,
  setIsbn: noop,
  setAuthor: noop,
  setBookTitle: noop,
  setStatusId: noop,
  setColorIds: noop,
  setPrice: noop,
  setPackageSizeId: noop,
  setDomesticShipment: noop,
  setInternationalShipment: noop,
  setVideoGameRatingId: noop,
  setManufacturer: noop,
  setManufacturerLabel: noop,
  setModelData: noop,
  initializeAttributes: noop,
  attributes: {
    id: null,
    manufacturer: null,
    manufacturerLabel: null,
    catalogId: null,
    brandId: null,
    brandTitle: null,
    brandHasChildren: false,
    sizeId: null,
    statusId: null,
    colorIds: [],
    title: '',
    description: '',
    isUnisex: false,
    measurementWidth: null,
    measurementLength: null,
    isbn: null,
    author: null,
    bookTitle: null,
    price: null,
    packageSizeId: null,
    domesticShipment: null,
    internationalShipment: null,
    videoGameRatingId: null,
    modelData: null,
    modelHasChildren: false,
  },
  isColorManuallySelectedRef: { current: false },
  parcel: null,
  setParcel: noop,
  setParcelHeight: noop,
  setParcelLength: noop,
  setParcelWidth: noop,
  setParcelWeight: noop,
  setUkUserMigrateMetricUnits: noop,
})

export const AttributesContextProvider = ({
  initialAttributesData,
  children,
}: {
  initialAttributesData: InitialAttributesData
  children: ReactNode
}) => {
  const { removeFieldError } = useFieldErrors()

  const [attributes, setAttributes] = useState<Attributes>({
    id: initialAttributesData?.item.id || null,
    manufacturer: initialAttributesData?.item.manufacturer || null,
    manufacturerLabel: initialAttributesData?.item.manufacturerLabel || null,
    catalogId: initialAttributesData?.item.catalogId || null,
    brandId: initialAttributesData?.item.brandId || null,
    brandTitle: initialAttributesData?.item.brand?.title || null,
    brandHasChildren: initialAttributesData?.item.brand?.hasChildren || false,
    sizeId: initialAttributesData?.item.sizeId || null,
    statusId: initialAttributesData?.item.statusId || null,
    colorIds: initialAttributesData?.item.colorIds || [],
    title: initialAttributesData?.item.title || '',
    description: initialAttributesData?.item.description || '',
    isUnisex: initialAttributesData?.item.isUnisex || false,
    measurementWidth: initialAttributesData?.item.measurementWidth || null,
    measurementLength: initialAttributesData?.item.measurementLength || null,
    isbn: initialAttributesData?.item.isbn || null,
    price: initialAttributesData?.item.price || null,
    packageSizeId: initialAttributesData?.item.packageSizeId ?? null,
    domesticShipment: initialAttributesData?.item.domesticShipmentPrice || null,
    internationalShipment: initialAttributesData?.item.internationalShipmentPrice || null,
    videoGameRatingId: initialAttributesData?.item.videoGameRatingId || null,
    modelData: initialAttributesData?.item.model || null,
    author: initialAttributesData?.item.author || null,
    bookTitle: initialAttributesData?.item.bookTitle || null,
    modelHasChildren: initialAttributesData?.item.modelHasChildren || false,
  })

  const isColorManuallySelectedRef = useRef<boolean>(
    Boolean(initialAttributesData?.item.colorIds.length),
  )

  const updateAttribute = <K extends keyof Attributes>(key: K, value: Attributes[K]) => {
    setAttributes(prevAttributes => ({
      ...prevAttributes,
      [key]: value,
    }))
  }

  const [isLuxuryBrand, setIsLuxuryBrand] = useState<boolean | null>(
    initialAttributesData?.item.brand?.isLuxury || null,
  )
  const [isPromoted, setIsPromoted] = useState<boolean>(
    Boolean(initialAttributesData?.item.isPromoted),
  )
  const [feedbackId, setFeedbackId] = useState<number | null>(null)
  const [isBumpChecked, setIsBumpChecked] = useState<boolean>(false)
  const [alertType, setAlertType] = useState<ItemAlertStatus | null>(
    initialAttributesData?.item.itemAlert?.itemAlertType || null,
  )
  const [parcel, setParcel] = useState<ParcelModel | null>(
    initialAttributesData?.parcelModel || null,
  )

  const initializeAttributes = useCallback((item: ItemEditModel, parcelModel?: ParcelModel) => {
    setAttributes({
      id: item.id,
      manufacturer: item.manufacturer,
      manufacturerLabel: item.manufacturerLabel,
      catalogId: item.catalogId,
      brandId: item.brandId,
      brandTitle: item.brand?.title || null,
      brandHasChildren: item.brand?.hasChildren || false,
      sizeId: item.sizeId || null,
      statusId: item.statusId || null,
      colorIds: item.colorIds || [],
      title: item.title || '',
      description: item.description || '',
      isUnisex: item.isUnisex,
      measurementWidth: item.measurementWidth,
      measurementLength: item.measurementLength,
      isbn: item.isbn,
      price: item.price,
      packageSizeId: item.packageSizeId ?? null,
      domesticShipment: item.domesticShipmentPrice,
      internationalShipment: item.internationalShipmentPrice,
      videoGameRatingId: item.videoGameRatingId,
      modelData: item.model || null,
      author: item.author,
      bookTitle: item.bookTitle,
      modelHasChildren: item.modelHasChildren,
    })
    setIsLuxuryBrand(item.brand?.isLuxury || null)
    setIsPromoted(item.isPromoted)
    setAlertType(item.itemAlert?.itemAlertType || null)

    if (item.colorIds.length) {
      isColorManuallySelectedRef.current = true
    }

    if (parcelModel) {
      setParcel(parcelModel)
    }
  }, [])

  const setMeasurementWidth = useCallback(
    (value: number | null) => {
      updateAttribute('measurementWidth', value)
      removeFieldError(ItemUploadFieldName.MeasurementWidth)
    },
    [removeFieldError],
  )

  const setMeasurementLength = useCallback(
    (value: number | null) => {
      updateAttribute('measurementLength', value)
      removeFieldError(ItemUploadFieldName.MeasurementLength)
    },
    [removeFieldError],
  )

  const setIsUnisex = useCallback(
    (value: boolean) => {
      updateAttribute('isUnisex', value)
      removeFieldError(ItemUploadFieldName.Unisex)
    },
    [removeFieldError],
  )

  const setTitle = useCallback(
    (value: string) => {
      updateAttribute('title', value)
      removeFieldError(ItemUploadFieldName.Title)
    },
    [removeFieldError],
  )

  const setDescription = useCallback(
    (value: string) => {
      updateAttribute('description', value)
      removeFieldError(ItemUploadFieldName.Description)
    },
    [removeFieldError],
  )

  const setBrand = useCallback(
    ({
      id,
      title,
      isLuxury,
      hasChildren,
    }: {
      id: number | null
      title: string | null
      isLuxury: boolean
      hasChildren: boolean
    }) => {
      updateAttribute('brandId', id)
      updateAttribute('brandTitle', title)
      setIsLuxuryBrand(isLuxury)
      removeFieldError(ItemUploadFieldName.Brand)
      updateAttribute('brandHasChildren', hasChildren)
    },
    [removeFieldError],
  )

  const setCatalogId = useCallback(
    (id: number | null) => {
      updateAttribute('catalogId', id)
      removeFieldError(ItemUploadFieldName.Category)
      setBrand({ id: null, title: null, isLuxury: false, hasChildren: false })
    },
    [removeFieldError, setBrand],
  )

  const setSizeId = useCallback(
    (id: number | null) => {
      updateAttribute('sizeId', id)
      removeFieldError(ItemUploadFieldName.Size)
    },
    [removeFieldError],
  )

  const setStatusId = useCallback(
    (id: number | null) => {
      updateAttribute('statusId', id)
      removeFieldError(ItemUploadFieldName.Condition)
    },
    [removeFieldError],
  )

  const setColorIds = useCallback(
    (ids: Array<number>) => {
      updateAttribute('colorIds', ids)
      removeFieldError(ItemUploadFieldName.Color)
    },
    [removeFieldError],
  )

  const setIsbn = useCallback(
    (value: string | null, isValid: boolean) => {
      updateAttribute('isbn', value)

      if (isValid) removeFieldError(ItemUploadFieldName.Isbn)
    },
    [removeFieldError],
  )

  const setAuthor = useCallback((value: string | null) => {
    updateAttribute('author', value)
  }, [])

  const setBookTitle = useCallback((value: string | null) => {
    updateAttribute('bookTitle', value)
  }, [])

  const setPrice = useCallback(
    (value: number | null) => {
      updateAttribute('price', value)
      removeFieldError(ItemUploadFieldName.Price)
    },
    [removeFieldError],
  )

  const setPackageSizeId = useCallback(
    (id: number | null) => {
      updateAttribute('packageSizeId', id)
      removeFieldError(ItemUploadFieldName.PackageSize)
    },
    [removeFieldError],
  )

  const setDomesticShipment = useCallback(
    (value: string | null) => {
      updateAttribute('domesticShipment', value)
      removeFieldError(ItemUploadFieldName.DomesticShipmentPrice)
    },
    [removeFieldError],
  )

  const setInternationalShipment = useCallback(
    (value: string | null) => {
      updateAttribute('internationalShipment', value)
      removeFieldError(ItemUploadFieldName.InternationalShipmentPrice)
    },
    [removeFieldError],
  )

  const setVideoGameRatingId = useCallback(
    (id: number | null) => {
      updateAttribute('videoGameRatingId', id)
      removeFieldError(ItemUploadFieldName.VideoGameRating)
    },
    [removeFieldError],
  )

  const setManufacturer = useCallback(
    (value: string | null) => {
      updateAttribute('manufacturer', value)
      removeFieldError(ItemUploadFieldName.Manufacturer)
    },
    [removeFieldError],
  )

  const setManufacturerLabel = useCallback(
    (value: string | null) => {
      updateAttribute('manufacturerLabel', value)
      removeFieldError(ItemUploadFieldName.ManufacturerLabel)
    },
    [removeFieldError],
  )

  const setModelData = useCallback(
    (metadata: ModelMetadata | null, hasChildren: boolean) => {
      updateAttribute('modelData', metadata)
      updateAttribute('modelHasChildren', hasChildren)
      removeFieldError(ItemUploadFieldName.Model)
    },
    [removeFieldError],
  )

  const updateParcel = <K extends keyof ParcelModel>(key: K, value: ParcelModel[K]) => {
    setParcel(prevParcel => {
      const updatedParcel = prevParcel ?? {
        height: null,
        length: null,
        width: null,
        weight: null,
        migrateUkMetricUnits: false,
      }

      return {
        ...updatedParcel,
        [key]: value,
      }
    })
  }

  const setParcelHeight = useCallback(
    (value: string | null) => {
      updateParcel('height', value)
      removeFieldError(ItemUploadFieldName.ParcelHeight)
    },
    [removeFieldError],
  )

  const setParcelLength = useCallback(
    (value: string | null) => {
      updateParcel('length', value)
      removeFieldError(ItemUploadFieldName.ParcelLength)
    },
    [removeFieldError],
  )

  const setParcelWidth = useCallback(
    (value: string | null) => {
      updateParcel('width', value)
      removeFieldError(ItemUploadFieldName.ParcelWidth)
    },
    [removeFieldError],
  )

  const setParcelWeight = useCallback(
    (value: string | null) => {
      updateParcel('weight', value)
      removeFieldError(ItemUploadFieldName.ParcelWeight)
    },
    [removeFieldError],
  )

  const setUkUserMigrateMetricUnits = useCallback((value: boolean) => {
    updateParcel('migrateUkMetricUnits', value)
  }, [])

  const providerValue = useMemo(
    () => ({
      alertType,
      setManufacturer,
      setManufacturerLabel,
      feedbackId,
      setFeedbackId,
      isBumpChecked,
      setIsBumpChecked,
      isLuxuryBrand,
      isPromoted,
      setTitle,
      setDescription,
      setCatalogId,
      setBrand,
      setSizeId,
      setStatusId,
      setColorIds,
      setIsUnisex,
      setMeasurementWidth,
      setMeasurementLength,
      initializeAttributes,
      attributes,
      setIsbn,
      setAuthor,
      setBookTitle,
      setPrice,
      setPackageSizeId,
      setDomesticShipment,
      setInternationalShipment,
      setVideoGameRatingId,
      setModelData,
      isColorManuallySelectedRef,
      parcel,
      setParcel,
      setParcelHeight,
      setParcelLength,
      setParcelWidth,
      setParcelWeight,
      setUkUserMigrateMetricUnits,
    }),
    [
      alertType,
      setManufacturer,
      setManufacturerLabel,
      feedbackId,
      isBumpChecked,
      isLuxuryBrand,
      isPromoted,
      setTitle,
      setDescription,
      setCatalogId,
      setBrand,
      setSizeId,
      setStatusId,
      setColorIds,
      setIsUnisex,
      setMeasurementWidth,
      setMeasurementLength,
      initializeAttributes,
      attributes,
      setIsbn,
      setAuthor,
      setBookTitle,
      setPrice,
      setPackageSizeId,
      setDomesticShipment,
      setInternationalShipment,
      setVideoGameRatingId,
      setModelData,
      parcel,
      setParcelHeight,
      setParcelLength,
      setParcelWidth,
      setParcelWeight,
      setUkUserMigrateMetricUnits,
    ],
  )

  return <AttributesContext.Provider value={providerValue}>{children}</AttributesContext.Provider>
}

export const useAttributesContext = () => {
  const context = useContext(AttributesContext)

  if (!context) {
    throw new Error('useAttributesContext must be used within a AttributesContextProvider')
  }

  return context
}
