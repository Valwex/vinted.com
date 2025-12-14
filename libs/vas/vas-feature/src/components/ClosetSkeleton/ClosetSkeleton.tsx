'use client'

import { Cell, Spacer } from '@vinted/web-ui'
import { ReactNode } from 'react'

import { HorizontalScrollArea } from '@marketplace-web/common-components/horizontal-scroll-area-ui'
import { Skeleton } from '@marketplace-web/common-components/skeleton-ui'
import { ItemBoxSkeleton } from '@marketplace-web/item-box/item-box-feature'
import { useTranslate } from '@marketplace-web/i18n/i18n-feature'

import DynamicSpacer from '../DynamicSpacer'

type Props = {
  suffix?: ReactNode
}

const ClosetSkeleton = ({ suffix }: Props) => {
  const translateA11y = useTranslate('a11y')

  const renderItemBoxSkeleton = () => {
    return (
      <HorizontalScrollArea.Item className="closet__item">
        <ItemBoxSkeleton />
      </HorizontalScrollArea.Item>
    )
  }

  return (
    <>
      <DynamicSpacer phones="Regular" tabletsUp="Large" />
      <div className="closet-container">
        <Cell styling="tight">
          <div className="closet-container__item-horizontal-scroll">
            <div className="closet closet--with-horizontal-scroll closet--wide">
              <Cell
                prefix={<Skeleton width={48} height={48} circle />}
                title={<Skeleton width={96} height={20} />}
                body={<Skeleton width={120} height={20} />}
                suffix={<Skeleton width={120} height={32} />}
              />
              <HorizontalScrollArea
                controlsScrollType={HorizontalScrollArea.ControlScrollType.Partial}
                showControls={false}
                arrowLeftText={translateA11y('actions.move_left')}
                arrowRightText={translateA11y('actions.move_right')}
              >
                {renderItemBoxSkeleton()}
                {renderItemBoxSkeleton()}
                {renderItemBoxSkeleton()}
                {renderItemBoxSkeleton()}
                {renderItemBoxSkeleton()}
                {renderItemBoxSkeleton()}
              </HorizontalScrollArea>
            </div>
          </div>
        </Cell>
      </div>
      <div className="u-ui-padding-left-medium">
        <Spacer />
        <Skeleton width={140} height={18} />
      </div>
      {suffix}
    </>
  )
}

export default ClosetSkeleton
