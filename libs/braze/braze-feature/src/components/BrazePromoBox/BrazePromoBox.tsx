'use client'

import { useContext } from 'react'

import { GenericPromoBoxModel } from '@marketplace-web/braze/braze-data'

import BrazeContext from '../../containers/BrazeProvider/BrazeContext'
import PromoBox from '../PromoBox'

type Props = {
  promoBox: GenericPromoBoxModel
}

const BrazePromobox = ({ promoBox }: Props) => {
  const { logCardImpression, logCardClick } = useContext(BrazeContext)

  return (
    <PromoBox
      image={promoBox.imageUrl}
      color={promoBox.backgroundColor}
      url={promoBox.url}
      alt={promoBox.imageAlt}
      impressionUrl={promoBox.impressionUrl}
      onClick={() => promoBox.url && logCardClick(promoBox.id)}
      onEnter={() => logCardImpression(promoBox.id)}
      testId="feed-braze"
    />
  )
}

export default BrazePromobox
