import { isNil, isArray, isObject, isEmpty } from 'lodash'

import { EligibilityItemAttributes, FieldValueType } from '../types/verification'

export const validateRequiredFields = (requiredFields: {
  [fieldName: string]: FieldValueType | null
}): { isValid: boolean; itemAttributes: EligibilityItemAttributes } => {
  const itemAttributes: EligibilityItemAttributes = []

  const isInvalid = Object.keys(requiredFields).some(fieldName => {
    const value = requiredFields[fieldName]

    if (isNil(value)) return true
    if (value === '') return true
    if (isArray(value) && !value.length) return true
    if (isObject(value) && isEmpty(value)) return true

    itemAttributes.push({ field_name: fieldName, value })

    return false
  })

  return { isValid: !isInvalid, itemAttributes }
}
