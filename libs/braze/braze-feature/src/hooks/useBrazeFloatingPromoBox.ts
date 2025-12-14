'use client'

import { useCallback } from 'react'

import {
  PROMO_BOX_INDEX_IN_FEED_ROW,
  PROMO_BOX_PAGE_LENGTH,
  PromoBoxType,
} from '@marketplace-web/braze/braze-data'

import useBrazePromoBoxes from './useBrazePromoBoxes'

export const isPromoBoxIndex = (index: number) =>
  (index - PROMO_BOX_INDEX_IN_FEED_ROW) % PROMO_BOX_PAGE_LENGTH === 0

export const useFloatingPromoBox = () => {
  const promoBoxes = useBrazePromoBoxes(PromoBoxType.Braze)

  const getFloatingPromoBox = useCallback(
    (index: number) => promoBoxes.find(promo => promo.position === index && !promo.isControl),
    [promoBoxes],
  )

  return { getFloatingPromoBox }
}
