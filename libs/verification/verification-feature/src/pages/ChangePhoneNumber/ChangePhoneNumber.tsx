'use client'

import { Button, Cell, InputText, Note, Spacer, Text } from '@vinted/web-ui'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { getFingerprint } from '@marketplace-web/session-management/audit-util'
import { useDataDomeCaptcha } from '@marketplace-web/bot-detection/data-dome-feature'
import { VerificationType, clickEvent } from '@marketplace-web/verification/verification-data'
import { ErrorItem, ResponseError, ResponseCode } from '@marketplace-web/core-api/api-client-util'
import { navigateToPage } from '@marketplace-web/browser/browser-navigation-util'
import { useTranslate } from '@marketplace-web/i18n/i18n-feature'
import { useSession } from '@marketplace-web/shared/session-data'
import { Notification } from '@marketplace-web/common-components/notification-ui'
import {
  renderValidation,
  useFormValidationMessage,
} from '@marketplace-web/vendor-abstractions/react-hook-form-feature'
import {
  COUNTRY_CODE_TO_PHONE_PREFIX_MAP,
  PhoneNumberDto,
  changePhoneNumber,
} from '@marketplace-web/verification/phone-number-data'
import { useAbTest, useTrackAbTest } from '@marketplace-web/feature-flags/ab-tests-data'
import { useRefUrl } from '@marketplace-web/ref-url/ref-url-feature'
import { useTracking } from '@marketplace-web/observability/event-tracker-data'

import { HelpCenterFaqEntryUrl } from '@marketplace-web/help-center/help-center-faq-entry-url-feature'
import { FaqEntryType } from '@marketplace-web/help-center/help-center-faq-entry-url-data'

import TooManyAttemptsModal from './TooManyAttemptsModal'
import TwoFactorVerification from '../../components/TwoFactorVerification'
import { SECURITY_SETTINGS_2FA_URL, SECURITY_SETTINGS_URL } from '../../constants/routes'
import { isValueInObject } from '../../utils/object'
import usePhoneNumberFormTracking from '../../hooks/usePhoneNumberFormTracking/usePhoneNumberFormTracking'

type ModalError = {
  title: string
  text: string
}

enum Field {
  CurrentPhone = 'current_phone',
  NewPhone = 'number',
}

type FormModel = {
  [Field.CurrentPhone]: string
  [Field.NewPhone]: string
}

