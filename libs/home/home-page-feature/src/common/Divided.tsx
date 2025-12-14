import { ReactNode } from 'react'

import {
  BlockEntityType,
  SINGLE_SLOT_BLOCKS,
  TWO_SLOT_BLOCKS,
} from '@marketplace-web/home/home-page-data'

type Props = {
  children: ReactNode
  previousBlockType?: BlockEntityType
  nextBlockType?: BlockEntityType
}

const isPartialWidthBlock = (type?: BlockEntityType) =>
  type && (SINGLE_SLOT_BLOCKS.includes(type) || TWO_SLOT_BLOCKS.includes(type))

const Divided = ({ children, previousBlockType, nextBlockType }: Props) => {
  const greySpacer = (
    <div className="u-ui-padding-bottom-large@portables u-background-light u-breakout" />
  )

  return (
    <>
      {isPartialWidthBlock(previousBlockType) && greySpacer}
      {children}
      {isPartialWidthBlock(nextBlockType) && greySpacer}
    </>
  )
}

export default Divided
