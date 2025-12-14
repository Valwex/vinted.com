'use client'

import { useContext, useRef } from 'react'

import { GenericPromoBoxModel, PromoBoxType } from '@marketplace-web/braze/braze-data'

import BrazeContext from '../containers/BrazeProvider/BrazeContext'

const useBrazePromoBoxTracking = (promoBox: GenericPromoBoxModel | null) => {
  const { logCardImpression, logCardClick } = useContext(BrazeContext)
  const wasPromoBoxSeen = useRef(false)

  function handlePromoBoxVisibility() {
    if (!promoBox) return

    switch (promoBox.type) {
      case PromoBoxType.BrazeSticky: {
        logCardImpression(promoBox.id)
        break
      }
      // TODO move floating promobox tracking here (PromoBoxType.Braze)
      default:
        break
    }

    wasPromoBoxSeen.current = true
  }

  function handlePromoBoxClick() {
    if (!promoBox) return

    switch (promoBox.type) {
      case PromoBoxType.BrazeSticky: {
        logCardClick(promoBox.id)
        break
      }
      default:
        break
    }
  }

  return {
    handlePromoBoxVisibility,
    handlePromoBoxClick,
  }
}

export default useBrazePromoBoxTracking