const ChangePhoneNumber = () => {
  const translate = useTranslate('settings.security.change_phone_number')
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [modalError, setModalError] = useState<ModalError>()
  const [verificationData, setVerificationData] = useState<PhoneNumberDto>()
  const [notificationError, setNotificationError] = useState<string | null>()
  const phoneNumberAutoFocusAbTest = useAbTest('auto_focus_addchange_phone_field_2fa_v2')
  const isPhoneNumberAutoFocusAbTestEnabled = phoneNumberAutoFocusAbTest?.variant === 'on'
  const { user } = useSession()
  const { track } = useTracking()
  const { taskId, trackFaqClick, trackFormSubmitFailure, trackFormSubmitSuccess } =
    usePhoneNumberFormTracking()
  const userId = user?.id
  const refUrl = useRefUrl(SECURITY_SETTINGS_2FA_URL)
  const isPhoneNumberValid = user?.verification.phone.valid
  const phonePrefix = user
    ? COUNTRY_CODE_TO_PHONE_PREFIX_MAP[user.country_code.toLocaleLowerCase()]
    : ''

  const {
    register,
    handleSubmit,
    setError,
    getValues,
    setFocus,
    formState: { isSubmitting, errors },
  } = useForm<FormModel>({ mode: 'onSubmit' })

  useTrackAbTest(phoneNumberAutoFocusAbTest)

  useEffect(() => {
    if (!isPhoneNumberValid) {
      navigateToPage(SECURITY_SETTINGS_URL)
    }
  }, [isPhoneNumberValid])

  useEffect(() => {
    if (!isPhoneNumberAutoFocusAbTestEnabled) return

    setFocus(Field.CurrentPhone)
  }, [setFocus, isPhoneNumberAutoFocusAbTestEnabled])

  const getErrorMessage = useFormValidationMessage(errors)

  const setValidationErrors = (validationErrors: Array<ErrorItem>) => {
    validationErrors.forEach(({ field, value }) => {
      if (!isValueInObject(field, Field)) {
        setError(Field.NewPhone, { type: 'manual', message: value })

        return
      }

      setError(field, { type: 'manual', message: value })
    })
  }

  const formatErrors = (response: ResponseError) => {
    const { payload, errors: responseErrors, code, message } = response

    if (responseErrors.length) {
      setValidationErrors(responseErrors)
    } else if (payload) {
      setIsModalVisible(true)
      setModalError({ text: payload.body, title: payload.title })
    } else if (code === ResponseCode.ServerError) {
      setNotificationError(message)
    }
  }

  const trackClick = (target: Parameters<typeof clickEvent>[0]['target']) => {
    track(
      clickEvent({
        screen: 'phone_change',
        target,
      }),
    )
  }

  const onSubmit = async ({ current_phone, number }: FormModel) => {
    if (!userId) return

    trackClick('submit')

    const response = await changePhoneNumber({
      userId,
      currentNumber: current_phone,
      newNumber: number,
      fingerprint: await getFingerprint(),
    })

    if ('errors' in response) {
      trackFormSubmitFailure()
      formatErrors(response)

      return
    }

    setVerificationData(response.phone_number)
    trackFormSubmitSuccess()
  }

  useDataDomeCaptcha(() => onSubmit(getValues()))

  const closeModal = () => setIsModalVisible(false)

  const handleNotificationClose = () => setNotificationError(null)

  const handleFaqClick = () => {
    trackFaqClick()
    trackClick('help_center_link')
  }

  const renderGetHelpLink = () => (
    <HelpCenterFaqEntryUrl
      key="get-help-link"
      type={FaqEntryType.PhoneChange}
      render={url => (
        <a href={url} onClick={handleFaqClick} target="_blank" rel="noreferrer">
          {translate('get_help')}
        </a>
      )}
    />
  )

  const renderHeader = () => (
    <Text as="h1" width="parent" alignment="center" type="heading" text={translate('title')} />
  )

  const renderForm = () => (
    <form onSubmit={handleSubmit(onSubmit)}>
      <InputText
        {...register(Field.CurrentPhone)}
        title={translate('old_phone_number')}
        validation={renderValidation(getErrorMessage(Field.CurrentPhone))}
        placeholder={phonePrefix}
        testId="old-phone-number"
      />

      <InputText
        {...register(Field.NewPhone)}
        title={translate('new_phone_number')}
        validation={renderValidation(getErrorMessage(Field.NewPhone)) || translate('note')}
        placeholder={phonePrefix}
        testId="new-phone-number"
      />
      <Button type="submit" disabled={isSubmitting} text={translate('button')} styling="filled" />
    </form>
  )

  const renderNote = () => (
    <Note alignment="center" text={translate('help', { get_help_link: renderGetHelpLink() })} />
  )

  const renderChangeForm = () => (
    <>
      <Cell>
        {renderHeader()}
        {renderForm()}
      </Cell>
      <Spacer size="x-large" />
      {renderNote()}
    </>
  )

  const renderTFAForm = () => {
    if (!verificationData) return null

    return (
      <TwoFactorVerification
        maskedNumber={verificationData.number}
        twoFAId={verificationData.two_fa_id}
        verificationType={VerificationType.Phone}
        nextResendAvailableIn={verificationData.next_resend_available_in}
        showResend={verificationData.show_resend_option}
        refUrl={refUrl}
        trackTaskId={taskId}
      />
    )
  }

  return (
    <div className="narrow-container">
      {verificationData ? renderTFAForm() : renderChangeForm()}

      <TooManyAttemptsModal
        isOpen={isModalVisible}
        onClose={closeModal}
        title={modalError?.title || ''}
        text={modalError?.text || ''}
      />

      {notificationError && (
        <Notification body={notificationError} onClose={handleNotificationClose} />
      )}
    </div>
  )
}

export default ChangePhoneNumber
