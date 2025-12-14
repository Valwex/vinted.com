'use client'

import { Badge, Spacer } from '@vinted/web-ui'

import { AccountSwitch } from '@marketplace-web/account-management/account-staff-feature'
import { navigateToPage } from '@marketplace-web/browser/browser-navigation-util'
import { useCookie } from '@marketplace-web/environment/cookies-util'
import { useShouldShowDarkModeBanner } from '@marketplace-web/dark-mode/dark-mode-feature'
import { useTracking } from '@marketplace-web/observability/event-tracker-data'
import { useFeatureSwitch } from '@marketplace-web/feature-flags/feature-switches-data'
import { useTranslate } from '@marketplace-web/i18n/i18n-feature'
import { useSession } from '@marketplace-web/shared/session-data'
import { EMPTY_USER_IMAGE_NAME, useAsset } from '@marketplace-web/shared/assets'

import { clickEvent, referralsPageUserClickEvent } from '@marketplace-web/user-menu/user-menu-data'
import { logoutUser } from '@marketplace-web/session-management/session-management-data'
import {
  useAbTest,
  useTrackAbTest,
  useTrackAbTestCallback,
} from '@marketplace-web/feature-flags/ab-tests-data'

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
import CurrentWalletAmount from './CurrentWalletAmount'
import UserMenuDropdown from './UserMenuDropdown'
import UserMenuGroup from './UserMenuGroup'
import { findThumbnail } from '../../utils/photo'

