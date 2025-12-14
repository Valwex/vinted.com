'use client'

import { noop, isUndefined } from 'lodash'
import {
  ReactNode,
  createContext,
  useMemo,
  useState,
  useCallback,
  useEffect,
  useRef,
  useContext,
} from 'react'

import { VerificationContextType } from '../types/context'
import { validateRequiredFields } from '../utils/verification'
import { EligibilityItemAttributes, FieldValueType } from '../types/verification'
import { useAttributesContext } from './AttributesContext'
import { ItemUploadFieldName } from '../constants'
import {
  getOfflineVerificationEligibilityCriteria,
  offlineVerificationEligibilityCheck,
} from '../api'

// Supported verifications:
// EVS - electronics verification service
// IVS - item verification service

export const VerificationContext = createContext<VerificationContextType>({
  showIVSModal: noop,
  showEVSModal: noop,
  updateVerification: noop,
  loadCriteriaForCatalog: noop,
  isRequirementsLoading: true,
  isIVSEligible: false,
  isEVSEligible: false,
  isIVSModalOpen: false,
  isEVSModalOpen: false,
})

export const VerificationContextProvider = ({ children }: { children: ReactNode }) => {
  const {
    attributes: { price },
  } = useAttributesContext()
  const priceRef = useRef(price)

  const [isRequirementsLoading, setIsRequirementsLoading] = useState(true)
  const [requiredFields, setRequiredFields] = useState<{
    [fieldName: string]: FieldValueType | null
  }>({})
  const [isIVSEligible, setIsIVSEligible] = useState(false)
  const [isEVSEligible, setIsEVSEligible] = useState(false)

  const [isIVSModalOpen, setIsIVSModalOpen] = useState(false)
  const [isEVSModalOpen, setIsEVSModalOpen] = useState(false)

  useEffect(() => {
    priceRef.current = price
  }, [price])

  const loadCriteriaForCatalog = useCallback(async (value: number | null) => {
    if (!value) {
      setRequiredFields({})
      setIsRequirementsLoading(false)

      return
    }

    setIsRequirementsLoading(true)

    const response = await getOfflineVerificationEligibilityCriteria(value.toString())

    if ('errors' in response || !response.required_field_codes.length) {
      setRequiredFields({})
      setIsRequirementsLoading(false)

      return
    }

    let newRequiredFields: {
      [fieldName: string]: FieldValueType | null
    } = {}

    response.required_field_codes.forEach(field => {
      let newField: { [fieldName: string]: FieldValueType | null }

      // Map price value outside of Catalog block scope
      if (field === ItemUploadFieldName.Price) {
        newField = { [field]: priceRef.current?.toString() || null }
      } else {
        newField = { [field]: null }
      }

      newRequiredFields = { ...newRequiredFields, ...newField }
    })

    setRequiredFields({ ...newRequiredFields, [ItemUploadFieldName.Category]: value })

    setIsRequirementsLoading(false)
  }, [])

  const updateVerification = useCallback((fieldName: string, value: FieldValueType | null) => {
    setRequiredFields(prevFields => {
      if (!prevFields || prevFields.length === 1) return prevFields
      if (isUndefined(prevFields[fieldName])) return prevFields

      return {
        ...prevFields,
        [fieldName]: value,
      }
    })
  }, [])

  const checkEligibility = async (itemAttributes: EligibilityItemAttributes) => {
    const response = await offlineVerificationEligibilityCheck(itemAttributes)

    if ('errors' in response) return

    setIsIVSEligible(response.ivs_eligible)
    setIsEVSEligible(response.evs_eligible)
  }

  useEffect(() => {
    if (Object.keys(requiredFields).length === 0) {
      setIsIVSEligible(false)
      setIsEVSEligible(false)

      return
    }

    // Do not change eligibility if only Catalog exists
    if (Object.keys(requiredFields).length === 1) return

    const { isValid, itemAttributes } = validateRequiredFields(requiredFields)

    if (isValid) {
      checkEligibility(itemAttributes)

      return
    }

    setIsIVSEligible(false)
    setIsEVSEligible(false)
  }, [requiredFields])

  const showEVSModal = useCallback(() => setIsEVSModalOpen(true), [])
  const showIVSModal = useCallback(() => setIsIVSModalOpen(true), [])

  const providerValue = useMemo(
    () => ({
      showIVSModal,
      showEVSModal,
      isIVSEligible,
      isEVSEligible,
      isEVSModalOpen,
      isIVSModalOpen,
      updateVerification,
      isRequirementsLoading,
      loadCriteriaForCatalog,
    }),
    [
      showIVSModal,
      showEVSModal,
      isIVSEligible,
      isEVSEligible,
      isEVSModalOpen,
      isIVSModalOpen,
      updateVerification,
      isRequirementsLoading,
      loadCriteriaForCatalog,
    ],
  )

  return (
    <VerificationContext.Provider value={providerValue}>{children}</VerificationContext.Provider>
  )
}

export const useVerificationContext = () => {
  const context = useContext(VerificationContext)

  if (!context) {
    throw new Error('useVerificationContext must be used within a VerificationContextProvider')
  }

  return context
}
