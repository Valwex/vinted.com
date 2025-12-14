'use client'

import { createContext, ReactNode, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { noop } from 'lodash'

import { DynamicAttribute } from '../types'
import { LayeredDynamicAttributesContextType } from '../types/context'
import useFieldErrors from '../hooks/useFieldErrors'
import { ItemAttributeModel } from '../types/item-edit'
import { NormalizedAttributes } from '../types/layered-dynamic-attributes'
import { InitialDynamicAttributesData } from '../types/initial-data'
import { reduceAttributes } from '../utils/dynamic-attribute'

export const LayeredDynamicAttributesContext = createContext<LayeredDynamicAttributesContextType>({
  selectedLayeredDynamicAttributes: [],
  getLayeredDynamicAttributeValuesByCode: () => undefined,
  setLayeredDynamicAttributeValue: noop,
  getIsAttributePrefillPrevented: () => false,
  addAttributePrefillPrevent: noop,
})

export const LayeredDynamicAttributesContextProvider = ({
  initialDynamicAttributesData,
  children,
}: {
  initialDynamicAttributesData: InitialDynamicAttributesData
  children: ReactNode
}) => {
  const initialCatalogAttributesState = reduceAttributes(
    initialDynamicAttributesData?.itemAttributes,
    'ids',
  )

  const [layeredDynamicAttributes, setLayeredDynamicAttributes] = useState<
    NormalizedAttributes<ItemAttributeModel, 'ids'>
  >(initialCatalogAttributesState)

  const preventPrefillAttributeCodesRef = useRef<Array<string>>(
    initialDynamicAttributesData?.itemAttributes
      ? initialDynamicAttributesData?.itemAttributes.map(attribute => attribute.code)
      : [],
  )

  const { removeFieldError } = useFieldErrors()

  const selectedLayeredDynamicAttributes = useMemo(
    () =>
      layeredDynamicAttributes.names.reduce<Array<DynamicAttribute>>((acc, name) => {
        const value = layeredDynamicAttributes.byName[name]
        if (value) {
          acc.push({
            field: name,
            value,
          })
        }

        return acc
      }, []),
    [layeredDynamicAttributes.byName, layeredDynamicAttributes.names],
  )

  const getLayeredDynamicAttributeValuesByCode = useCallback(
    (fieldName: string) => layeredDynamicAttributes.byName[fieldName] || undefined,
    [layeredDynamicAttributes.byName],
  )

  const setLayeredDynamicAttributeValue = useCallback(
    (code: string, value: Array<number>) => {
      setLayeredDynamicAttributes(prev => {
        const updatedByName = { ...prev.byName, [code]: value }
        const updatedNames = prev.names.includes(code) ? prev.names : [...prev.names, code]

        return {
          byName: updatedByName,
          names: updatedNames,
        }
      })

      removeFieldError(code)
    },
    [setLayeredDynamicAttributes, removeFieldError],
  )

  const getIsAttributePrefillPrevented = useCallback(
    (code: string) => preventPrefillAttributeCodesRef.current.includes(code),
    [],
  )
  const addAttributePrefillPrevent = useCallback(
    (code: string) => {
      if (!getIsAttributePrefillPrevented(code)) preventPrefillAttributeCodesRef.current.push(code)
    },
    [getIsAttributePrefillPrevented],
  )

  const providerValue = useMemo(
    () => ({
      selectedLayeredDynamicAttributes,
      getLayeredDynamicAttributeValuesByCode,
      setLayeredDynamicAttributeValue,
      getIsAttributePrefillPrevented,
      addAttributePrefillPrevent,
    }),
    [
      selectedLayeredDynamicAttributes,
      getLayeredDynamicAttributeValuesByCode,
      setLayeredDynamicAttributeValue,
      getIsAttributePrefillPrevented,
      addAttributePrefillPrevent,
    ],
  )

  return (
    <LayeredDynamicAttributesContext.Provider value={providerValue}>
      {children}
    </LayeredDynamicAttributesContext.Provider>
  )
}

export const useLayeredDynamicAttributesContext = () => {
  const context = useContext(LayeredDynamicAttributesContext)

  if (!context) {
    throw new Error(
      'useLayeredDynamicAttributesContext must be used within a LayeredDynamicAttributesContextProvider',
    )
  }

  return context
}
