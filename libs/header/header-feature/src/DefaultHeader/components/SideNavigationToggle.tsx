'use client'

import { Menu24, X24 } from '@vinted/monochrome-icons'
import { Button } from '@vinted/web-ui'

import { useTracking } from '@marketplace-web/observability/event-tracker-data'
import { clickEvent } from '@marketplace-web/header/header-data'

import { useSideNavigationContext } from '../contexts/SideNavigationContext'

type Props = {
  ariaLabel: {
    close: string
    open: string
  }
}

const SideNavigationToggle = ({ ariaLabel }: Props) => {
  const { track } = useTracking()
  const { isOpen, toggle } = useSideNavigationContext()

  function handleToggleClick() {
    track(clickEvent({ target: 'navigation_menu_toggle' }))
    toggle()
  }

  const icon = isOpen ? X24 : Menu24
  const menuKey = isOpen ? 'close' : 'open'

  return (
    <Button
      onClick={handleToggleClick}
      iconName={icon}
      iconColor="greyscale-level-3"
      styling="flat"
      aria={{ 'aria-label': ariaLabel[menuKey] }}
    />
  )
}

export default SideNavigationToggle
