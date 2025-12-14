'use client'

import { MouseEvent } from 'react'
import { Image } from '@vinted/web-ui'
import classNames from 'classnames'
import { noop } from 'lodash'

import { useTracking } from '@marketplace-web/observability/event-tracker-data'
import { useTranslate } from '@marketplace-web/i18n/i18n-feature'
import { useSession } from '@marketplace-web/shared/session-data'
import { useAsset } from '@marketplace-web/shared/assets'
import { clickEvent } from '@marketplace-web/header/header-data'

import { ROOT_URL } from '../constants/routes'

type Props = {
  onClick?: (event: MouseEvent) => void
}

const HeaderLogo = ({ onClick = noop }: Props) => {
  const translate = useTranslate('header.a11y')
  const { track } = useTracking()
  const { user } = useSession()

  const asset = useAsset('assets/web-logo/default')

  const handleLogoClick = (event: MouseEvent) => {
    const trakingEvent = clickEvent({
      target: 'logo',
    })

    track(trakingEvent)

    return onClick(event)
  }

  const renderDesktopLogo = () => (
    <div className="l-header__logo-container">
      <Image src={asset('logo.svg')} alt={translate('logo')} />
    </div>
  )

  const renderLogo = () => <div className="u-ui-padding-left-small">{renderDesktopLogo()}</div>

  const renderAuthenticatedLogo = () => (
    <>
      <div className="u-phones-only">
        <Image src={asset('symbol.svg')} alt={translate('logo')} />
      </div>

      <div className={classNames('u-tablets-up-only', 'u-ui-padding-left-small')}>
        {renderDesktopLogo()}
      </div>
    </>
  )

  return (
    <div className="l-header__logo">
      <a
        className="u-block"
        href={ROOT_URL}
        title={translate('logo')}
        aria-label={translate('logo')}
        onClick={handleLogoClick}
        data-testid="header-logo-id"
      >
        {user ? renderAuthenticatedLogo() : renderLogo()}
      </a>
    </div>
  )
}

export default HeaderLogo
