'use client'

import { useFeatureSwitch } from '@marketplace-web/feature-flags/feature-switches-data'
import { useTracking } from '@marketplace-web/observability/event-tracker-data'
import { useTranslate } from '@marketplace-web/i18n/i18n-feature'
import { clickEvent } from '@marketplace-web/catalog/catalog-navigation-data'

import {
  APP_LANDING_URL,
  BUSINESS_ACCOUNTS_GUIDE_URL,
  BUSINESS_ACCOUNTS_HOMEPAGE,
  HELP_CENTER_URL,
  HOW_IT_WORKS_URL,
  INFOBOARD_URL,
  ITEM_VERIFICATION_URL,
} from '../../../../constants/routes'
import LinkCell from '../LinkCell'
import LinksGroup from '../LinksGroup'

type Props = {
  isBusinessAccountLinksVisible: boolean
}

const DiscoverBlock = ({ isBusinessAccountLinksVisible }: Props) => {
  const translate = useTranslate('header.main_navigation.about')
  const { track } = useTracking()

  const isItemVerificationPageEnabled = useFeatureSwitch('web_item_verification_page_link')

  const handleHelpCenterClick = () => {
    track(
      clickEvent({
        target: 'help_center',
        screen: 'about_menu',
      }),
    )
  }

  return (
    <LinksGroup title={translate('discover.title')}>
      <LinkCell title={translate('discover.items.how_it_works')} url={HOW_IT_WORKS_URL} />
      {isItemVerificationPageEnabled && (
        <LinkCell
          title={translate('discover.items.item_verification')}
          url={ITEM_VERIFICATION_URL}
        />
      )}
      <LinkCell title={translate('discover.items.app')} url={APP_LANDING_URL} />
      <LinkCell
        title={translate('discover.items.help')}
        url={HELP_CENTER_URL}
        onClick={handleHelpCenterClick}
      />
      <LinkCell title={translate('discover.items.infoboard')} url={INFOBOARD_URL} />
      {isBusinessAccountLinksVisible && (
        <>
          <LinkCell
            title={translate('discover.items.pro')}
            url={BUSINESS_ACCOUNTS_HOMEPAGE}
            testId="about-panel-vinted-pro-link"
          />
          <LinkCell
            title={translate('discover.items.pro_guide')}
            url={BUSINESS_ACCOUNTS_GUIDE_URL}
            testId="about-panel-vinted-pro-guide-link"
          />
        </>
      )}
    </LinksGroup>
  )
}

export default DiscoverBlock
