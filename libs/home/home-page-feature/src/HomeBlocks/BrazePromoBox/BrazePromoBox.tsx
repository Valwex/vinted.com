'use client'

import { BrazePromoBox as BrazePromoBoxComponent } from '@marketplace-web/braze/braze-feature'
import { GenericPromoBoxModel } from '@marketplace-web/braze/braze-data'

import ItemArrangement from '../../common/ItemArrangement'

type Props = {
  position: number
  promoBox: GenericPromoBoxModel
  brazePromoBoxes: Array<GenericPromoBoxModel>
}

const BrazePromoBox = (props: Props) => {
  return (
    <ItemArrangement {...props}>
      <BrazePromoBoxComponent promoBox={props.promoBox} />
    </ItemArrangement>
  )
}

export default BrazePromoBox
