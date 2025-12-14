'use client'

import { useContext, useMemo, useSyncExternalStore } from 'react'

import { PromoBoxType, transformBrazePromoBoxCardDto } from '@marketplace-web/braze/braze-data'

import BrazeContext from '../containers/BrazeProvider/BrazeContext'

function useBrazePromoBoxes(type: PromoBoxType.BrazeSticky | PromoBoxType.Braze) {
  const { promoBoxCardStore } = useContext(BrazeContext)

  const promoBoxCards = useSyncExternalStore(
    promoBoxCardStore.subscribe,
    () => promoBoxCardStore.state,
    () => null,
  )

  return useMemo(
    () =>
      promoBoxCards
        ?.map(transformBrazePromoBoxCardDto)
        .filter(promoBox => promoBox.type === type) ?? [],
    [promoBoxCards, type],
  )
}

export default useBrazePromoBoxes
