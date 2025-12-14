'use client'

import {
  AddMember24,
  Donate24,
  Filters24,
  Logout24,
  Receipt24,
  Settings24,
  Wallet24,
} from '@vinted/monochrome-icons'
import { Badge, Cell, Divider, Image, Label } from '@vinted/web-ui'

import { AccountSwitch } from '@marketplace-web/account-management/account-staff-feature'
import { navigateToPage } from '@marketplace-web/browser/browser-navigation-util'
import { useCookie } from '@marketplace-web/environment/cookies-util'
import { useShouldShowDarkModeBanner } from '@marketplace-web/dark-mode/dark-mode-feature'
import { useTracking } from '@marketplace-web/observability/event-tracker-data'
import { useFeatureSwitch } from '@marketplace-web/feature-flags/feature-switches-data'
import { useTranslate } from '@marketplace-web/i18n/i18n-feature'
import { useSession } from '@marketplace-web/shared/session-data'
import { EMPTY_USER_IMAGE_NAME, useAsset } from '@marketplace-web/shared/assets'
import { SeparatedList } from '@marketplace-web/common-components/separated-list-ui'

import { donationsClickEvent } from '@marketplace-web/user-menu/user-menu-data'
import { logoutUser } from '@marketplace-web/session-management/session-management-data'

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
} from '../../constants/routes'
import AccountLinkWithIcon from './AccountLinkWithIcon'

const AccountLinksWithIcons = () => {
  const translate = useTranslate()
  const { track } = useTracking()
  const cookies = useCookie()
  const { user } = useSession()
  const asset = useAsset('assets/no-photo')
  const showFundraiser = !user?.business

  // TODO: 'payments' is a "special" (hard-coded) feature switch, which must be removed
  const isPaymentsEnabled = useFeatureSwitch('payments')
  const isReferralsEnabled = useFeatureSwitch('referrals')
  const shouldShowDarkModeAdoption = useShouldShowDarkModeBanner()
  const isImpersonatingBusiness = user?.impersonating_business

  const isFundraiserFeatureEnabled = useFeatureSwitch('web_fundraisers_enabled')

  const dontShowFundraiser = !isFundraiserFeatureEnabled && !user?.fundraiser?.active

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
    if (!shouldShowDarkModeAdoption) return null

    return <Badge theme="primary" content={translate('common.new_badge')} />
  }

  if (!user) return null

  const photoUrl = user.photo?.url || asset(EMPTY_USER_IMAGE_NAME)

  return (
    <div data-testid="user-menu-with-icons">
      <Label text={translate('header.user_menu.account.title')} />
      <SeparatedList separator={<Divider />}>
        <Cell
          title={user.login}
          body={translate('header.user_menu.account.view_profile')}
          styling="default"
          theme="transparent"
          prefix={
            <Image
              src={photoUrl}
              size="large"
              styling="circle"
              alt={translate('common.a11y.alt.user_photo')}
            />
          }
          url={MEMBER_PROFILE_URL(user.id)}
        />
        {isPaymentsEnabled && !isImpersonatingBusiness && (
          <AccountLinkWithIcon
            title={translate('header.user_menu.account.items.wallet.title')}
            url={GO_TO_WALLET_URL}
            icon={Wallet24}
          />
        )}
        <AccountLinkWithIcon
          title={translate('header.user_menu.account.items.my_orders.title')}
          url={MY_ORDERS_URL}
          testId="my-orders-account-link"
          icon={Receipt24}
        />
        {!isImpersonatingBusiness && (
          <AccountLinkWithIcon
            title={translate('header.user_menu.account.items.personalization.title')}
            url={USER_PERSONALIZATION_SIZES_URL}
            icon={Filters24}
          />
        )}
        {showReferrals() && !isImpersonatingBusiness && (
          <AccountLinkWithIcon
            title={translate('header.user_menu.account.items.referrals.title')}
            url={REFERRALS_URL}
            icon={AddMember24}
          />
        )}
        {showFundraiser &&
          !isImpersonatingBusiness &&
          !dontShowFundraiser &&
          !user.fundraiser?.feature_disabled && (
            <AccountLinkWithIcon
              title={translate('header.user_menu.account.items.donations.title')}
              url={DONATIONS_SETTINGS_URL}
              onClick={handleFundraiserClick}
              icon={Donate24}
            />
          )}
        {!isImpersonatingBusiness && (
          <AccountLinkWithIcon
            title={translate('header.user_menu.account.items.settings.title')}
            url={PROFILE_SETTINGS_URL}
            suffix={renderSettingsSuffix()}
            testId="settings-account-link"
            icon={Settings24}
          />
        )}
        {manageableAccountsFromUserDto(user)?.length && <AccountSwitch />}
        <AccountLinkWithIcon
          title={translate('header.user_menu.account.items.logout.title')}
          onClick={handleLogoutClick}
          icon={Logout24}
        />
      </SeparatedList>
    </div>
  )
}

export default AccountLinksWithIcons
