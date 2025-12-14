'use client'

import { Cell, Text } from '@vinted/web-ui'

import { useTranslate } from '@marketplace-web/i18n/i18n-feature'
import { useSession } from '@marketplace-web/shared/session-data'

type Props = {
  noteTranslationKey: string
}

const AdditionalNote = ({ noteTranslationKey }: Props) => {
  const translate = useTranslate()
  const { user } = useSession()

  if (user?.country_code === 'US') return null

  return (
    <Cell styling="narrow">
      <Text as="h4" testId="additional-note" type="caption" text={translate(noteTranslationKey)} />
    </Cell>
  )
}

export default AdditionalNote
