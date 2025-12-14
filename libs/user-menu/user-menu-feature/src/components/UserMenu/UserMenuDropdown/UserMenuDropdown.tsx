'use client'

import { ReactNode, useEffect, useState } from 'react'
import { Card, flip, Image, offset, shift, Spacing, Tooltip, useFloating } from '@vinted/web-ui'
import classNames from 'classnames'

import {
  getSessionStorageItem,
  removeSessionStorageItem,
} from '@marketplace-web/browser/browser-storage-util'
import { useTranslate } from '@marketplace-web/i18n/i18n-feature'
import { OutsideClick } from '@marketplace-web/common-components/outside-click-ui'
import { ScrollableArea } from '@marketplace-web/common-components/scrollable-area-ui'
import { ACCOUNT_SWITCH_TOOLTIP_SESSION_STORAGE_KEY } from '@marketplace-web/account-management/account-staff-feature'

const TOOLTIP_DISPLAY_TIME = 8000

type Props = {
  userName: string
  userPhoto: string
  children: ReactNode
  onUserMenuDropdownOpen: () => void
}
const UserMenuDropdown = ({ userName, userPhoto, children, onUserMenuDropdownOpen }: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  const accountTooltipStorageValue = getSessionStorageItem(
    ACCOUNT_SWITCH_TOOLTIP_SESSION_STORAGE_KEY,
  )
  const [isSwitchAccountTooltipVisible, setIsSwitchAccountTooltipVisible] = useState(
    !!accountTooltipStorageValue,
  )
  const translate = useTranslate('header.user_menu.account')

  useEffect(() => {
    if (isOpen) {
      onUserMenuDropdownOpen()
    }
  }, [isOpen, onUserMenuDropdownOpen])

  useEffect(() => {
    if (!isSwitchAccountTooltipVisible) return undefined

    const timer = setTimeout(() => {
      setIsSwitchAccountTooltipVisible(false)
      removeSessionStorageItem(ACCOUNT_SWITCH_TOOLTIP_SESSION_STORAGE_KEY)
    }, TOOLTIP_DISPLAY_TIME)

    return () => clearTimeout(timer)
  }, [isSwitchAccountTooltipVisible])

  const handleOutsideClick = () => setIsOpen(false)

  const handleMenuButtonClick = () => {
    setIsOpen(prevIsOpen => !prevIsOpen)
    setIsSwitchAccountTooltipVisible(false)
    removeSessionStorageItem(ACCOUNT_SWITCH_TOOLTIP_SESSION_STORAGE_KEY)
  }

  const { floaterRef, triggerRef, floaterStyle } = useFloating({
    middleware: [offset(Spacing.Medium), flip({ mainAxis: false }), shift()],
    placement: 'bottom-end',
    shouldAutoUpdate: true,
    isFloaterVisible: isOpen,
  })

  const renderUserMenu = () => (
    <button
      type="button"
      id="user-menu-button"
      data-testid="user-menu-button"
      ref={triggerRef}
      onClick={handleMenuButtonClick}
      className={classNames({ open: isOpen })}
    >
      <figure className="header-avatar">
        <Image src={userPhoto} alt={userName} styling="circle" />
      </figure>
    </button>
  )

  const renderUserMenuWithTooltip = () => (
    <Tooltip
      content={translate('switch_to_business_tooltip')}
      placement="bottom-end"
      show={isSwitchAccountTooltipVisible}
    >
      {renderUserMenu()}
    </Tooltip>
  )

  return (
    <OutsideClick onOutsideClick={handleOutsideClick}>
      {isSwitchAccountTooltipVisible ? renderUserMenuWithTooltip() : renderUserMenu()}
      {isOpen && (
        <div ref={floaterRef} style={floaterStyle}>
          <Card styling="elevated">
            <ScrollableArea>
              <div className="user-menu-groups">{children}</div>
            </ScrollableArea>
          </Card>
        </div>
      )}
    </OutsideClick>
  )
}

export default UserMenuDropdown
