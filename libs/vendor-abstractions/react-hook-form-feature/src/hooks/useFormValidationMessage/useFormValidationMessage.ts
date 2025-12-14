'use client'

import { get } from 'lodash'
import { FieldError } from 'react-hook-form'
import { useIntl } from 'react-intl'

import { useTranslate } from '@marketplace-web/i18n/i18n-feature'

import { snakeCase } from '../../utils/string'

const GenericErrors = {
  required: 'errors.blank',
}

export default function useFormValidationMessage(
  errors: Record<string, unknown> | FieldError,
  prefix = '',
) {
  const intl = useIntl()
  const translate = useTranslate()

  return function validationMessage(
    field: string,
    messages?: Record<string, string>,
  ): string | null {
    const fieldErrors = get(errors, field)

    if (!fieldErrors) return null

    const { type, message } = fieldErrors
    const typeTranslation = `${prefix}.${snakeCase(field)}.errors.${snakeCase(type)}`

    if (message) return message
    if (messages?.[type]) return messages[type]!

    if (GenericErrors[type] && !intl.messages[typeTranslation]) {
      return translate(GenericErrors[type], {
        field: translate(`${prefix}.${snakeCase(field)}.title`),
      })
    }

    return translate(snakeCase(typeTranslation))
  }
}
