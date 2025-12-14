'use client'

import { Divider, Label } from '@vinted/web-ui'

import { useFeatureSwitch } from '@marketplace-web/feature-flags/feature-switches-data'
import { SeparatedList } from '@marketplace-web/common-components/separated-list-ui'
import { useTranslate } from '@marketplace-web/i18n/i18n-feature'

import {
  APP_LANDING_URL,
  BUSINESS_ACCOUNTS_GUIDE_URL,
  BUSINESS_ACCOUNTS_HOMEPAGE,
  HELP_CENTER_URL,
  HOW_IT_WORKS_URL,
  INFOBOARD_URL,
  ITEM_VERIFICATION_URL,
} from '../../../../constants/routes'
import OtherLink from '../OtherLink'

type Props = {
  isBusinessAccountLinksVisible: boolean
}

const Discover = ({ isBusinessAccountLinksVisible }: Props) => {
  const translate = useTranslate('header.main_navigation.about.discover')
  const isItemVerificationPageEnabled = useFeatureSwitch('web_item_verification_page_link')

  return (
    <>
      <Label text={translate('title')} />
      <SeparatedList separator={<Divider />}>
        <OtherLink url={HOW_IT_WORKS_URL} title={translate('items.how_it_works')} />
        {isItemVerificationPageEnabled && (
          <OtherLink url={ITEM_VERIFICATION_URL} title={translate('items.item_verification')} />
        )}
        <OtherLink url={APP_LANDING_URL} title={translate('items.app')} />
        <OtherLink url={HELP_CENTER_URL} title={translate('items.help')} />
        <OtherLink url={INFOBOARD_URL} title={translate('items.infoboard')} />
        {isBusinessAccountLinksVisible && (
          <OtherLink url={BUSINESS_ACCOUNTS_HOMEPAGE} title={translate('items.pro')} />
        )}
        {isBusinessAccountLinksVisible && (
          <OtherLink url={BUSINESS_ACCOUNTS_GUIDE_URL} title={translate('items.pro_guide')} />
        )}
      </SeparatedList>
    </>
  )
}

export default Discover
