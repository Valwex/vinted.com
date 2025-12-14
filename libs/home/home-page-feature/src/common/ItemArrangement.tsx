'use client'

import { PropsWithChildren, Ref, forwardRef } from 'react'

import { ErrorBoundary } from '@marketplace-web/error-display/error-display-util'
import { ComponentError } from '@marketplace-web/error-display/error-display-feature'
import { ControlPromoBoxRenderItemWrapper } from '@marketplace-web/braze/braze-feature'
import { GenericPromoBoxModel } from '@marketplace-web/braze/braze-data'

type Props = {
  brazePromoBoxes: Array<GenericPromoBoxModel>
  position: number
}

const ItemArrangement = (props: PropsWithChildren<Props>, ref: Ref<HTMLDivElement>) => {
  return (
    <div
      data-testid="grid-item"
      className="homepage-blocks__item homepage-blocks__item--one-fifth"
      ref={ref}
    >
      <ErrorBoundary FallbackComponent={ComponentError}>
        <ControlPromoBoxRenderItemWrapper
          index={props.position - 1} // TODO pass `position` instead of `index`
          promoBoxes={props.brazePromoBoxes}
        >
          {props.children}
        </ControlPromoBoxRenderItemWrapper>
      </ErrorBoundary>
    </div>
  )
}

export default forwardRef(ItemArrangement)
