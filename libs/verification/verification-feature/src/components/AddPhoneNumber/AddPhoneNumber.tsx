'use client'

import { useState } from 'react'
import { Button, Image, Spacer, Text, Cell, Validation } from '@vinted/web-ui'

import { useTranslate } from '@marketplace-web/i18n/i18n-feature'
import { useSession } from '@marketplace-web/shared/session-data'
import { getFingerprint } from '@marketplace-web/session-management/audit-util'
import { useAsset } from '@marketplace-web/shared/assets'
import {
  transformTwoFactorVerification,
  VerificationType,
  createUser2FA,
  TwoFactorVerificationModel,
} from '@marketplace-web/verification/verification-data'

import { HelpCenterFaqEntryUrl } from '@marketplace-web/help-center/help-center-faq-entry-url-feature'
import { FaqEntryType } from '@marketplace-web/help-center/help-center-faq-entry-url-data'

import PhoneNumberForm from '../PhoneNumberForm'

type Props = {
  entityId: string
  onConfirm: (params: TwoFactorVerificationModel) => void
}

const AddPhoneNumber = ({ entityId, onConfirm }: Props) => {
  const asset = useAsset('/assets/verifications/add-phone-number')
  const translate = useTranslate('user.two_factor_verification.add_phone_number')
  const userId = useSession().user?.id

  const [isPhoneNumberFormVisible, setIsPhoneNumberFormVisible] = useState(false)
  const [error, setError] = useState<string>()

  const getValidationError = () => error && <Validation text={error} theme="warning" />

  const handleAddPhoneNumberClick = () => {
    setIsPhoneNumberFormVisible(true)
  }

  const handlePhoneConfirm = async (phoneNumber: string) => {
    if (!userId) return

    const response = await createUser2FA({
      userId,
      entityId,
      number: phoneNumber,
      fingerprint: await getFingerprint(),
      entityType: VerificationType.EntityHash,
    })

    if ('errors' in response) {
      const validationError = response.errors[0]

      setError(validationError?.value)

      return
    }

    onConfirm(transformTwoFactorVerification(response))
  }

  const renderFaqLink = () => (
    <HelpCenterFaqEntryUrl
      type={FaqEntryType.AddPhoneNumber}
      render={url => (
        <Button text={translate('actions.faq')} url={url} urlProps={{ target: '_blank' }} />
      )}
    />
  )

  if (isPhoneNumberFormVisible) {
    return (
      <PhoneNumberForm
        onConfirm={handlePhoneConfirm}
        isAccountProtectFlow={false}
        validation={getValidationError()}
      />
    )
  }

  return (
    <Cell>
      <Spacer size="x4-large" />
      <div className="u-flexbox u-align-items-center">
        <Image
          src={asset('phone-lock.svg', { theme: { dark: 'dark/phone-lock.svg' } })}
          size="x3-large"
          alt={translate('title')}
          scaling="contain"
        />
      </div>
      <Spacer size="x4-large" />
      <Text text={translate('title')} type="heading-xl" as="h1" alignment="center" width="parent" />
      <Spacer size="large" />
      <Text text={translate('body')} as="p" />
      <Spacer size="x2-large" />
      <Button
        text={translate('actions.add_phone')}
        onClick={handleAddPhoneNumberClick}
        styling="filled"
      />
      <Spacer size="large" />
      {renderFaqLink()}
    </Cell>
  )
}

export default AddPhoneNumber
