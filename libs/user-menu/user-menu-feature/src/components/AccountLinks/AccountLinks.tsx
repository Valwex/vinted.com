'use client'

import { Badge, Divider, Label } from '@vinted/web-ui'
import { useEffect } from 'react'

import { useShouldShowDarkModeBanner } from '@marketplace-web/dark-mode/dark-mode-feature'
import { useFeatureSwitch } from '@marketplace-web/feature-flags/feature-switches-data'
import { AccountSwitch } from '@marketplace-web/account-management/account-staff-feature'

import { SeparatedList } from '@marketplace-web/common-components/separated-list-ui'
import { useTracking } from '@marketplace-web/observability/event-tracker-data'
import { useTranslate } from '@marketplace-web/i18n/i18n-feature'
import { useSession } from '@marketplace-web/shared/session-data'
import {
  useAbTest,
  useTrackAbTest,
  useTrackAbTestCallback,
} from '@marketplace-web/feature-flags/ab-tests-data'
import { logoutUser } from '@marketplace-web/session-management/session-management-data'
import { donationsClickEvent } from '@marketplace-web/user-menu/user-menu-data'
import { navigateToPage } from '@marketplace-web/browser/browser-navigation-util'
import { useCookie } from '@marketplace-web/environment/cookies-util'

import { manageableAccountsFromUserDto } from '@marketplace-web/account-management/account-staff-data'

import {
  DONATIONS_SETTINGS_URL,
  GO_TO_WALLET_URL,
  MEMBER_PROFILE_URL,
  MY_ORDERS_URL,
  PROFILE_SETTINGS_URL,
  REFERRALS_URL,
  ROOT_URL,
  USER_PERSONALIZATION_SIZES_URL,
  WALLET_INVOICES_URL,
} from '../../constants/routes'
import AccountLink from './AccountLink'

const AccountLinks = () => {
  const translate = useTranslate()
  const { track } = useTracking()
  const cookies = useCookie()
  const { user } = useSession()
  const showFundraiser = !user?.business

  // TODO: 'payments' is a "special" (hard-coded) feature switch, which must be removed
  const isPaymentsEnabled = useFeatureSwitch('payments')
  const isReferralsEnabled = useFeatureSwitch('referrals')
  const shouldShowDarkModeAdoption = useShouldShowDarkModeBanner()
  const isImpersonatingBusiness = user?.impersonating_business

  const isFundraiserFeatureEnabled = useFeatureSwitch('web_fundraisers_enabled')

  const dontShowFundraiserInAbTest = !isFundraiserFeatureEnabled && !user?.fundraiser?.active

  const referralsCTAPlacementABTest = useAbTest('referrals_new_cta_placement_in_profile_menu')
  const trackAbTest = useTrackAbTestCallback()

  const phoneNumberInfoBannerAbtest = useAbTest(
    'promotion_campaign_voluntary_phone_verification_adoption',
  )
  const isPhoneNumberInfoBannerAbtestEnabled = phoneNumberInfoBannerAbtest?.variant === 'on'
  const isPhoneNumberVerified = user?.verification.phone.valid
  const isRequiredActionBageVisible = isPhoneNumberInfoBannerAbtestEnabled && !isPhoneNumberVerified
  useTrackAbTest(phoneNumberInfoBannerAbtest, !isPhoneNumberVerified)

  useEffect(() => {
    if (isReferralsEnabled) {
      trackAbTest(referralsCTAPlacementABTest)
    }
  }, [isReferralsEnabled, referralsCTAPlacementABTest, trackAbTest])

  const showReferrals = () => {
    if (!isReferralsEnabled) return false

    return true
  }

  const handleLogoutClick = async () => {
    const response = await logoutUser({ cookies })

    if (response) navigateToPage(ROOT_URL)
  }

  const handleFundraiserClick = () => {
    track(
      donationsClickEvent({
        target: 'enter_donations_from_web_menu',
      }),
    )
  }

  const renderSettingsSuffix = () => {
    if (shouldShowDarkModeAdoption) {
      return <Badge theme="primary" content={translate('common.new_badge')} />
    }

    if (isRequiredActionBageVisible) {
      return (
        <>
          <span aria-hidden="true">
            <Badge
              theme="primary"
              content={translate('header.user_menu.account.items.settings.badge')}
            />
          </span>
          <span className="u-visually-hidden">
            {translate('header.user_menu.account.items.settings.badge_description')}
          </span>
        </>
      )
    }

    return null
  }

  if (!user) return null

  return (
    <>
      <Label text={translate('header.user_menu.account.title')} />
      <SeparatedList separator={<Divider />}>
        <AccountLink
          title={translate('header.user_menu.account.items.profile.title')}
          url={MEMBER_PROFILE_URL(user.id)}
        />
        {showReferrals() &&
          !isImpersonatingBusiness &&
          referralsCTAPlacementABTest?.variant === 'on' && (
            <AccountLink
              title={translate('header.user_menu.account.items.referrals.title')}
              url={REFERRALS_URL}
            />
          )}
        {!isImpersonatingBusiness && (
          <AccountLink
            title={translate('header.user_menu.account.items.settings.title')}
            url={PROFILE_SETTINGS_URL}
            suffix={renderSettingsSuffix()}
            testId="settings-account-link"
          />
        )}
        {!isImpersonatingBusiness && (
          <AccountLink
            title={translate('header.user_menu.account.items.personalization.title')}
            url={USER_PERSONALIZATION_SIZES_URL}
          />
        )}
        {isPaymentsEnabled && !isImpersonatingBusiness && (
          <AccountLink
            title={translate('header.user_menu.account.items.wallet.title')}
            url={GO_TO_WALLET_URL}
          />
        )}
        <AccountLink
          title={translate('header.user_menu.account.items.my_orders.title')}
          url={MY_ORDERS_URL}
          testId="my-orders-account-link"
        />
        {showFundraiser &&
          !isImpersonatingBusiness &&
          !dontShowFundraiserInAbTest &&
          !user.fundraiser?.feature_disabled && (
            <AccountLink
              title={translate('header.user_menu.account.items.donations.title')}
              url={DONATIONS_SETTINGS_URL}
              onClick={handleFundraiserClick}
            />
          )}
        {!isPaymentsEnabled && !isImpersonatingBusiness && (
          <AccountLink
            title={translate('header.user_menu.account.items.invoices.title')}
            url={WALLET_INVOICES_URL}
          />
        )}
        {showReferrals() &&
          !isImpersonatingBusiness &&
          referralsCTAPlacementABTest?.variant !== 'on' && (
            <AccountLink
              title={translate('header.user_menu.account.items.referrals.title')}
              url={REFERRALS_URL}
            />
          )}
        {manageableAccountsFromUserDto(user)?.length && <AccountSwitch />}
        <AccountLink
          title={translate('header.user_menu.account.items.logout.title')}
          onClick={handleLogoutClick}
        />
      </SeparatedList>
    </>
  )
}

export default AccountLinks
