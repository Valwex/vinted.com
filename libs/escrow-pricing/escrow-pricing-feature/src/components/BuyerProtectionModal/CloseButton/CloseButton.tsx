'use client'

import { Button } from '@vinted/web-ui'

import { useTranslate } from '@marketplace-web/i18n/i18n-feature'

type Props = {
  handleClose: () => void
  translationsPrefix:
    | 'buyer_protection_dialog.buyer_protection_info_business'
    | 'buyer_protection_dialog.buyer_protection_info'
}

const CloseButton = ({ handleClose, translationsPrefix }: Props) => {
  const translate = useTranslate(translationsPrefix)

  return (
    <Button
      text={translate('got_it')}
      styling="filled"
      onClick={handleClose}
      testId="service-fee-modal-close"
    />
  )
}

export default CloseButton
