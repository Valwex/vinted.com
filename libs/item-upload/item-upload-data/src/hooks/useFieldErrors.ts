import { useContext } from 'react'

// Data module can only import data type modules - ignore module boundaries rule
// Keep this until new utils/types module is introduced that is importable by data module

import { useLatestCallback } from '@marketplace-web/shared/ui-state-util'

import { UiStateContext } from '../contexts/UiStateContext'
import { ItemUploadFieldName } from '../constants'

const useFieldErrors = () => {
  const {
    errors: [errors, setErrors],
  } = useContext(UiStateContext)

  const removeFieldError = (fieldName: ItemUploadFieldName | string) => {
    if (!errors.byName[fieldName]) return

    const newErrors = { ...errors }
    delete newErrors.byName[fieldName]
    newErrors.names = newErrors.names.filter(name => name !== fieldName)

    setErrors(newErrors)
  }

  const latestRemoveFieldError = useLatestCallback(removeFieldError)

  return { removeFieldError: latestRemoveFieldError }
}

export default useFieldErrors
