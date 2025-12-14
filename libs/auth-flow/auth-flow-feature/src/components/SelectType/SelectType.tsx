'use client'

import { useEffect, useState } from 'react'
import { Divider, Spacer, Text } from '@vinted/web-ui'

import {
  FormName,
  GoogleTagManagerEvent,
  PageType,
  useGoogleTagManagerTrack,
} from '@marketplace-web/google-track/google-track-feature'
import { useBrowserNavigation } from '@marketplace-web/browser/browser-navigation-util'
import { useFeatureSwitch } from '@marketplace-web/feature-flags/feature-switches-data'
import { useUserAgent } from '@marketplace-web/environment/request-context-data'
import { SeparatedList } from '@marketplace-web/common-components/separated-list-ui'
import { ContentLoader } from '@marketplace-web/common-components/content-loader-ui'

import {
  getReferrer,
  ReferrerModel,
  transformReferrerDto,
} from '@marketplace-web/referrals/referrals-data'
import { useSession } from '@marketplace-web/shared/session-data'
import { useTranslate } from '@marketplace-web/i18n/i18n-feature'
import { useAuthenticationContext, AuthView } from '@marketplace-web/auth-flow/auth-context-feature'
import {
  Facebook,
  Google,
  Apple,
} from '@marketplace-web/authentication/socials-authentication-feature'
import { RandomUserSignup } from '@marketplace-web/registration/registration-feature'

import BusinessRegistrationLink from './BusinessRegistrationsLink'
import SelectTypeFooter from './SelectTypeFooter'
import SelectTypeHeader from './SelectTypeHeader'
import { isIOS, parseOS } from '../../utils/device'

const SelectType = () => {
  const isRandomUserSignupEnabled = useFeatureSwitch('next_random_user_signup')
  const { authView, isAuthPage } = useAuthenticationContext()
  const isRegisterView = authView === AuthView.SelectTypeRegister
  const { googleAnalyticsTrack } = useGoogleTagManagerTrack()
  const { isWebview } = useSession()
  const translate = useTranslate('auth.select_type')

  const { s: registrationType } = useBrowserNavigation().searchParams
  const userAgent = useUserAgent()
  const isAppleDevice = isIOS(userAgent) || parseOS(userAgent) === 'MacOS'

  const [error, setError] = useState<string>()
  const [hasReferralError, setHasReferralError] = useState(false)
  const [referrer, setReferrer] = useState<ReferrerModel>()

  useEffect(() => {
    function pushGoogleAnalyticsEvent() {
      if (isRegisterView) {
        googleAnalyticsTrack({
          event: GoogleTagManagerEvent.modalView,
          customTagObject: { formName: FormName.Register, pageType: PageType.Registration },
        })
      } else {
        googleAnalyticsTrack({
          event: GoogleTagManagerEvent.modalView,
          customTagObject: { formName: FormName.Login, pageType: PageType.Login },
        })
      }
    }

    pushGoogleAnalyticsEvent()
  }, [isRegisterView, googleAnalyticsTrack])

  const shouldFetchReferrer = isRegisterView && !referrer && registrationType === 'referral'

  useEffect(() => {
    if (!shouldFetchReferrer) return

    const fetchReferrer = async () => {
      const response = await getReferrer()

      if ('errors' in response || !response.referrer_id) {
        setHasReferralError(true)

        return
      }

      setReferrer(transformReferrerDto(response))
    }

    fetchReferrer()
  }, [shouldFetchReferrer])

  if (!hasReferralError && shouldFetchReferrer) {
    return (
      <ContentLoader
        styling={ContentLoader.Styling.Wide}
        size={ContentLoader.Size.Large}
        testId="select-type-loader"
      />
    )
  }

  const renderDivider = () => {
    if (!isWebview) return null

    return (
      <>
        <Spacer />
        <div className="u-flexbox u-flex-direction-row u-align-items-center u-gap-large">
          <Divider />
          <Text
            as="span"
            text={translate('divider.or')}
            type="subtitle"
            alignment="center"
            theme="muted"
          />
          <Divider />
        </div>
        <Spacer />
      </>
    )
  }

  const renderSocialRegisterSubheadline = () => {
    if (!isWebview || !isRegisterView) return null

    return (
      <>
        <Spacer size="small" />
        <Text
          as="h2"
          text={translate(
            isAppleDevice ? 'register.subheadline_apple' : 'register.subheadline_google',
          )}
          type="subtitle"
          alignment="center"
          width="parent"
        />
        <Spacer />
      </>
    )
  }

  const renderSocialLogins = () => {
    if (isAppleDevice) {
      return (
        <SeparatedList separator={<Spacer size={isAuthPage ? 'large' : 'regular'} />}>
          <Apple setError={setError} />
          {renderDivider()}
          <Google setError={setError} />
          <Facebook setError={setError} />
          {isRandomUserSignupEnabled && isRegisterView && <RandomUserSignup />}
        </SeparatedList>
      )
    }

    return (
      <SeparatedList separator={<Spacer size={isAuthPage ? 'large' : 'regular'} />}>
        <Google setError={setError} />
        {renderDivider()}
        {!isWebview && <Apple setError={setError} />}
        <Facebook setError={setError} />
        {isRandomUserSignupEnabled && isRegisterView && <RandomUserSignup />}
      </SeparatedList>
    )
  }

  return (
    <>
      <div className="u-ui-padding-horizontal-large u-ui-padding-bottom-x-large">
        <SelectTypeHeader referrer={referrer} />
        <Spacer />
        {error && (
          <Text as="span" text={error} theme="warning" width="parent" alignment="center" html />
        )}
        {renderSocialRegisterSubheadline()}
        <Spacer size="large" />
        {renderSocialLogins()}
        <Spacer size={isAuthPage ? 'large' : 'x-large'} />
        <SelectTypeFooter />
      </div>
      {isRegisterView && <BusinessRegistrationLink />}
    </>
  )
}

export default SelectType
