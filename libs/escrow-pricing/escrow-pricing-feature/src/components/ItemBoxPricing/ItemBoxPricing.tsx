'use client'

import { Spacer, Text } from '@vinted/web-ui'

import { getTestId } from '@marketplace-web/vendor-abstractions/web-ui-util'

type Props = {
  price: string
  oldPrice?: string | null
  testId?: string
}

const ItemBoxPricing = ({ price, testId, oldPrice }: Props) => {
  return (
    <div className="new-item-box__title" data-testid={getTestId(testId, 'title-container')}>
      <div className="title-content">
        <Text
          text={price}
          type="caption"
          theme="muted"
          testId={getTestId(testId, 'price-text')}
          as="p"
        />
        {oldPrice ? (
          <>
            <Spacer orientation="vertical" size="small" />
            <Text
              text={oldPrice}
              type="caption"
              theme="muted"
              strikethrough
              truncate
              testId={getTestId(testId, 'old-price-text')}
              as="p"
            />
          </>
        ) : null}
      </div>
    </div>
  )
}

export default ItemBoxPricing
