'use client'

import { Button, Image, Spacer, Text } from '@vinted/web-ui'
import { useEffect } from 'react'

import { useTracking } from '@marketplace-web/observability/event-tracker-data'
import { useTranslate } from '@marketplace-web/i18n/i18n-feature'
import { useImageSrcSet } from '@marketplace-web/shared/assets'
import { useRefUrl } from '@marketplace-web/ref-url/ref-url-feature'

import { viewScreenEvent } from '@marketplace-web/verification/verification-data'

import { ROOT_URL } from '../../constants/routes'

const SuccessEmailCodeVerification = () => {
  const refUrl = useRefUrl(ROOT_URL)
  const translate = useTranslate()
  const { track } = useTracking()
  const { src, srcSet } = useImageSrcSet({
    baseName: 'envelope-confetti-200',
    darkMode: false,
    assetBasePath: '/assets/verifications/email-verification-code',
  })

  useEffect(() => {
    track(viewScreenEvent({ screen: 'mand_email_verification_success' }))
  }, [track])

  const renderImage = () => {
    return (
      <div className="u-text-center">
        <Image src={src} srcset={srcSet} alt="" />
      </div>
    )
  }

  const renderTitle = () => {
    return (
      <Text as="h1" type="heading" alignment="center" width="parent">
        {translate('email_verification_code.success.title')}
      </Text>
    )
  }

  const renderDescription = () => {
    return (
      <Text as="span" type="body" alignment="center" width="parent">
        {translate('email_verification_code.success.description')}
      </Text>
    )
  }

  const renderButton = () => {
    return (
      <Button testId="start-button" styling="filled" url={refUrl}>
        {translate('email_verification_code.success.actions.ok')}
      </Button>
    )
  }

  return (
    <div className="auth__container">
      {renderImage()}
      <Spacer size="x-large" />
      {renderTitle()}
      <Spacer size="medium" />
      {renderDescription()}
      <Spacer size="x2-large" />
      {renderButton()}
    </div>
  )
}

export default SuccessEmailCodeVerification
