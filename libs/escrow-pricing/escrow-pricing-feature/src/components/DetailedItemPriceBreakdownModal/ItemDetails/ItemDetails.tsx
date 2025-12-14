'use client'

import { Cell, Image, Text } from '@vinted/web-ui'

import { useTranslate } from '@marketplace-web/i18n/i18n-feature'

type Props = {
  itemPhotoSrc?: string | null
  itemPrice: string
  itemTitle?: string
  itemsCount?: number
}

const ItemDetails = ({ itemPrice, itemTitle, itemPhotoSrc, itemsCount = 1 }: Props) => {
  const isBundle = itemsCount > 1
  const photoLabel = isBundle ? itemsCount.toString() : undefined
  const translate = useTranslate('item_price_breakdown_detailed')
  const renderBundleTitle = (
    <Text type="title" as="h2" truncate>
      {translate('items_count', { count: itemsCount }, { count: itemsCount })}
    </Text>
  )
  const renderItemTitle = itemTitle && (
    <Text type="title" as="h2" truncate>
      {itemTitle}
    </Text>
  )

  return (
    <Cell
      testId="item-price-breakdown-price-cell"
      styling="narrow"
      prefix={
        itemPhotoSrc && (
          <div data-testid="item-details-img">
            <Image
              label={photoLabel}
              src={itemPhotoSrc}
              styling="rounded"
              ratio="square"
              size="medium"
              aria={{
                'aria-hidden': 'true',
              }}
            />
          </div>
        )
      }
      title={isBundle ? renderBundleTitle : renderItemTitle}
      body={<Text text={itemPrice} type="title" theme="amplified" as="div" />}
    />
  )
}

export default ItemDetails
