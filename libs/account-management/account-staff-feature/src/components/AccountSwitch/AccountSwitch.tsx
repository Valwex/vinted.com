'use client'

import { useRef } from 'react'
import { Badge, Cell, Divider, Image, Text } from '@vinted/web-ui'

import { useTranslate } from '@marketplace-web/i18n/i18n-feature'
import {
  getStaffAccountAssertion,
  ManageableAccountDto,
  manageableAccountsFromUserDto,
} from '@marketplace-web/account-management/account-staff-data'
import {
  AuthenticateGrantType,
  AuthenticateProvider,
  authenticateUser,
} from '@marketplace-web/authentication/authentication-data'
import { getFingerprint } from '@marketplace-web/session-management/audit-util'
import { useRefUrl } from '@marketplace-web/ref-url/ref-url-feature'
import { navigateToPage } from '@marketplace-web/browser/browser-navigation-util'
import { useBreakpoint, ShowAtBreakpoint } from '@marketplace-web/breakpoints/breakpoints-feature'

import { useDataDomeCaptcha } from '@marketplace-web/bot-detection/data-dome-feature'
import { useSession } from '@marketplace-web/shared/session-data'

import AccountMenuAction from './AccountMenuAction'

const AccountSwitch = () => {
  const translate = useTranslate('header.user_menu.account.items.other_profile')
  const { user } = useSession()
  const refUrl = useRefUrl()
  const breakpoints = useBreakpoint()
  const clickedAccountIdRef = useRef<number | null>(null)
  const manageableAccounts = manageableAccountsFromUserDto(user)

  const handleAccountClick = (userId: number) => async () => {
    clickedAccountIdRef.current = userId

    const response = await getStaffAccountAssertion(userId)
    const fingerprint = await getFingerprint()

    if ('errors' in response) {
      // TODO: handle error

      return
    }

    const authResponse = await authenticateUser({
      grantType: AuthenticateGrantType.Assertion,
      assertion: response.assertion,
      provider: AuthenticateProvider.Vinted,
      fingerprint,
    })

    if ('errors' in authResponse) {
      // TODO: handle error

      return
    }

    navigateToPage(refUrl)
  }

  useDataDomeCaptcha(() => {
    if (!clickedAccountIdRef.current) return

    handleAccountClick(clickedAccountIdRef.current)()
  })

  const renderProBadge = () => {
    if (user?.impersonating_business) return null

    return <Badge content={translate('badge')} />
  }

  const renderAccountLink = ({ icon, name, user_id: userId }: ManageableAccountDto) => (
    <Cell
      key={userId}
      prefix={<Image src={icon} size="medium" styling="circle" />}
      subtitle={<Text as="span" text={name} />}
      suffix={renderProBadge()}
      styling={breakpoints.desktops ? 'tight' : 'default'}
      onClick={handleAccountClick(userId)}
      theme="transparent"
      clickable
    />
  )

  const renderDesktopAccount = (account: ManageableAccountDto) => (
    <AccountMenuAction key={account.user_id}>{renderAccountLink(account)}</AccountMenuAction>
  )

  if (!manageableAccounts?.length) return null

  return (
    <div>
      <ShowAtBreakpoint breakpoint="desktops">
        <Divider />
        <Cell title={translate('title')} styling="narrow" />
        {manageableAccounts.map(renderDesktopAccount)}
        <Divider />
      </ShowAtBreakpoint>
      <ShowAtBreakpoint breakpoint="portables">
        <Cell title={translate('title')} styling="narrow" />
        {manageableAccounts.map(renderAccountLink)}
      </ShowAtBreakpoint>
    </div>
  )
}

export default AccountSwitch
