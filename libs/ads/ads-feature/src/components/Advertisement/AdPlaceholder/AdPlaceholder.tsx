'use client'

import { Suspense } from 'react'
import classNames from 'classnames'

import { Skeleton } from '@marketplace-web/common-components/skeleton-ui'
import { AdShape } from '@marketplace-web/ads/ads-data'

import AdInfo from '../AdInfo'

type Props = {
  shape: AdShape
}

const AdPlaceholder = ({ shape }: Props) => {
  if (shape !== AdShape.Leaderboard) return null

  return (
    <Suspense>
      <div
        className={classNames('slot-placeholder', `slot-placeholder--${shape}`)}
        data-testid="slot-placeholder"
        aria-hidden="true"
        suppressHydrationWarning
      >
        <AdInfo />
        <Skeleton className="slot-placeholder--skeleton" />
      </div>
    </Suspense>
  )
}

export default AdPlaceholder
