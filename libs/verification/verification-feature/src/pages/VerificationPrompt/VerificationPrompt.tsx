'use client'

import { Fragment, useEffect, useState } from 'react'
import { Button, Spacer, Text, Image } from '@vinted/web-ui'

import {
  useBrowserNavigation,
  navigateToPage,
} from '@marketplace-web/browser/browser-navigation-util'
import { useTranslate } from '@marketplace-web/i18n/i18n-feature'
import { useSession } from '@marketplace-web/shared/session-data'
import { urlWithParams } from '@marketplace-web/browser/url-util'
import { useAsset } from '@marketplace-web/shared/assets'
import {
  VerificationMethods,
  VerificationPromptCategory,
  VerificationPromptModel,
  transformVerificationPromptDto,
  dismissVerificationPrompt,
  getVerificationPrompt,
} from '@marketplace-web/verification/verification-data'
import { useRefUrl } from '@marketplace-web/ref-url/ref-url-feature'
import {
  FlashMessageType,
  setFlashMessage,
} from '@marketplace-web/flash-message/flash-message-feature'
import { useAbTest, useTrackAbTestCallback } from '@marketplace-web/feature-flags/ab-tests-data'
import { HelpCenterFaqEntryUrl } from '@marketplace-web/help-center/help-center-faq-entry-url-feature'

import { FaqEntryType } from '@marketplace-web/help-center/help-center-faq-entry-url-data'

import EmailVerificationCode from '../EmailVerificationCode/EmailVerificationCode'
import GoogleVerification from './GoogleVerification'
import { EMAIL_VERIFICATION_URL, PHONE_VERIFICATION_URL, ROOT_URL } from '../../constants/routes'

const VerificationPrompt = () => {
  const userId = useSession().user?.id
  const translate = useTranslate('verification_prompt')
  const asset = useAsset('/assets/verifications/add-phone-number')
  const [promptDetails, setPromptDetails] = useState<VerificationPromptModel>()
  const [error, setError] = useState<null | string>(null)
  const refUrl = useRefUrl(ROOT_URL)
  const { searchParams } = useBrowserNavigation()
  const updatedPhoneVerificationAbTest = useAbTest('mandatory_phone_verification_modal_update')
  const isUpdatedPhoneVerificationAbTestEnabled = updatedPhoneVerificationAbTest?.variant === 'on'
  const trackAbTest = useTrackAbTestCallback()

  useEffect(() => {
    if (!promptDetails) return

    if (
      promptDetails.methods?.includes(VerificationMethods.Phone) &&
      promptDetails.category !== VerificationPromptCategory.GoodActor
    ) {
      trackAbTest(updatedPhoneVerificationAbTest)
    }
  }, [updatedPhoneVerificationAbTest, trackAbTest, promptDetails])

  useEffect(() => {
    const fetchPromptDetails = async () => {
      if (!userId) return

      const response = await getVerificationPrompt(userId)

      if ('errors' in response) return

      const transformedVerificationPrompt = transformVerificationPromptDto(response.prompt)
      setPromptDetails(transformedVerificationPrompt)
    }

    fetchPromptDetails()
  }, [userId])

  const handleDismissClick = async () => {
    if (!userId) return

    await dismissVerificationPrompt(userId)
    navigateToPage(refUrl)
  }

  const handleGoogleSuccess = () => {
    navigateToPage(refUrl)
  }

  const handleGoogleError = (errorMessage: string) => {
    setError(errorMessage)
  }

  if (!promptDetails) return null

  if (!promptDetails.methods.length) {
    setFlashMessage({ type: FlashMessageType.Success, message: translate('already_verified') })
    navigateToPage(refUrl)

    return null
  }

  const renderPhoneVerificationAction = () => (
    <Button
      text={translate('add_phone_number_button')}
      url={urlWithParams(PHONE_VERIFICATION_URL, searchParams)}
      styling="filled"
    />
  )

  const renderEmailVerificationAction = () => (
    <Button
      text={translate('email_verification_button')}
      url={EMAIL_VERIFICATION_URL}
      styling="filled"
    />
  )

  const renderGoogleVerificationAction = () => (
    <GoogleVerification onSuccess={handleGoogleSuccess} onError={handleGoogleError} />
  )

  const renderVerificationOption = (verificationMethod: VerificationMethods) => {
    switch (verificationMethod) {
      case VerificationMethods.Phone:
        return renderPhoneVerificationAction()
      case VerificationMethods.Google:
        return renderGoogleVerificationAction()
      default:
        return renderEmailVerificationAction()
    }
  }

  const renderError = () => {
    if (!error) return null

    return (
      <>
        <Text as="span" text={error} theme="warning" />
        <Spacer />
      </>
    )
  }

  const renderActions = () => (
    <>
      {promptDetails.methods.map(method => (
        <Fragment key={method}>
          <Spacer size="large" />
          {renderVerificationOption(method)}
        </Fragment>
      ))}
      {!promptDetails.mandatory && (
        <>
          <Spacer size="large" />
          <Button text={translate('dismiss_button')} onClick={handleDismissClick} />
        </>
      )}
      {promptDetails.category === VerificationPromptCategory.GoodActor && (
        <>
          <Spacer size="large" />
          <HelpCenterFaqEntryUrl
            type={FaqEntryType.AddPhoneNumber}
            render={url => (
              <Button
                url={url}
                urlProps={{ target: '_blank', rel: 'noreferrer' }}
                styling="flat"
                text={translate('learn_more')}
              />
            )}
          />
        </>
      )}
    </>
  )

  const renderBody = () => (
    <>
      <Spacer size="x2-large" />
      {renderError()}
      <div className="u-force-wrap">
        <Text as="span" text={promptDetails?.translations.body} html />
      </div>
      <Spacer size="large" />
      {renderActions()}
    </>
  )

  const renderContent = () => {
    const showUpdatedIlustartion =
      isUpdatedPhoneVerificationAbTestEnabled &&
      promptDetails.category !== VerificationPromptCategory.GoodActor

    if (promptDetails.methods.includes(VerificationMethods.EmailCode)) {
      return <EmailVerificationCode />
    }

    return (
      <>
        <Spacer size="x4-large" />
        <div className="u-flexbox u-align-items-center">
          {showUpdatedIlustartion ? (
            <Image
              src={asset('shield-phone-girl.svg')}
              size="x4-large"
              alt={translate('page_title')}
              scaling="contain"
              testId="shield-phone-girl-image"
            />
          ) : (
            <Image
              src={asset('phone-lock.svg')}
              size="x3-large"
              alt={translate('page_title')}
              scaling="contain"
            />
          )}
        </div>
        <Spacer size="x4-large" />
        <Text
          as="h1"
          text={promptDetails.translations.header}
          type="heading"
          alignment="center"
          width="parent"
        />
        {renderBody()}
      </>
    )
  }

  return <div className="auth__container">{renderContent()}</div>
}

export default VerificationPrompt
