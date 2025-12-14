'use client'

import { MouseEvent } from 'react'
import { Button } from '@vinted/web-ui'

import { useSession } from '@marketplace-web/shared/session-data'
import { useTranslate } from '@marketplace-web/i18n/i18n-feature'

import { logoutUser } from '@marketplace-web/session-management/session-management-data'
import { navigateToPage } from '@marketplace-web/browser/browser-navigation-util'
import { useCookie } from '@marketplace-web/environment/cookies-util'

import HeaderLogo from '../../HeaderLogo'
import { useEmailCodeTest } from './hooks/useEmailCodeTest'
import { ROOT_URL } from '../../constants/routes'

type Props = {
  children?: JSX.Element
}

const HeaderNoNavigation = ({ children }: Props) => {
  const { user } = useSession()
  const translate = useTranslate()
  const {
    trackLogoutEvent,
    isLoadingPrompts,
    trackEmailCodeSkipEvent,
    handleDismissVerificationPrompt,
  } = useEmailCodeTest()
  const cookies = useCookie()

  const handleLogoutClick = async () => {
    const response = await logoutUser({ cookies })

    if (response) {
      trackLogoutEvent()
      navigateToPage(ROOT_URL)
    }
  }

  const handleDismissPrompt = async () => {
    await handleDismissVerificationPrompt()

    navigateToPage(ROOT_URL)
  }

  const handleLogoClick = (event: MouseEvent) => {
    event.preventDefault()

    trackEmailCodeSkipEvent()
    handleDismissPrompt()
  }

  const renderLogoutButton = () => {
    if (!user) return null

    return (
      <div className="u-flexbox u-margin-left-auto u-align-items-center u-position-relative u-z-index-notification">
        <Button
          theme="muted"
          styling="flat"
          size="medium"
          onClick={handleLogoutClick}
          disabled={isLoadingPrompts}
        >
          {translate('header.actions.log_out')}
        </Button>
      </div>
    )
  }

  return (
    <div className="l-header">
      <header className="l-header__main">
        <div className="container u-flexbox u-align-items-center u-fill-height">
          <div className="u-flexbox u-align-items-center u-fill-width">
            <HeaderLogo onClick={handleLogoClick} />
            {renderLogoutButton()}
            {children}
          </div>
        </div>
      </header>
    </div>
  )
}

export default HeaderNoNavigation
