import { times } from 'lodash'

import { ItemBoxSkeleton } from '@marketplace-web/item-box/item-box-feature'

const HomeSkeleton = () => {
  const renderItemSkeleton = (index: number) => {
    return (
      <div className="homepage-blocks__item homepage-blocks__item--one-fifth" key={index}>
        <ItemBoxSkeleton />
      </div>
    )
  }

  return (
    <div className="homepage-blocks" data-testid="homepage-skeleton">
      {times(20, renderItemSkeleton)}
    </div>
  )
}

export default HomeSkeleton
