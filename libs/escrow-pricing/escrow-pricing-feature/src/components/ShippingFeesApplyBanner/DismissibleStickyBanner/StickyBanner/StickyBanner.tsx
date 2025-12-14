'use client'

import { Text } from '@vinted/web-ui'
import { useInView } from 'react-intersection-observer'
import classNames from 'classnames'

import { useTranslate } from '@marketplace-web/i18n/i18n-feature'

import CloseButton from '../CloseButton'
import StaticBanner from '../StaticBanner'

type Props = {
  onClose?: () => void
  areTabsShown: boolean
}

const TAB_HEIGHT = 44 // equals to $header-tabs-height
const HEADER_TOTAL_HEIGHT_DESKTOPS = 98 // equals to $header-total-height-desktops
const HEADER_TOTAL_HEIGHT_PORTABLES = 105 // equals to $header-total-height-portables

const StickyBanner = ({ onClose, areTabsShown }: Props) => {
  const [ref, inView] = useInView({
    rootMargin: areTabsShown
      ? `-${HEADER_TOTAL_HEIGHT_PORTABLES + TAB_HEIGHT}px 0px 0px 0px`
      : `-${HEADER_TOTAL_HEIGHT_DESKTOPS}px 0px 0px 0px`, // Adjust the top margin by header height
    initialInView: true,
  })
  const translate = useTranslate('shipping_fees_applied_info_banner')

  const renderStickyBanner = () => (
    <div
      data-testid="shipping-fees-applied-banner-sticky"
      className={classNames(
        'shipping-fees-applied-banner--sticky',
        areTabsShown && 'shipping-fees-applied-banner--sticky-with-tabs',
      )}
    >
      <Text text={translate('title')} type="subtitle" as="div" />
      {onClose && <CloseButton onClick={onClose} />}
    </div>
  )

  return (
    <>
      <div ref={ref}>
        <StaticBanner onClose={onClose} />
      </div>
      {!inView && renderStickyBanner()}
    </>
  )
}

export default StickyBanner
