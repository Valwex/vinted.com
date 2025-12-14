import { useMemo } from 'react'

import {
  HomepageBlockEntityModel,
  SINGLE_SLOT_BLOCKS,
  TWO_SLOT_BLOCKS,
} from '@marketplace-web/home/home-page-data'

import useColumnCount from './useColumnCount'

type BlockArray = Array<HomepageBlockEntityModel>

// TODO refactor this hook to calculate slots dynamically without handling each block width separately
const useRemoveEmptySlots = (blocks: BlockArray) => {
  const columnCount = useColumnCount()

  const blocksWithoutEmptySlots = useMemo(() => {
    const result: BlockArray = []
    let fullWidthBlocks: BlockArray = []
    let deferredTwoSlotBlocks: BlockArray = []
    let currentRow: BlockArray = []
    let currentRowSlots = 0

    blocks.forEach(block => {
      const isSingleSlotBlock = SINGLE_SLOT_BLOCKS.includes(block.type)
      const isTwoSlotBlock = TWO_SLOT_BLOCKS.includes(block.type)

      if (isSingleSlotBlock || isTwoSlotBlock) {
        const slotsNeeded = isTwoSlotBlock ? 2 : 1
        const wouldOverflow = currentRowSlots + slotsNeeded > columnCount

        // If adding this block would overflow, defer it
        if (wouldOverflow && currentRow.length > 0) {
          if (isTwoSlotBlock) {
            deferredTwoSlotBlocks.push(block)
          } else {
            fullWidthBlocks.push(block)
          }

          return
        }

        currentRow.push(block)
        currentRowSlots += slotsNeeded

        const isRowFilled = currentRowSlots >= columnCount
        if (isRowFilled) {
          result.push(...currentRow)
          result.push(...fullWidthBlocks)

          // Deferred 2-slot blocks start a new row
          currentRow = deferredTwoSlotBlocks
          currentRowSlots = deferredTwoSlotBlocks.length * 2
          fullWidthBlocks = []
          deferredTwoSlotBlocks = []
        }

        return
      }

      const isRowEmpty = currentRow.length === 0

      if (isRowEmpty) {
        result.push(block)
      } else {
        fullWidthBlocks.push(block)
      }
    })

    if (currentRow.length === 0) {
      result.push(...fullWidthBlocks)
    } else {
      // Incomplete row - only push the row items, discard full-width blocks
      result.push(...currentRow)
    }

    return result
  }, [blocks, columnCount])

  return blocksWithoutEmptySlots
}

export default useRemoveEmptySlots
