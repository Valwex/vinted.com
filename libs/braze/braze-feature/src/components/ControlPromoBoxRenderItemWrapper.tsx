'use client'

import { PropsWithChildren } from 'react'

import { GenericPromoBoxModel } from '@marketplace-web/braze/braze-data'

import ControlPromoBoxTracker from './ControlPromoBoxTracker'

type Props = {
  promoBoxes: Array<GenericPromoBoxModel>
  index: number
}

const ControlPromoBoxRenderItemWrapper = ({
  children,
  promoBoxes,
  index,
}: PropsWithChildren<Props>) => {
  const controlPromoBox = promoBoxes.find(promoBox => promoBox.isControl)

  if (controlPromoBox) {
    return (
      <ControlPromoBoxTracker promoBox={controlPromoBox} index={index}>
        <div className="u-fill-height">{children}</div>
      </ControlPromoBoxTracker>
    )
  }

  return children
}

export default ControlPromoBoxRenderItemWrapper
