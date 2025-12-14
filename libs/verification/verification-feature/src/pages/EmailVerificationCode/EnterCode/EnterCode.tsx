'use client'

import { Button, InputText, Spacer, Text, Validation } from '@vinted/web-ui'
import { useContext, useEffect } from 'react'

import {
  useBrowserNavigation,
  navigateToPage,
} from '@marketplace-web/browser/browser-navigation-util'
import { useTracking } from '@marketplace-web/observability/event-tracker-data'
import { useTranslate } from '@marketplace-web/i18n/i18n-feature'
import { UiState } from '@marketplace-web/shared/ui-state-util'
import { urlWithParams } from '@marketplace-web/browser/url-util'
import { clickEvent, viewScreenEvent } from '@marketplace-web/verification/verification-data'
import { HelpCenterFaqEntryUrl } from '@marketplace-web/help-center/help-center-faq-entry-url-feature'
import { FaqEntryType } from '@marketplace-web/help-center/help-center-faq-entry-url-data'
import { ResponseCode } from '@marketplace-web/core-api/api-client-util'
import { useRefUrl } from '@marketplace-web/ref-url/ref-url-feature'

import { EmailCodeView } from '../../../constants'
import { MIN_CODE_LENGTH } from '../constants'
import Context from '../EmailVerificationCodeContext'
import useEnterCodeForm from '../hooks/useEnterCodeForm'
import { EMAIL_CODE_VERIFICATION_URL, ROOT_URL } from '../../../constants/routes'

const EnterCode = () => {
  const translate = useTranslate()
  const { track } = useTracking()
  const { formError, resetForm, handleSubmit, register, isLoading, watch, isCodeValidated } =
    useEnterCodeForm()
  const { email, sendEmailCode, uiState, resetUiState } = useContext(Context)
  const { pushHistoryState } = useBrowserNavigation()
  const refUrl = useRefUrl()

  const isSendingCode = uiState === UiState.Pending
  const isExpiredCode = formError?.code === ResponseCode.EmailVerificationCodeExpired

  useEffect(() => {
    track(viewScreenEvent({ screen: 'mand_email_verification_enter_code' }))
  }, [track])

  useEffect(() => {
    if (!isCodeValidated) return

    navigateToPage(urlWithParams(ROOT_URL, { ref_url: refUrl }))
  }, [isCodeValidated, refUrl])

  const handleFaqClick = url => {
    track(
      clickEvent({
        screen: 'mand_email_verification_start',
        target: 'help',
      }),
    )

    resetUiState()
    navigateToPage(urlWithParams(url, { refUrl }))
  }

  const handleHelpClick = () => {
    track(
      clickEvent({
        screen: 'mand_email_verification_enter_code',
        target: 'didnt_receive_email',
      }),
    )

    resetUiState()
    pushHistoryState(
      urlWithParams(EMAIL_CODE_VERIFICATION_URL, {
        view: EmailCodeView.NotReceiveEmail,
        ref_url: refUrl,
      }),
    )
  }

  const handleResend = (event: React.BaseSyntheticEvent) => {
    event.preventDefault()

    resetForm()
    sendEmailCode()
  }

  const renderTitle = () => {
    return (
      <Text as="h1" type="heading">
        {translate('email_verification_code.enter_code.title')}
      </Text>
    )
  }

  const renderDescription = () => {
    return (
      <>
        <Text as="span" type="body" theme="muted">
          {translate('email_verification_code.enter_code.description')}
        </Text>
        <Text as="span" type="body" theme="amplified">
          {email}
        </Text>
      </>
    )
  }

  const renderInput = () => {
    return (
      <>
        <InputText
          {...register}
          type="text"
          inputMode="numeric"
          placeholder={translate('email_verification_code.enter_code.inputs.code.placeholder')}
          styling="tight"
          disabled={isSendingCode}
          validation={<Validation text={formError?.message} theme="warning" />}
          testId="verification-code-input"
        />
        {!formError?.message && <Spacer size="large" />}
      </>
    )
  }

  const renderActionButton = () => {
    const buttonText = isExpiredCode
      ? translate('email_verification_code.enter_code.actions.resend')
      : translate('email_verification_code.enter_code.actions.submit')

    return (
      <Button
        testId="verification-code-submit-button"
        type="submit"
        styling="filled"
        disabled={isLoading || String(watch().code).length !== MIN_CODE_LENGTH}
        isLoading={isLoading || isSendingCode}
        onClick={(event: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
          if (isLoading || isSendingCode) {
            event.preventDefault()
          }
        }}
      >
        {buttonText}
      </Button>
    )
  }

  const renderHelpButton = () => {
    return (
      <>
        <Button onClick={handleHelpClick} styling="flat" disabled={isLoading || isSendingCode}>
          {translate('email_verification_code.enter_code.actions.help')}
        </Button>
        <HelpCenterFaqEntryUrl
          type={FaqEntryType.HowToVerifyEmailCode}
          render={url => (
            <Button styling="flat" onClick={() => handleFaqClick(url)}>
              {translate('email_verification_code.enter_code.actions.have_any_questions')}
            </Button>
          )}
        />
      </>
    )
  }

  const handleSubmitClick = (event: React.BaseSyntheticEvent) => {
    if (isExpiredCode) {
      handleResend(event)

      return
    }

    handleSubmit(event)
  }

  return (
    <form onSubmit={handleSubmitClick}>
      {renderTitle()}
      <Spacer size="medium" />
      {renderDescription()}
      <Spacer size="x3-large" />
      {renderInput()}
      <Spacer size="large" />
      {renderActionButton()}
      <Spacer size="medium" />
      {renderHelpButton()}
    </form>
  )
}

export default EnterCode
