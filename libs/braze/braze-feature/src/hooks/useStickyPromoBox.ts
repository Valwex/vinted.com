'use client'

import { PromoBoxType } from '@marketplace-web/braze/braze-data'

import useBrazePromoBoxes from './useBrazePromoBoxes'

const useStickyPromoBox = () => {
  const brazeStickyPromoBox = useBrazePromoBoxes(PromoBoxType.BrazeSticky)[0]
  let wasPromoBoxShown = false

  const getStickyPromoBox = () => {
    if (wasPromoBoxShown) return null
    wasPromoBoxShown = true

    return brazeStickyPromoBox ?? null
  }

  return {
    getStickyPromoBox,
  }
}

export default useStickyPromoBox
