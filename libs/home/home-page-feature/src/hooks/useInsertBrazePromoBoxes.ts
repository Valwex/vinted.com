import { useMemo } from 'react'

import {
  BlockEntityType,
  HomepageBlockEntityModel,
  SINGLE_SLOT_BLOCKS,
} from '@marketplace-web/home/home-page-data'
import { useFloatingPromoBox, isPromoBoxIndex } from '@marketplace-web/braze/braze-feature'

type Props = {
  blocks: Array<HomepageBlockEntityModel>
  isFeedPromoBoxEnabled: boolean
}

const useInsertBrazePromoBoxes = ({ blocks, isFeedPromoBoxEnabled }: Props) => {
  const { getFloatingPromoBox } = useFloatingPromoBox()

  const blocksWithPromoBoxes = useMemo(() => {
    if (!isFeedPromoBoxEnabled) return blocks

    const result: Array<HomepageBlockEntityModel> = []
    let feedItemIndex = 0

    function push(block: HomepageBlockEntityModel) {
      if (SINGLE_SLOT_BLOCKS.includes(block.type)) feedItemIndex += 1
      result.push(block)
    }

    blocks.forEach(block => {
      if (isPromoBoxIndex(feedItemIndex)) {
        const entity = getFloatingPromoBox(feedItemIndex)
        if (entity) push({ type: BlockEntityType.BrazePromobox, entity })
      }

      push(block)
    })

    return result
  }, [blocks, getFloatingPromoBox, isFeedPromoBoxEnabled])

  return blocksWithPromoBoxes
}

export default useInsertBrazePromoBoxes
