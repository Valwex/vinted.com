'use client'

import { useEffect } from 'react'

import { ItemUploadFieldName } from '../constants'
import { useUiStateContext } from '../contexts/UiStateContext'

const useFieldVisibility = ({
  fieldName,
  isVisible,
}: {
  fieldName: ItemUploadFieldName | string
  isVisible: boolean
}) => {
  const { updateFieldVisibility } = useUiStateContext()

  useEffect(() => {
    updateFieldVisibility({ fieldName, isVisible })
  }, [updateFieldVisibility, isVisible, fieldName])
}

export default useFieldVisibility
