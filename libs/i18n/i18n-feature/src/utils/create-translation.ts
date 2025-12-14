import { IntlShape } from 'react-intl'

import { Pluralize, TranslateWithPluralize } from '@marketplace-web/i18n/i18n-data'

import { defaultInterpolations, pluralization } from './i18n'

export const createTranslation = (intl: IntlShape, prefix?: string): TranslateWithPluralize => {
  return (suffix: string, values, pluralize?: Pluralize) => {
    const id = prefix ? `${prefix}.${suffix}` : suffix
    const pluralizeFunc = pluralization(intl.locale)
    const translationKey = pluralize ? `${id}.${pluralizeFunc(pluralize.count)}` : id

    if (intl.messages[translationKey] === '') return ''
    if (!values) return intl.formatMessage({ id: translationKey })

    return intl.formatMessage({ id: translationKey }, { ...defaultInterpolations, ...values })
  }
}
