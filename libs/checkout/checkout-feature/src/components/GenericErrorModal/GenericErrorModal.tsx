'use client'

import { Dialog, Text } from '@vinted/web-ui'

import { useTranslate } from '@marketplace-web/i18n/i18n-feature'

type Props = {
  message?: string
  isShown: boolean
  alignBodyLeft?: boolean
  onClose: () => void
}

const GenericErrorModal = ({ message, isShown, alignBodyLeft, onClose }: Props) => {
  const translate = useTranslate('checkout.generic_error_modal')

  return (
    <Dialog
      show={isShown}
      title={translate('title')}
      body={
        <Text
          as="span"
          text={message || translate('body')}
          alignment={alignBodyLeft ? 'left' : 'center'}
        />
      }
      actions={[
        {
          text: translate('actions.close'),
          style: Dialog.ActionStyling.Filled,
          callback: onClose,
          testId: 'checkout-generic-error-modal-action-button',
        },
      ]}
      testId="checkout-generic-error-modal"
    />
  )
}

export default GenericErrorModal
