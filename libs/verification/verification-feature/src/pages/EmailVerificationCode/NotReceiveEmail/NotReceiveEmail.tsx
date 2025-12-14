'use client'

import { ArrowLeft24 } from '@vinted/monochrome-icons'
import { Button, InputText, Spacer, Text } from '@vinted/web-ui'
import { isEmpty } from 'lodash'
import { useCallback, useContext, useEffect, useState } from 'react'

import { useBrowserNavigation } from '@marketplace-web/browser/browser-navigation-util'
import { useTracking } from '@marketplace-web/observability/event-tracker-data'
import { useTranslate } from '@marketplace-web/i18n/i18n-feature'
import {
  renderValidation,
  useFormValidationMessage,
} from '@marketplace-web/vendor-abstractions/react-hook-form-feature'
import { UiState } from '@marketplace-web/shared/ui-state-util'
import { urlWithParams } from '@marketplace-web/browser/url-util'
import { useRefUrl } from '@marketplace-web/ref-url/ref-url-feature'
import { clickEvent, viewScreenEvent } from '@marketplace-web/verification/verification-data'

import { EmailCodeView } from '../../../constants'
import Context from '../EmailVerificationCodeContext'
import useEmailForm from '../hooks/useEmailForm'
import ConfirmationModal from './ConfirmationModal'
import { Submit } from './types'
import { EMAIL_CODE_VERIFICATION_URL } from '../../../constants/routes'

const NotReceiveEmail = () => {
  const translate = useTranslate()
  const { track } = useTracking()
  const [isOpenModal, setIsOpenModal] = useState(false)
  const { email: userEmail, uiState, canUserChangeEmail } = useContext(Context)
  const { handleSubmit, register, errors, getValues } = useEmailForm()
  const { pushHistoryState } = useBrowserNavigation()
  const refUrl = useRefUrl()

  const isSendingCode = uiState === UiState.Pending
  const isCodeSent = uiState === UiState.Success

  const getErrorMessage = useFormValidationMessage(
    errors,
    'email_verification_code.not_receive_email.inputs',
  )

  const navigateToEnterCodeView = useCallback(() => {
    pushHistoryState(
      urlWithParams(EMAIL_CODE_VERIFICATION_URL, {
        view: EmailCodeView.EnterCode,
        ref_url: refUrl,
      }),
    )
  }, [pushHistoryState, refUrl])

  useEffect(() => {
    track(viewScreenEvent({ screen: 'mand_email_verification_resend_code' }))
  }, [track])

  useEffect(() => {
    if (!isCodeSent) return

    navigateToEnterCodeView()
  }, [isCodeSent, navigateToEnterCodeView])

  const handleEmailSubmit = ({ useOldEmail }: Submit = {}) => {
    setIsOpenModal(false)

    handleSubmit({ useOldEmail })
  }

  const handleBackClick = () => {
    navigateToEnterCodeView()
  }

  const handleResendClick = (event: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    if (isSendingCode) {
      event.preventDefault()

      return
    }

    track(
      clickEvent({
        screen: 'resend_email_code',
        target: 'submit',
      }),
    )

    const { email } = getValues()

    if (email === userEmail) {
      handleSubmit()

      return
    }

    setIsOpenModal(true)
  }

  const renderTitle = () => {
    return (
      <Text as="h1" type="heading">
        {translate('email_verification_code.not_receive_email.title')}
      </Text>
    )
  }

  const renderDescription = () => {
    return (
      <Text as="span" html theme="muted">
        {translate('email_verification_code.not_receive_email.description')}
      </Text>
    )
  }

  const renderContactSupportText = () => {
    if (canUserChangeEmail) return null

    return (
      <>
        <Text as="span" html theme="muted" testId="contact_support">
          {translate('email_verification_code.not_receive_email.contact_support')}
        </Text>
        <Spacer size="x2-large" />
      </>
    )
  }

  const renderInput = () => {
    return (
      <InputText
        {...register}
        disabled={!canUserChangeEmail}
        title={translate('email_verification_code.not_receive_email.inputs.email.title')}
        type="email"
        inputMode="email"
        styling="tight"
        validation={
          renderValidation(getErrorMessage('email')) ||
          translate('email_verification_code.not_receive_email.inputs.email.info')
        }
      />
    )
  }

  const handleModalClose = () => {
    setIsOpenModal(false)
  }

  const renderButtons = () => {
    return (
      <>
        <Button
          testId="not-receive-email--resend-button"
          onClick={handleResendClick}
          styling="filled"
          disabled={!isEmpty(errors)}
          isLoading={isSendingCode}
        >
          {translate('email_verification_code.not_receive_email.actions.resend')}
        </Button>
        <Spacer size="medium" />
        <Button
          onClick={handleBackClick}
          iconName={ArrowLeft24}
          iconColor="primary-default"
          disabled={isSendingCode}
          testId="back-button"
        >
          {translate('email_verification_code.not_receive_email.actions.back')}
        </Button>
      </>
    )
  }

  const renderConfirmationModal = () => {
    const { email } = getValues()

    if (!isOpenModal) return null

    return (
      <ConfirmationModal email={email} onConfirm={handleEmailSubmit} onClose={handleModalClose} />
    )
  }

  return (
    <>
      {renderTitle()}
      <Spacer size="regular" />
      {renderDescription()}
      <Spacer size="x2-large" />
      {renderInput()}
      <Spacer size="x2-large" />
      {renderContactSupportText()}
      <Spacer size="regular" />
      {renderButtons()}
      {renderConfirmationModal()}
    </>
  )
}

export default NotReceiveEmail
