'use client'

import Script from 'next/script'
import { useEffect } from 'react'

import { useFeatureSwitch } from '@marketplace-web/feature-flags/feature-switches-data'

import { setupApsServiceScript, initApsServices } from './utils'

const Amazon = () => {
  const isAmazonPublisherAudienceEnabled = useFeatureSwitch('web_ads_amazon_publisher_audience')

  useEffect(() => {
    setupApsServiceScript(isAmazonPublisherAudienceEnabled)
    initApsServices()
  }, [isAmazonPublisherAudienceEnabled])

  return (
    <Script
      id="amazon-tag"
      data-testid="amazon-tag"
      src="https://c.amazon-adsystem.com/aax2/apstag.js"
      strategy="lazyOnload"
    />
  )
}

export default Amazon
