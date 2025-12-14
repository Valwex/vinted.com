'use client'

import { useContext } from 'react'
import { InView } from 'react-intersection-observer'

import { GenericPromoBoxModel, PromoBoxType } from '@marketplace-web/braze/braze-data'

import BrazeContext from '../../containers/BrazeProvider/BrazeContext'

type Props = {
  promoBox: GenericPromoBoxModel | null
  children: JSX.Element
  className?: string
  index: number
}

const ControlPromoBoxTracker = ({ promoBox, children, index, className }: Props) => {
  const { logCardImpression } = useContext(BrazeContext)

  const promoBoxIndex = {
    [PromoBoxType.Braze]: promoBox?.position,
    [PromoBoxType.BrazeSticky]: 0,
  }

  const shouldLog = promoBox?.isControl && index === promoBoxIndex[promoBox.type]

  if (shouldLog) {
    const handleVisibility = (inView: boolean) => {
      if (!inView) return

      logCardImpression(promoBox.id)
    }

    return (
      <InView
        data-testid="control-promobox-tracker"
        onChange={handleVisibility}
        className={className}
      >
        {children}
      </InView>
    )
  }

  if (className) {
    return <div className={className}>{children}</div>
  }

  return children
}

export default ControlPromoBoxTracker
