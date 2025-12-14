'use client'

import { ChangeEvent, ReactNode, useEffect, useRef, useState } from 'react'
import { Button, Cell, InputText, Spacer, Text } from '@vinted/web-ui'

import { useTranslate } from '@marketplace-web/i18n/i18n-feature'
import { useSession } from '@marketplace-web/shared/session-data'
import { COUNTRY_CODE_TO_PHONE_PREFIX_MAP } from '@marketplace-web/verification/phone-number-data'
import { useAbTest, useTrackAbTest } from '@marketplace-web/feature-flags/ab-tests-data'

import { HelpCenterFaqEntryUrl } from '@marketplace-web/help-center/help-center-faq-entry-url-feature'
import { FaqEntryType } from '@marketplace-web/help-center/help-center-faq-entry-url-data'

import PhoneNumberInputWithPrefix from '../PhoneNumberInputWithPrefix/PhoneNumberInputWithPrefix'

type Props = {
  onConfirm: (phoneNumber: string) => void
  isButtonDisabled?: boolean
  validation?: ReactNode
  isAccountProtectFlow: boolean
  onFaqClick?: () => void
}

const PhoneNumberForm = ({
  onConfirm,
  validation,
  isButtonDisabled,
  isAccountProtectFlow,
  onFaqClick,
}: Props) => {
  const translate = useTranslate('settings.security.create_phone_number')
  const { user } = useSession()
  const [phoneNumber, setPhoneNumber] = useState('')
  const phonePrefix = user
    ? COUNTRY_CODE_TO_PHONE_PREFIX_MAP[user.country_code.toLocaleLowerCase()]
    : ''
  const inputRef = useRef<HTMLInputElement>(null)
  const phoneNumberAutoFocusAbTest = useAbTest('auto_focus_addchange_phone_field_2fa_v2')
  const isPhoneNumberAutoFocusAbTestEnabled = phoneNumberAutoFocusAbTest?.variant === 'on'
  useTrackAbTest(phoneNumberAutoFocusAbTest)

  const phoneNumberPrefixAbTest = useAbTest('phone_prefix_selection_tab')
  const isPhoneNumberSelectPrefixAbTestEnabled = phoneNumberPrefixAbTest?.variant === 'on'

  useTrackAbTest(phoneNumberPrefixAbTest)

  useEffect(() => {
    if (!isPhoneNumberAutoFocusAbTestEnabled || !inputRef.current) return

    inputRef.current.focus()
  }, [isPhoneNumberAutoFocusAbTestEnabled])

  const handlePhoneChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(event.target.value)
  }

  const handlePhoneWithPrefixChange = (fullPhoneNumber: string) => {
    setPhoneNumber(fullPhoneNumber)
  }

  const handleConfirmClick = () => {
    onConfirm(phoneNumber)
  }

  const handleFaqClick = () => {
    onFaqClick?.()
  }

  const renderFaqLink = () => (
    <HelpCenterFaqEntryUrl
      key="faq-link"
      type={
        isAccountProtectFlow
          ? FaqEntryType.AccontProtectPhoneVerificationNotWorking
          : FaqEntryType.AddPhoneNumber
      }
      render={url => (
        <a href={url} target="_blank" rel="noreferrer" onClick={handleFaqClick}>
          {translate('help.link')}
        </a>
      )}
    />
  )

  const renderHelpText = () => {
    return (
      <>
        <Spacer size="x-large" />
        <Text
          as="span"
          text={translate('help.text', { help_link: renderFaqLink() })}
          alignment="center"
          width="parent"
          html
        />
      </>
    )
  }

  return (
    <Cell>
      <Text as="h1" width="parent" alignment="center" type="heading" text={translate('title')} />
      <Spacer size="x-large" />
      <Text as="span" width="parent" text={translate('body')} />
      {isPhoneNumberSelectPrefixAbTestEnabled ? (
        <PhoneNumberInputWithPrefix
          onChange={handlePhoneWithPrefixChange}
          validation={validation}
        />
      ) : (
        <InputText
          title={translate('input.label')}
          placeholder={phonePrefix}
          name="number"
          value={phoneNumber ?? ''}
          onChange={handlePhoneChange}
          validation={validation}
          testId="phone-number-input"
          ref={inputRef}
        />
      )}
      <Button
        disabled={isButtonDisabled}
        text={translate('actions.send')}
        styling="filled"
        onClick={handleConfirmClick}
        testId="submit-button"
      />
      {renderHelpText()}
    </Cell>
  )
}

export default PhoneNumberForm
