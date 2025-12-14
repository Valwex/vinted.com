'use client'

import { Menu24, X24 } from '@vinted/monochrome-icons'
import { Button } from '@vinted/web-ui'

import { useTracking } from '@marketplace-web/observability/event-tracker-data'
import { useTranslate } from '@marketplace-web/i18n/i18n-feature'
import { clickEvent } from '@marketplace-web/header/header-data'

type Props = {
  isActive: boolean
  onToggle(): void
}

const HeaderToggleMobileMenu = ({ isActive, onToggle }: Props) => {
  const { track } = useTracking()
  const translate = useTranslate('header')

  function trackClick() {
    track(
      clickEvent({
        target: 'navigation_menu_toggle',
      }),
    )
  }

  function handleToggleClick() {
    trackClick()
    onToggle()
  }

  const icon = isActive ? X24 : Menu24
  const menuKey = isActive ? 'close' : 'open'

  return (
    <Button
      onClick={handleToggleClick}
      iconName={icon}
      iconColor="greyscale-level-2"
      styling="flat"
      aria={{ 'aria-label': translate(`a11y.menu.${menuKey}`) }}
    />
  )
}

export default HeaderToggleMobileMenu
