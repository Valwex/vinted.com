'use client'

import { Button, Dialog, Cell, Text, Spacer } from '@vinted/web-ui'

import { useTranslate } from '@marketplace-web/i18n/i18n-feature'

type Props = {
  isOpen: boolean
  title: string
  text: string
  onClose: () => void
}

const TooManyAttemptsModal = ({ isOpen, title, text, onClose }: Props) => {
  const translate = useTranslate('settings.security.error.too_many_mismatches')

  return (
    <Dialog show={isOpen}>
      <Cell>
        <Text as="h1" alignment="center" type="heading" width="parent" text={title} />

        <Spacer size="x-large" />
        <Text as="span" text={text} />
        <Spacer size="x-large" />

        <Button text={translate('button')} styling="filled" onClick={onClose} />
      </Cell>
    </Dialog>
  )
}

export default TooManyAttemptsModal
