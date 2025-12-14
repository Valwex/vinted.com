'use client'

import { Button, Cell, Dialog, Spacer, Text } from '@vinted/web-ui'

import { useTranslate } from '@marketplace-web/i18n/i18n-feature'

import { Submit } from '../types'

type Props = {
  onConfirm: (args?: Submit) => void
  onClose: () => void
  email: string
}

const ConfirmationModal = ({ email, onConfirm, onClose }: Props) => {
  const translate = useTranslate()

  const handleConfirm = () => {
    onConfirm()
  }

  const handleCancel = () => {
    onConfirm({ useOldEmail: true })
  }

  const renderTitle = () => (
    <Text as="h1" type="heading" alignment="center" width="parent">
      {translate('email_verification_code.not_receive_email.confirmation_modal.title')}
    </Text>
  )

  const renderDescription = () => (
    <Text as="span" alignment="center" width="parent" theme="muted">
      {translate('email_verification_code.not_receive_email.confirmation_modal.description')}
      <br />
      <Text as="span" bold theme="muted">
        {email}
      </Text>
    </Text>
  )

  const renderButtons = () => (
    <>
      <Button styling="filled" onClick={handleConfirm}>
        {translate('email_verification_code.not_receive_email.confirmation_modal.actions.submit')}
      </Button>
      <Spacer size="medium" />
      <Button styling="flat" onClick={handleCancel}>
        {translate('email_verification_code.not_receive_email.confirmation_modal.actions.cancel')}
      </Button>
    </>
  )

  return (
    <Dialog
      show
      className="auth__container"
      testId="not-receive-email--confirmation-modal"
      closeOnOverlay
      defaultCallback={onClose}
    >
      <Cell>
        {renderTitle()}
        <Spacer size="large" />
        {renderDescription()}
        <Spacer size="x-large" />
        {renderButtons()}
      </Cell>
    </Dialog>
  )
}

export default ConfirmationModal
