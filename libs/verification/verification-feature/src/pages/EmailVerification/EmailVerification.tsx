'use client'

import { ChangeEvent, useState } from 'react'
import { Button, Cell, InputText, Spacer, Text, Validation } from '@vinted/web-ui'

import { useSession } from '@marketplace-web/shared/session-data'
import { useRefUrl } from '@marketplace-web/ref-url/ref-url-feature'
import { useTranslate } from '@marketplace-web/i18n/i18n-feature'

import { changeExistingEmail } from '@marketplace-web/verification/verification-data'

import { SECURITY_SETTINGS_URL } from '../../constants/routes'

const EmailVerification = () => {
  const refUrl = useRefUrl(SECURITY_SETTINGS_URL)
  const translate = useTranslate('email_verification')
  const { user } = useSession()
  const userEmail = user?.email
  const userId = user?.id

  const [isVerificationComplete, setIsVerificationComplete] = useState(false)
  const [email, setEmail] = useState(userEmail)
  const [error, setError] = useState<null | string>(null)

  const handleSendClick = async () => {
    if (!userId || !email) return

    const response = await changeExistingEmail({ userId, email })

    if ('errors' in response) {
      setError(response.errors[0]?.value || response.message)

      return
    }

    setIsVerificationComplete(true)
  }

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value)
  }

  const renderValidationMessage = () => {
    if (!error) return null

    return <Validation text={error} theme="warning" />
  }

  return (
    <div className="narrow-container u-margin-auto">
      <Cell>
        <Text as="h1" width="parent" alignment="center" type="heading" text={translate('title')} />
        <Spacer size="x-large" />
        <Text
          as="span"
          text={isVerificationComplete ? translate('waiting_for_confirmation') : translate('body')}
        />
        {!isVerificationComplete && (
          <InputText
            name="email"
            title={translate('input_label')}
            value={email}
            onChange={handleEmailChange}
            validation={renderValidationMessage()}
          />
        )}
        {isVerificationComplete ? (
          <>
            <Spacer size="large" />
            <Button text={translate('actions.done')} styling="filled" url={refUrl} />
          </>
        ) : (
          <Button text={translate('actions.send')} styling="filled" onClick={handleSendClick} />
        )}
      </Cell>
    </div>
  )
}

export default EmailVerification
