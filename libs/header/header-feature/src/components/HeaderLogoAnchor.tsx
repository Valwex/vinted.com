'use client'

import { AllHTMLAttributes, PropsWithChildren, MouseEvent } from 'react'

import { useTracking } from '@marketplace-web/observability/event-tracker-data'
import { clickEvent } from '@marketplace-web/header/header-data'

import { ROOT_URL } from '../constants/routes'

const HeaderLogoAnchor = ({
  onClick,
  ...props
}: PropsWithChildren<AllHTMLAttributes<HTMLAnchorElement>>) => {
  const { track } = useTracking()

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    const trackingEvent = clickEvent({ target: 'logo' })

    track(trackingEvent)
    onClick?.(event)
  }

  return (
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    <a
      {...props}
      className="u-block"
      href={ROOT_URL}
      data-testid="header-logo-id"
      onClick={handleClick}
    />
  )
}

export default HeaderLogoAnchor