const UserMenu = () => {
  const { user } = useSession()
  const translate = useTranslate()
  const { track } = useTracking()
  const cookies = useCookie()
  const asset = useAsset('assets/no-photo')

  const isPaymentsEnabled = useFeatureSwitch('payments')
  const showFundraiser = !user?.business
  const isReferralsEnabled = useFeatureSwitch('referrals')
  const shouldShowDarkModeAdoption = useShouldShowDarkModeBanner()
  const isImpersonatingBusiness = user?.impersonating_business
  const trackAbTest = useTrackAbTestCallback()

  const referralsCTAPlacementABTest = useAbTest('referrals_new_cta_placement_in_profile_menu')

  const phoneNumberInfoBannerAbtest = useAbTest(
    'promotion_campaign_voluntary_phone_verification_adoption',
  )
  const isPhoneNumberInfoBannerAbtestEnabled = phoneNumberInfoBannerAbtest?.variant === 'on'
  const isPhoneNumberVerified = user?.verification.phone.valid
  const isRequiredActionBageVisible = isPhoneNumberInfoBannerAbtestEnabled && !isPhoneNumberVerified
  useTrackAbTest(phoneNumberInfoBannerAbtest, !isPhoneNumberVerified)

  const isFundraiserFeatureEnabled = useFeatureSwitch('web_fundraisers_enabled')
  const dontShowFundraiser = !isFundraiserFeatureEnabled && !user?.fundraiser?.active

  const onUserMenuDropdownOpen = () => {
    if (isReferralsEnabled) {
      trackAbTest(referralsCTAPlacementABTest)
    }
  }

  const showReferrals = () => {
    if (!isReferralsEnabled) return false

    return true
  }

  if (!user) return null

  const userPhoto = findThumbnail(user.photo) || asset(EMPTY_USER_IMAGE_NAME)

  const handleTrackOnClick = (target: Parameters<typeof clickEvent>[0]['target']) => {
    const eventData = {
      target,
      screen: 'user_menu',
    }

    if (target === 'referrals') {
      track(referralsPageUserClickEvent(eventData))
    } else {
      track(clickEvent(eventData))
    }
  }

  const handleLogoutClick = async () => {
    handleTrackOnClick('log_out')

    const response = await logoutUser({ cookies })

    if (response) navigateToPage(ROOT_URL)
  }

  const renderWalletAction = () => (
    <UserMenuGroup.Action href={GO_TO_WALLET_URL} onClick={() => handleTrackOnClick('balance')}>
      <span className="u-flexbox u-justify-content-between u-align-items-center">
        {translate('header.user_menu.account.items.wallet.title')}
        <Spacer orientation="vertical" size="x5-large" />
        <span className="user-menu-group__balance-placeholder u-flexbox u-justify-content-flex-end">
          <CurrentWalletAmount />
        </span>
      </span>
    </UserMenuGroup.Action>
  )

  const renderMyOrdersAction = () => (
    <UserMenuGroup.Action href={MY_ORDERS_URL} onClick={() => handleTrackOnClick('orders')}>
      {translate('header.user_menu.account.items.my_orders.title')}
    </UserMenuGroup.Action>
  )

  const renderFundraiserAction = () => (
    <UserMenuGroup.Action
      href={DONATIONS_SETTINGS_URL}
      onClick={() => handleTrackOnClick('enter_donations_from_settings')}
    >
      {translate('header.user_menu.account.items.donations.title')}
    </UserMenuGroup.Action>
  )

  const renderLogoutAction = () => (
    <UserMenuGroup.Action onClick={handleLogoutClick}>
      <span className="u-color-red">
        {translate('header.user_menu.account.items.logout.title')}
      </span>
    </UserMenuGroup.Action>
  )

  return (
    <UserMenuDropdown
      userName={user.login}
      userPhoto={userPhoto}
      onUserMenuDropdownOpen={onUserMenuDropdownOpen}
    >
      <UserMenuGroup>
        <UserMenuGroup.Item>
          <UserMenuGroup.Action
            href={MEMBER_PROFILE_URL(user.id)}
            onClick={() => handleTrackOnClick('profile')}
          >
            {translate('header.user_menu.account.items.profile.title')}
          </UserMenuGroup.Action>
          {showReferrals() &&
            !isImpersonatingBusiness &&
            referralsCTAPlacementABTest?.variant === 'on' && (
              <UserMenuGroup.Action
                href={REFERRALS_URL}
                onClick={() => handleTrackOnClick('referrals')}
              >
                {translate('header.user_menu.account.items.referrals.title')}
              </UserMenuGroup.Action>
            )}
          {!isImpersonatingBusiness && (
            <UserMenuGroup.Action
              href={PROFILE_SETTINGS_URL}
              onClick={() => handleTrackOnClick('settings')}
            >
              {translate('header.user_menu.account.items.settings.title')}
              {isRequiredActionBageVisible && (
                <>
                  <Spacer orientation="vertical" size="x4-large" />
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
              )}
              {shouldShowDarkModeAdoption && (
                <>
                  <Spacer orientation="vertical" size="small" />
                  <Badge theme="primary" content={translate('common.new_badge')} />
                </>
              )}
            </UserMenuGroup.Action>
          )}
          {!isImpersonatingBusiness && (
            <UserMenuGroup.Action
              href={USER_PERSONALIZATION_SIZES_URL}
              onClick={() => handleTrackOnClick('customize')}
            >
              {translate('header.user_menu.account.items.personalization.title')}
            </UserMenuGroup.Action>
          )}
          {isPaymentsEnabled && !isImpersonatingBusiness && renderWalletAction()}
          {renderMyOrdersAction()}
          {showFundraiser &&
            !isImpersonatingBusiness &&
            !dontShowFundraiser &&
            !user.fundraiser?.feature_disabled &&
            renderFundraiserAction()}
          {!isPaymentsEnabled && !isImpersonatingBusiness && (
            <UserMenuGroup.Action
              href={WALLET_INVOICES_URL}
              onClick={() => handleTrackOnClick('invoices')}
            >
              {translate('header.user_menu.account.items.invoices.title')}
            </UserMenuGroup.Action>
          )}
          {showReferrals() &&
            !isImpersonatingBusiness &&
            referralsCTAPlacementABTest?.variant !== 'on' && (
              <UserMenuGroup.Action
                href={REFERRALS_URL}
                onClick={() => handleTrackOnClick('referrals')}
              >
                {translate('header.user_menu.account.items.referrals.title')}
              </UserMenuGroup.Action>
            )}
          <AccountSwitch />
          {renderLogoutAction()}
        </UserMenuGroup.Item>
      </UserMenuGroup>
    </UserMenuDropdown>
  )
}

export default UserMenu
