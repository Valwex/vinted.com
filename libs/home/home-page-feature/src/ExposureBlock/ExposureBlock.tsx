'use client'

import { useRef } from 'react'
import { InView } from 'react-intersection-observer'

import {
  abTestExposeEvent,
  AbTestExposeEventExtra,
} from '@marketplace-web/feature-flags/ab-tests-data'
import { useTracking } from '@marketplace-web/observability/event-tracker-data'

const ExposureBlock = ({
  test_anon_id: anonId,
  test_id: id,
  test_name: name,
  test_user_id: userId,
  country_code: countryCode,
  variant,
}: AbTestExposeEventExtra) => {
  const { track } = useTracking()
  const isExposureBlockSeen = useRef(false)

  const handleBlockView = (inView: boolean) => {
    if (!inView) return
    if (isExposureBlockSeen.current) return

    isExposureBlockSeen.current = true

    track(
      abTestExposeEvent({
        anonId,
        id,
        name,
        userId: userId ? parseInt(userId, 10) : undefined,
        countryCode,
        variant,
      }),
    )
  }

  return (
    <InView
      className="u-fill-width"
      onChange={handleBlockView}
      data-testid={`exposure-block-${id || name}`}
    />
  )
}

export default ExposureBlock
