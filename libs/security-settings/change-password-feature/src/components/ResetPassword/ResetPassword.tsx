'use client'

import { Button, InfoBanner, InputText, Spacer, Text, Validation } from '@vinted/web-ui'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { useDataDomeCaptcha } from '@marketplace-web/bot-detection/data-dome-feature'
import { useTranslate } from '@marketplace-web/i18n/i18n-feature'
import { useFormValidationMessage } from '@marketplace-web/vendor-abstractions/react-hook-form-feature'
import { resetPassword, clickEvent } from '@marketplace-web/security-settings/change-password-data'
import { useBrowserNavigation } from '@marketplace-web/browser/browser-navigation-util'
import { urlWithParams } from '@marketplace-web/browser/url-util'
import { useTracking } from '@marketplace-web/observability/event-tracker-data'

import { LOGIN_EMAIL } from '../../constants/routes'

type FormData = {
  email: string
}

const TRANSLATION_PREFIX = 'auth.forgot_password'

type Props = {
  // TODO: remove when non_native_flow AB test is scaled
  isAuthPage?: boolean
}

const ResetPassword = ({ isAuthPage }: Props) => {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { isSubmitting, errors },
  } = useForm<FormData>()
  const translate = useTranslate(TRANSLATION_PREFIX)
  const getErrorMessage = useFormValidationMessage(errors, `${TRANSLATION_PREFIX}.fields`)
  const { track } = useTracking()
  const emailErrorMessage = getErrorMessage('email')

  const { searchParams } = useBrowserNavigation()

  const [showSuccess, setShowSuccess] = useState(false)

  async function handleFormSubmit({ email }: FormData) {
    track(
      clickEvent({
        screen: 'password_change',
        target: 'submit',
      }),
    )

    await resetPassword({ email })

    setShowSuccess(true)
  }

  useDataDomeCaptcha(() => {
    handleFormSubmit(getValues())
  })

  const renderReturnToLoginButton = () => {
    if (!isAuthPage) return null

    return (
      <>
        <Spacer size="large" />
        <Button
          text={translate('actions.return_to_login')}
          type="button"
          styling="flat"
          url={urlWithParams(LOGIN_EMAIL, searchParams)}
        />
      </>
    )
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <div className="u-ui-padding-horizontal-large">
        <Text
          as="h1"
          id="auth_modal_title"
          text={translate('title')}
          type="heading"
          width="parent"
          alignment={isAuthPage ? 'left' : 'center'}
        />
      </div>
      <Spacer size="large" />
      {showSuccess && (
        <InfoBanner
          testId="reset-password-success-note"
          body={translate('success_note')}
          type="success"
        />
      )}
      <Spacer />
      <InputText
        {...register('email', {
          required: true,
        })}
        placeholder={translate('fields.email.title')}
        validation={emailErrorMessage && <Validation text={emailErrorMessage} theme="warning" />}
      />
      <div className="u-ui-padding-horizontal-large u-ui-padding-bottom-x-large">
        <Spacer size={isAuthPage ? 'x-large' : 'large'} />
        <Button
          text={translate('actions.submit')}
          type="submit"
          styling="filled"
          disabled={isSubmitting}
          isLoading={isSubmitting}
          onClick={(event: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
            if (isSubmitting) {
              event.preventDefault()
            }
          }}
        />
        {renderReturnToLoginButton()}
      </div>
    </form>
  )
}

export default ResetPassword
