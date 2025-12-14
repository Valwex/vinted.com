'use client'

import { FormattedMessage as IntlFormattedMessage, useIntl } from 'react-intl'

import { pluralization } from '../utils/i18n'

type OwnProps = {
  pluralize?: boolean
  count?: number
  id: string
}

type Props = OwnProps & React.ComponentProps<typeof IntlFormattedMessage>

/**
 * @deprecated use `useTranslate` instead
 */
const FormattedMessage = ({ id, count = 0, pluralize = false, ...props }: Props) => {
  const intl = useIntl()

  const pluralizeFunc = pluralization(intl.locale)
  const translationKey = pluralize ? `${id}.${pluralizeFunc(count)}` : id

  return <IntlFormattedMessage {...props} id={translationKey} />
}

export default FormattedMessage
