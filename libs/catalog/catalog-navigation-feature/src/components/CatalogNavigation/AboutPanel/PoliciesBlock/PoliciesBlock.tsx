'use client'

import { useFeatureSwitch } from '@marketplace-web/feature-flags/feature-switches-data'
import { useTranslate } from '@marketplace-web/i18n/i18n-feature'
import { PRIVACY_CENTER_URL } from '@marketplace-web/user-agreements/privacy-center-data'

import {
  BUSINESS_TERMS_AND_CONDITIONS_URL,
  BUSINESS_TERMS_OF_SALE_URL,
  BUSINESS_TERMS_URL,
  COOKIE_POLICY_URL,
  HELP_SAFETY_URL,
  PRIVACY_POLICY_URL,
  TERMS_URL,
} from '../../../../constants/routes'
import LinkCell from '../LinkCell'
import LinksGroup from '../LinksGroup'

type Props = {
  impressumUrl: string | null
  isBusinessAccountLinksVisible: boolean
}

const PoliciesBlock = ({ impressumUrl, isBusinessAccountLinksVisible }: Props) => {
  const translate = useTranslate('header.main_navigation.about')

  const isProTermsAndConditionsFSEnabled = useFeatureSwitch('pro_terms_and_conditions_enabled')
  const isPrivacyUpdateFSEnabled = useFeatureSwitch('privacy_policy_update')

  const privacyTitleKey = isPrivacyUpdateFSEnabled
    ? 'policies.items.privacy_center'
    : 'policies.items.privacy_policy'
  const privacyUrl = isPrivacyUpdateFSEnabled ? PRIVACY_CENTER_URL : PRIVACY_POLICY_URL

  const renderBusinessAccountLinks = () => {
    if (!isBusinessAccountLinksVisible) return null

    if (isProTermsAndConditionsFSEnabled) {
      return (
        <LinkCell
          title={translate('policies.items.pro_terms_and_conditions')}
          url={BUSINESS_TERMS_AND_CONDITIONS_URL}
        />
      )
    }

    return (
      <>
        <LinkCell
          title={translate('policies.items.pro_terms_of_sale')}
          url={BUSINESS_TERMS_OF_SALE_URL}
        />
        <LinkCell title={translate('policies.items.pro_terms_of_use')} url={BUSINESS_TERMS_URL} />
      </>
    )
  }

  return (
    <LinksGroup title={translate('policies.title')}>
      <LinkCell title={translate('policies.items.safety')} url={HELP_SAFETY_URL} />
      {impressumUrl && (
        <LinkCell title={translate('policies.items.impressum')} url={impressumUrl} />
      )}
      <LinkCell title={translate(privacyTitleKey)} url={privacyUrl} />
      <LinkCell title={translate('policies.items.terms_and_conditions')} url={TERMS_URL} />
      <LinkCell title={translate('policies.items.cookie_policy')} url={COOKIE_POLICY_URL} />
      {renderBusinessAccountLinks()}
    </LinksGroup>
  )
}

export default PoliciesBlock
