'use client'

import { Button, Cell, Checkbox, Divider, InputText, Note, Spacer, Text } from '@vinted/web-ui'
import { ChangeEvent, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'

import { getFingerprint } from '@marketplace-web/session-management/audit-util'
import { useDataDomeCaptcha } from '@marketplace-web/bot-detection/data-dome-feature'
import { ResponseError } from '@marketplace-web/core-api/api-client-util'
import {
  AuthenticateGrantType,
  CodeLoginUserArgs,
  authenticateUser,
} from '@marketplace-web/authentication/authentication-data'
import { navigateToPage } from '@marketplace-web/browser/browser-navigation-util'
import { useTracking } from '@marketplace-web/observability/event-tracker-data'
import { useTranslate } from '@marketplace-web/i18n/i18n-feature'
import { useSession } from '@marketplace-web/shared/session-data'
import { Notification } from '@marketplace-web/common-components/notification-ui'
import {
  renderValidation,
  useFormValidationMessage,
} from '@marketplace-web/vendor-abstractions/react-hook-form-feature'
import { toUrlQuery } from '@marketplace-web/browser/url-util'

import { HelpCenterFaqEntryUrl } from '@marketplace-web/help-center/help-center-faq-entry-url-feature'
import {
  AccessChannel,
  FaqEntryType,
} from '@marketplace-web/help-center/help-center-faq-entry-url-data'
import {
  resendLoginTwoFactorCode,
  VerificationType,
  VerificationChannel,
  viewVerificationScreenEvent,
  clickVerifyEvent,
  clickResendVerification,
  clickGetHelpVerificationEvent,
  resendTwoFactorCode,
  resendTwoFactorVerifierCode,
  sendTwoFactorCode,
  verifyPhoneNumber,
  TwoFactorResendResp,
} from '@marketplace-web/verification/verification-data'
import { useAbTest, useTrackAbTest } from '@marketplace-web/feature-flags/ab-tests-data'
import { useIncogniaTracking } from '@marketplace-web/bot-detection/incognia-feature'

import { ROOT_URL } from '../../constants/routes'
import { use2FAFormTracking } from '../../hooks/use2FAFormTracking'

const CODE_LENGTH = 4
const RESEND_TIMER_INTERVAL = 1000

type Props = {
  twoFAId: number
  maskedNumber?: string
  redirectUrl?: string
  refUrl?: string
  verificationType: VerificationType
  controlCode?: string
  nextResendAvailableIn: number
  showResend: boolean
  maskedInfo?: string
  onCodeSent?: () => void
  isVerifierEnabled?: boolean
  faqEntryType?: FaqEntryType
  // TODO: remove when non_native_flow AB test is scaled
  isAuthPage?: boolean
  channel?: VerificationChannel
  trackTaskId?: string
}

type FormData = {
  code: string
}

const TwoFactorVerification = ({
  verificationType,
  controlCode,
  showResend,
  nextResendAvailableIn: defaultResendAvailableIn,
  maskedInfo,
  maskedNumber,
  twoFAId,
  onCodeSent,
  refUrl,
  redirectUrl,
  isVerifierEnabled,
  faqEntryType = FaqEntryType.SmsVerfication,
  isAuthPage,
  channel = VerificationChannel.Phone,
  trackTaskId,
}: Props) => {
  const translate = useTranslate('user.two_factor_verification')
  const { track } = useTracking()
  const userId = useSession().user?.id
  const {
    register,
    handleSubmit,
    getValues,
    setError,
    setFocus,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormData>()
  const [nextResendAvailableIn, setNextResendAvailableIn] = useState(defaultResendAvailableIn)
  const [isResendVisible, setIsResendVisible] = useState(showResend)
  const [isResendNotificationVisible, setIsResendNotificationVisible] = useState(false)
  const [isTrustedDevice, setIsTrustedDevice] = useState(true)
  const { trackFormSubmitSuccess, trackFormSubmitFailure, trackFaqClick, trackResendClick } =
    use2FAFormTracking(trackTaskId)
  const resendCounterTimeout = useRef<ReturnType<typeof setInterval> | null>(null)
  const twoFactorVerificationAutoFocusAbTest = useAbTest('auto_focus_enter_code_field_2fa_v2')
  const isTwoFactorVerificationAutoFocusAbTestEnabled =
    twoFactorVerificationAutoFocusAbTest?.variant === 'on'
  const submitButtonDiabaleAbTest = useAbTest('disable_verify_cta_2fa_v2')
  const isSubmitButtonDisabledAbTestEnabled = submitButtonDiabaleAbTest?.variant === 'on'
  const twoFACode = useWatch({ control, name: 'code' })

  const { trackIncogniaEvent } = useIncogniaTracking()

  const getErrorMessage = useFormValidationMessage(errors)
  const screen =
    verificationType === VerificationType.Phone
      ? 'verification_prompt_phone_check'
      : 'two_factor_authentication'

  const trackingParams = useMemo(
    () => ({
      userTwoFactorAuthId: twoFAId ? twoFAId.toString() : controlCode,
      type: channel,
      source: verificationType === VerificationType.Phone ? 'verification' : '2FA',
    }),
    [twoFAId, verificationType, channel, controlCode],
  )

  useTrackAbTest(twoFactorVerificationAutoFocusAbTest)
  useTrackAbTest(submitButtonDiabaleAbTest)

  useEffect(() => {
    track(viewVerificationScreenEvent(trackingParams))
  }, [track, screen, trackingParams])

  useEffect(() => {
    if (!isTwoFactorVerificationAutoFocusAbTestEnabled) return

    setFocus('code')
  }, [setFocus, isTwoFactorVerificationAutoFocusAbTestEnabled])

  const initResendCounter = useCallback(() => {
    resendCounterTimeout.current = setInterval(() => {
      setNextResendAvailableIn(prevState => prevState - 1)
    }, RESEND_TIMER_INTERVAL)
  }, [])

  useEffect(() => {
    if (!resendCounterTimeout.current) return

    if (nextResendAvailableIn <= 0) {
      clearInterval(resendCounterTimeout.current)
    }
  }, [nextResendAvailableIn])

  useEffect(() => {
    initResendCounter()

    return () => {
      if (!resendCounterTimeout.current) return

      clearInterval(resendCounterTimeout.current)
    }
  }, [initResendCounter])

  const onResendClick = async () => {
    track(clickResendVerification(trackingParams))
    trackResendClick()

    try {
      let resendResponse: TwoFactorResendResp | ResponseError
      const code = getValues('code')

      switch (verificationType) {
        case VerificationType.Login:
          if (!controlCode) return

          if (isVerifierEnabled) {
            resendResponse = await resendTwoFactorVerifierCode(controlCode)

            return
          }

          resendResponse = await resendLoginTwoFactorCode({
            controlCode,
            code,
            fingerprint: await getFingerprint(),
          })
          break
        default:
          if (!userId) return

          resendResponse = await resendTwoFactorCode({
            userId,
            id: twoFAId,
            code,
            fingerprint: await getFingerprint(),
          })
      }

      if ('errors' in resendResponse) {
        throw Error(resendResponse.errors.toString() || 'Error while resending')
      }

      setNextResendAvailableIn(resendResponse.next_resend_available_in)
      setIsResendVisible(resendResponse.show_resend_option)
      initResendCounter()
    } catch (exception) {
      setIsResendVisible(false)
      setIsResendNotificationVisible(true)
    }
  }

  const handleCodeSentAction = () => {
    switch (verificationType) {
      case VerificationType.BankAccount:
        if (refUrl && redirectUrl) {
          navigateToPage(`${refUrl}?${toUrlQuery({ ref_url: redirectUrl })}`)
        }
        break
      case VerificationType.Checkout:
      case VerificationType.EntityHash:
        onCodeSent?.()
        break
      default:
        break
    }
  }

  const setVerificationError = (message: string) => {
    setError('code', { type: 'manual', message })
  }

  const sendCode = async ({ code }: FormData) => {
    track(clickVerifyEvent(trackingParams))

    try {
      switch (verificationType) {
        case VerificationType.Login: {
          if (!controlCode) return

          const authenticateUserParams: CodeLoginUserArgs = {
            grantType: AuthenticateGrantType.Password,
            controlCode,
            verificationCode: code,
            passwordType: 'two_factor_challenge_code',
            isTrustedDevice,
            fingerprint: await getFingerprint(),
          }

          const response = await authenticateUser(authenticateUserParams)

          await trackIncogniaEvent({ tag: 'login' }, { response })

          // TODO: update error handling when refactoring
          if ('errors' in response) {
            setVerificationError(response.message || '')
            trackFormSubmitFailure()

            return
          }

          trackFormSubmitSuccess()
          navigateToPage(refUrl || ROOT_URL)
          break
        }
        case VerificationType.BankAccount:
        case VerificationType.Checkout:
        case VerificationType.EntityHash: {
          if (!userId) return

          const sendTwoFactorCodeResponse = await sendTwoFactorCode({
            userId,
            id: twoFAId,
            code,
            fingerprint: await getFingerprint(),
          })

          await trackIncogniaEvent(
            { tag: '2fa-verification' },
            { response: sendTwoFactorCodeResponse },
          )

          if ('errors' in sendTwoFactorCodeResponse) {
            const error = sendTwoFactorCodeResponse.errors[0]!

            setVerificationError(error.value)
            trackFormSubmitFailure()

            return
          }

          handleCodeSentAction()
          trackFormSubmitSuccess()

          break
        }
        case VerificationType.Phone: {
          if (!userId || !maskedNumber) return

          const verifyPhoneNumberResponse = await verifyPhoneNumber({
            userId,
            code,
            phoneNumber: maskedNumber,
            fingerprint: await getFingerprint(),
          })

          await trackIncogniaEvent(
            { tag: 'phone-verification' },
            { response: verifyPhoneNumberResponse },
          )

          if ('errors' in verifyPhoneNumberResponse) {
            const error = verifyPhoneNumberResponse.errors[0]!

            setVerificationError(error.value)
            trackFormSubmitFailure()

            return
          }

          trackFormSubmitSuccess()

          if (refUrl) navigateToPage(refUrl)
          break
        }
        default:
          break
      }
    } catch (error) {
      setVerificationError(
        error.response?.data.errors &&
          error.response.data.errors.length &&
          error.response.data.errors[0],
      )
    }
  }

  useDataDomeCaptcha(() => {
    handleSubmit(sendCode)()
  })

  const handleTrustedDeviceChange = () => {
    setIsTrustedDevice(prevIsTrusted => !prevIsTrusted)
  }

  const handleFaqClick = () => {
    trackFaqClick()
    track(clickGetHelpVerificationEvent(trackingParams))
  }

  const handleCodeChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    const { value } = target

    if (!isSubmitButtonDisabledAbTestEnabled) return

    if (value.length > CODE_LENGTH) {
      setValue('code', value.slice(0, CODE_LENGTH))
    }
  }

  const renderHeader = () => (
    <Cell
      body={
        <>
          <Text
            as="h1"
            text={translate('title')}
            type="heading"
            alignment={isAuthPage ? 'left' : 'center'}
            width="parent"
          />
          <Spacer size="large" />
          <span className="u-text-wrap">
            {translate('body', {
              phone_number: (
                <Text
                  key="phone-number"
                  as="span"
                  text={maskedInfo || maskedNumber}
                  bold
                  theme="amplified"
                />
              ),
            })}
          </span>
        </>
      }
    />
  )

  const renderVerificationCodeInput = () => {
    return (
      <InputText
        {...register('code', {
          onChange: handleCodeChange,
        })}
        type="number"
        validation={renderValidation(getErrorMessage('code'))}
        placeholder={translate('placeholder')}
        testId="verification-code"
        autoComplete="off"
      />
    )
  }

  const renderSendButton = () => {
    const codeLength = twoFACode?.length || 0
    const isDisabled = isSubmitButtonDisabledAbTestEnabled && codeLength < CODE_LENGTH

    return (
      <Cell>
        <Button
          styling="filled"
          text={translate('continue')}
          type="submit"
          isLoading={isSubmitting}
          testId="verify-button"
          disabled={isDisabled || isSubmitting}
        />
      </Cell>
    )
  }

  const renderTrustedDeviceCheckbox = () => {
    if (verificationType !== VerificationType.Login) return null

    return (
      <>
        <Cell
          title={translate('trusted_device.title')}
          body={translate('trusted_device.body')}
          suffix={
            <Checkbox
              testId="is-trusted-device"
              name="isTrustedDevice"
              checked={isTrustedDevice}
              onChange={handleTrustedDeviceChange}
            />
          }
        />
        <Divider />
      </>
    )
  }

  const renderForm = () => (
    <form onSubmit={handleSubmit(sendCode)}>
      {renderVerificationCodeInput()}
      {renderTrustedDeviceCheckbox()}
      {renderSendButton()}
    </form>
  )

  const renderFaqButton = (url: string) => (
    <a href={url} target="_blank" rel="noreferrer" onClick={handleFaqClick}>
      {translate('contact_us')}
    </a>
  )

  const renderContactUsLink = () => (
    <HelpCenterFaqEntryUrl
      key="contact-us-link"
      type={faqEntryType}
      accessChannel={AccessChannel.ProductLink}
      render={url => renderFaqButton(url)}
    />
  )

  const renderNote = (text: ReactNode) => <Note styling="narrow" alignment="center" text={text} />

  const renderContactUsNote = () =>
    renderNote(translate('note', { contact_us: renderContactUsLink() }))

  const renderResendButton = () => {
    if (!isResendVisible) return null

    const secondsleft = nextResendAvailableIn.toString().padStart(2, '0')

    return (
      <>
        {renderNote(
          nextResendAvailableIn > 0 ? (
            translate('resend_counter', { seconds_left: secondsleft })
          ) : (
            <Button
              styling="flat"
              size="small"
              inline
              onClick={onResendClick}
              text={translate('resend_link')}
            />
          ),
        )}
      </>
    )
  }

  const renderNotification = () => {
    if (!isResendNotificationVisible) return null

    return <Notification body={translate('resend_error')} />
  }

  return (
    <>
      {renderHeader()}
      {renderForm()}
      {renderResendButton()}
      {renderContactUsNote()}
      {renderNotification()}
    </>
  )
}

export default TwoFactorVerification
