'use client'

import { Divider, Label } from '@vinted/web-ui'

import { useFeatureSwitch } from '@marketplace-web/feature-flags/feature-switches-data'
import { SeparatedList } from '@marketplace-web/common-components/separated-list-ui'
import { PRIVACY_CENTER_URL } from '@marketplace-web/user-agreements/privacy-center-data'
import { useTranslate } from '@marketplace-web/i18n/i18n-feature'

import {
  BUSINESS_TERMS_AND_CONDITIONS_URL,
  BUSINESS_TERMS_OF_SALE_URL,
  BUSINESS_TERMS_URL,
  COOKIE_POLICY_URL,
  HELP_SAFETY_URL,
  PRIVACY_POLICY_URL,
  TERMS_URL,
} from '../../../../constants/routes'
import OtherLink from '../OtherLink'

type Props = {
  impressumUrl: string | null
  isBusinessAccountLinksVisible: boolean
}

const Policies = ({ impressumUrl, isBusinessAccountLinksVisible }: Props) => {
  const translate = useTranslate('header.main_navigation.about.policies')

  const isProTermsAndConditionsFSEnabled = useFeatureSwitch('pro_terms_and_conditions_enabled')
  const isPrivacyUpdateFSEnabled = useFeatureSwitch('privacy_policy_update')

  const privacyTitleKey = isPrivacyUpdateFSEnabled ? 'items.privacy_center' : 'items.privacy_policy'
  const privacyUrl = isPrivacyUpdateFSEnabled ? PRIVACY_CENTER_URL : PRIVACY_POLICY_URL

  const renderBusinessAccountLinks = () => {
    if (!isBusinessAccountLinksVisible) return null

    if (isProTermsAndConditionsFSEnabled) {
      return (
        <OtherLink
          title={translate('items.pro_terms_and_conditions')}
          url={BUSINESS_TERMS_AND_CONDITIONS_URL}
        />
      )
    }

    return (
      <>
        <OtherLink title={translate('items.pro_terms_of_sale')} url={BUSINESS_TERMS_OF_SALE_URL} />
        <OtherLink title={translate('items.pro_terms_of_use')} url={BUSINESS_TERMS_URL} />
      </>
    )
  }

  return (
    <>
      <Label text={translate('title')} />
      <SeparatedList separator={<Divider />}>
        <OtherLink title={translate('items.safety')} url={HELP_SAFETY_URL} />
        {impressumUrl && <OtherLink title={translate('items.impressum')} url={impressumUrl} />}
        <OtherLink title={translate(privacyTitleKey)} url={privacyUrl} />
        <OtherLink title={translate('items.terms_and_conditions')} url={TERMS_URL} />
        <OtherLink title={translate('items.cookie_policy')} url={COOKIE_POLICY_URL} />
        {renderBusinessAccountLinks()}
      </SeparatedList>
    </>
  )
}

export default Policies
