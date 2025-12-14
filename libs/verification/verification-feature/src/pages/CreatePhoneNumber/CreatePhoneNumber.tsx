'use client'

import { Validation } from '@vinted/web-ui'
import { useEffect, useState } from 'react'

import { useDataDomeCaptcha } from '@marketplace-web/bot-detection/data-dome-feature'
import {
  VerificationType,
  VerificationTrigger,
} from '@marketplace-web/verification/verification-data'
import {
  useBrowserNavigation,
  navigateToPage,
} from '@marketplace-web/browser/browser-navigation-util'
import { useFeatureSwitch } from '@marketplace-web/feature-flags/feature-switches-data'
import { useTranslate } from '@marketplace-web/i18n/i18n-feature'
import { useSession } from '@marketplace-web/shared/session-data'
import { Notification } from '@marketplace-web/common-components/notification-ui'
import { PhoneNumberDto, createPhoneNumber } from '@marketplace-web/verification/phone-number-data'

import { FaqEntryType } from '@marketplace-web/help-center/help-center-faq-entry-url-data'
import { HttpStatus } from '@marketplace-web/core-api/api-client-util'
import { useRefUrl } from '@marketplace-web/ref-url/ref-url-feature'

import PhoneNumberForm from '../../components/PhoneNumberForm'
import TwoFactorVerification from '../../components/TwoFactorVerification'
import { ROOT_URL, SECURITY_SETTINGS_2FA_URL, SECURITY_SETTINGS_URL } from '../../constants/routes'
import usePhoneNumberFormTracking from '../../hooks/usePhoneNumberFormTracking/usePhoneNumberFormTracking'

const CreatePhoneNumber = () => {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isButtonDisabled, setIsButtonDisabled] = useState(false)
  const [error, setError] = useState<string>()
  const [phoneNumberData, setPhoneNumberData] = useState<PhoneNumberDto>()
  const [isTooManyAttempts, setIsTooManyAttempts] = useState(false)
  const { searchParams } = useBrowserNavigation()
  const isAccountProtectEnabled = useFeatureSwitch('ap_registration_flow')
  const { user } = useSession()

  const isAccountProtectFlow =
    isAccountProtectEnabled && searchParams.trigger === VerificationTrigger.ApRegistration
  const isPhoneNumberValid = user?.verification.phone.valid
  const userId = user?.id
  const { taskId, trackFormSubmitSuccess, trackFormSubmitFailure, trackFaqClick } =
    usePhoneNumberFormTracking()

  const refUrl = useRefUrl(SECURITY_SETTINGS_2FA_URL)

  useEffect(() => {
    if (isPhoneNumberValid) {
      navigateToPage(SECURITY_SETTINGS_URL)
    }
  }, [isPhoneNumberValid])

  const translate = useTranslate('settings.security.create_phone_number')

  const getValidationError = () => error && <Validation text={error} theme="warning" />

  const handleSendClick = async (number: string) => {
    if (!userId) return

    setIsButtonDisabled(true)
    setIsTooManyAttempts(false)
    setPhoneNumber(number)

    const response = await createPhoneNumber(userId, number)

    if (response.status === HttpStatus.TooManyRequests) {
      setIsTooManyAttempts(true)
      trackFormSubmitFailure()

      return
    }
    if ('errors' in response) {
      const validationError = response.errors[0]

      trackFormSubmitFailure()

      if (validationError) setError(validationError.value)
    } else {
      trackFormSubmitSuccess()
      setPhoneNumberData(response.phone_number)
    }

    setIsButtonDisabled(false)
  }

  const resubmitForm = () => {
    handleSendClick(phoneNumber)
  }

  useDataDomeCaptcha(() => resubmitForm())

  const renderCreatePhoneNumberForm = () => (
    <PhoneNumberForm
      isAccountProtectFlow={isAccountProtectFlow}
      onConfirm={handleSendClick}
      onFaqClick={trackFaqClick}
      isButtonDisabled={isButtonDisabled}
      validation={getValidationError()}
    />
  )

  const renderPhoneVerification = () => {
    if (!phoneNumberData) return null

    return (
      <TwoFactorVerification
        maskedNumber={phoneNumberData.number}
        twoFAId={phoneNumberData.two_fa_id}
        verificationType={VerificationType.Phone}
        nextResendAvailableIn={phoneNumberData.next_resend_available_in}
        showResend={phoneNumberData.show_resend_option}
        refUrl={isAccountProtectFlow ? ROOT_URL : refUrl}
        faqEntryType={
          isAccountProtectFlow ? FaqEntryType.AccontProtectPhoneVerificationNotWorking : undefined
        }
        trackTaskId={taskId}
      />
    )
  }

  return (
    <>
      <div className="narrow-container">
        {phoneNumberData ? renderPhoneVerification() : renderCreatePhoneNumberForm()}
      </div>
      {isTooManyAttempts && <Notification body={translate('error')} />}
    </>
  )
}

export default CreatePhoneNumber
