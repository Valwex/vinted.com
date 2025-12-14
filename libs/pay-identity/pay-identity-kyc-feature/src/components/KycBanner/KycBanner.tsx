'use client'

import { InfoBanner } from '@vinted/web-ui'

import { useTranslate } from '@marketplace-web/i18n/i18n-feature'
import { useBrowserNavigation } from '@marketplace-web/browser/browser-navigation-util'
import { KycBannerModel } from '@marketplace-web/banners/banners-data'
import { useTracking } from '@marketplace-web/observability/event-tracker-data'
import { walletClickEvent } from '@marketplace-web/pay-identity/pay-identity-kyc-data'

import { PAYMENTS_IDENTITY, GO_TO_WALLET_URL } from '../../constants/routes'

type Props = {
  banner: KycBannerModel | undefined
  bottomSpacer?: React.ReactNode
}

const KycBanner = ({ banner, bottomSpacer }: Props) => {
  const translate = useTranslate('kyc_required_banner')
  const { track } = useTracking()
  const { relativeUrl } = useBrowserNavigation()

  const trackClick = () => {
    track(
      walletClickEvent({
        screen: 'balance',
        target: 'banner',
        target_name: 'kyc_banner',
        target_details: null,
      }),
    )
  }

  if (!banner) return null

  return (
    <div className={`${relativeUrl === GO_TO_WALLET_URL && 'u-ui-margin-large'}`}>
      <InfoBanner
        body={translate('body')}
        styling="tight"
        type="info"
        title={translate('title')}
        actions={[{ text: translate('button'), url: PAYMENTS_IDENTITY, callback: trackClick }]}
        testId="kyc-banner"
      />
      {bottomSpacer}
    </div>
  )
}

export default KycBanner
