'use client'

import { useState, useEffect } from 'react'

import {
  getLocalStorageItem,
  removeLocalStorageItem,
} from '@marketplace-web/browser/browser-storage-util'
import { useCookie, cookiesDataByName } from '@marketplace-web/environment/cookies-util'

import StickyBanner from './StickyBanner'

type Props = {
  suffix?: JSX.Element
  prefix?: JSX.Element
  areTabsShown?: boolean
}

const DismissibleStickyBanner = ({ prefix, suffix, areTabsShown = false }: Props) => {
  const IS_SHIPPING_FEES_APPLIED_INFO_BANNER_DISMISSED =
    'is_shipping_fees_applied_info_banner_dismissed'

  const cookies = useCookie()
  const isBannerDismissedCookieVal = cookies.get(
    cookiesDataByName.is_shipping_fees_applied_info_banner_dismissed,
  )

  const [isDismissed, setIsDismissed] = useState(isBannerDismissedCookieVal !== 'false')

  useEffect(() => {
    const wasDismissed =
      getLocalStorageItem(IS_SHIPPING_FEES_APPLIED_INFO_BANNER_DISMISSED) === 'true'

    if (wasDismissed) {
      cookies.set(cookiesDataByName.is_shipping_fees_applied_info_banner_dismissed, 'true')

      removeLocalStorageItem(IS_SHIPPING_FEES_APPLIED_INFO_BANNER_DISMISSED)
    } else if (!isBannerDismissedCookieVal) {
      cookies.set(cookiesDataByName.is_shipping_fees_applied_info_banner_dismissed, 'false')
      setIsDismissed(false)
    }
  }, [IS_SHIPPING_FEES_APPLIED_INFO_BANNER_DISMISSED, cookies, isBannerDismissedCookieVal])

  const handleBannerDismiss = () => {
    setIsDismissed(true)
    cookies.set(cookiesDataByName.is_shipping_fees_applied_info_banner_dismissed, 'true')
  }

  if (isDismissed) {
    return null
  }

  return (
    <>
      {prefix}
      <span data-testid="dismissible-sticky-banner">
        <StickyBanner onClose={handleBannerDismiss} areTabsShown={areTabsShown} />
      </span>
      {suffix}
    </>
  )
}

export default DismissibleStickyBanner
