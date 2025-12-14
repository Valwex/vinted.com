'use client'

import { InfoBanner } from '@vinted/web-ui'

import { useAbTest, useTrackAbTest } from '@marketplace-web/feature-flags/ab-tests-data'
import { useTranslate } from '@marketplace-web/i18n/i18n-feature'
import { useSession } from '@marketplace-web/shared/session-data'
import { urlWithParams } from '@marketplace-web/browser/url-util'
import { useBrowserNavigation } from '@marketplace-web/browser/browser-navigation-util'

import { PHONE_VERIFICATION_URL } from '../../constants/routes'

const PhoneNumberInfoBanner = () => {
  const translate = useTranslate('settings.phone_number_info_banner')
  const phoneNumberInfoBannerAbtest = useAbTest(
    'promotion_campaign_voluntary_phone_verification_adoption',
  )
  const isPhoneNumberInfoBannerAbtestEnabled = phoneNumberInfoBannerAbtest?.variant === 'on'
  const isPhoneNumberVerified = useSession().user?.verification.phone.valid
  const { relativeUrl } = useBrowserNavigation()
  const redirectUrl = urlWithParams(PHONE_VERIFICATION_URL, {
    ref_url: relativeUrl,
  })

  useTrackAbTest(phoneNumberInfoBannerAbtest, !isPhoneNumberVerified)

  if (!isPhoneNumberInfoBannerAbtestEnabled || isPhoneNumberVerified) return null

  return (
    <div className="u-padding-top-large u-padding-left-large u-padding-right-large">
      <InfoBanner
        title={translate('title')}
        body={translate('body')}
        type="info"
        testId="phone-number-info-banner"
        styling="tight"
        actions={[
          {
            text: translate('actions.add_phone_number'),
            url: redirectUrl,
          },
        ]}
      />
    </div>
  )
}

export default PhoneNumberInfoBanner
