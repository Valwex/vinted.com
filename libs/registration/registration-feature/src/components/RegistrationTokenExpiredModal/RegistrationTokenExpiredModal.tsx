'use client'

import { Dialog } from '@vinted/web-ui'

import { useTranslate } from '@marketplace-web/i18n/i18n-feature'

type Props = {
  onOkClick: () => void
  isVisible: boolean
}

const RegistrationTokenExpiredModal = ({ onOkClick, isVisible }: Props) => {
  const translate = useTranslate('auth.registration_token_expired_modal')

  return (
    <Dialog
      show={isVisible}
      testId="registration-token-expired-modal"
      title={translate('title')}
      body={translate('body')}
      actions={[
        {
          text: translate('actions.ok'),
          callback: onOkClick,
          style: 'filled',
          testId: 'registration-token-expired-modal-ok-button',
        },
      ]}
    />
  )
}

export default RegistrationTokenExpiredModal
