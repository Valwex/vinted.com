'use client'

import { Icon, Button } from '@vinted/web-ui'
import { X12 } from '@vinted/monochrome-icons'

import { clickEvent } from '@marketplace-web/escrow-pricing/escrow-pricing-data'

import { useTracking } from '@marketplace-web/observability/event-tracker-data'
import { useTranslate } from '@marketplace-web/i18n/i18n-feature'
import { useSession } from '@marketplace-web/shared/session-data'

type Props = {
  onClick?: () => void
}

const CloseButton = ({ onClick }: Props) => {
  const { track } = useTracking()
  const { screen } = useSession()
  const translate = useTranslate('shipping_fees_applied_info_banner')

  const handleBannerClose = () => {
    onClick?.()
    track(
      clickEvent({
        target: 'close_shipping_info_banner',
        screen,
      }),
    )
  }

  return (
    <div>
      <Button
        size="medium"
        styling="flat"
        data-testid="shipping-fees-apply-close-button"
        theme="amplified"
        icon={<Icon name={X12} />}
        onClick={handleBannerClose}
        aria={{ 'aria-label': translate('actions.a11y.close') }}
      />
    </div>
  )
}

export default CloseButton
