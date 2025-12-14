import { Cell, Spacer, Text } from '@vinted/web-ui'

import { Skeleton } from '@marketplace-web/common-components/skeleton-ui'
import { AspectRatio } from '@marketplace-web/common-components/aspect-ratio-ui'

const ItemBoxSkeleton = () => {
  const renderCaption = (width: number) => (
    <Text width="parent" as="span" type="caption">
      <Skeleton height={12} width={width} />
    </Text>
  )

  return (
    <div className="new-item-box__container">
      <AspectRatio ratio="2:3">
        <Skeleton height="100%" />
      </AspectRatio>
      <Cell styling="narrow">
        {renderCaption(96)}
        {renderCaption(72)}
        <Spacer />
        {renderCaption(64)}
        {renderCaption(72)}
      </Cell>
    </div>
  )
}

export default ItemBoxSkeleton
