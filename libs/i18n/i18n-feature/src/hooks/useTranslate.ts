import { useCallback } from 'react'
import { useIntl } from 'react-intl'

import { Pluralize, TranslateWithPluralize } from '@marketplace-web/i18n/i18n-data'

import { createTranslation } from '../utils/create-translation'

function useTranslate(prefix?: string) {
  const intl = useIntl()

  return useCallback<TranslateWithPluralize>(
    (suffix: string, values, pluralize?: Pluralize) => {
      return createTranslation(intl, prefix)(suffix, values, pluralize)
    },
    [intl, prefix],
  )
}

export default useTranslate
