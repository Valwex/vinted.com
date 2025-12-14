import { useCallback, useRef } from 'react'

import { initiateSingleCheckout, CheckoutOrderType } from '@marketplace-web/checkout/checkout-data'
import { useDataDomeCaptcha } from '@marketplace-web/bot-detection/data-dome-feature'
import { useIncogniaTracking } from '@marketplace-web/bot-detection/incognia-feature'

import { navigateToSingleCheckout, removeCheckoutItemScrollOnLoadMark } from '../utils/utils'

const useNavigateToCheckout = () => {
  const pendingTransactionIdRef = useRef<number | undefined>(undefined)
  const pendingOrderTypeRef = useRef<CheckoutOrderType | undefined>(undefined)
  const { getIncogniaRequestHeaders } = useIncogniaTracking()

  const navigateToCheckout = useCallback(
    async (orderId: number, orderType: CheckoutOrderType) => {
      pendingTransactionIdRef.current = orderId
      pendingOrderTypeRef.current = orderType

      removeCheckoutItemScrollOnLoadMark()

      const response = await initiateSingleCheckout(
        {
          id: orderId.toString(),
          type: orderType,
        },
        { headers: await getIncogniaRequestHeaders() },
      )

      if ('errors' in response) {
        return true
      }

      return navigateToSingleCheckout(response.checkout.id, orderId, orderType)
    },
    [getIncogniaRequestHeaders],
  )

  const navigateToExistingCheckout = (
    checkoutId: string,
    orderId: number,
    orderType: CheckoutOrderType,
  ) => {
    navigateToSingleCheckout(checkoutId, orderId, orderType)
  }

  useDataDomeCaptcha(() => {
    if (pendingTransactionIdRef.current === undefined) return
    if (pendingOrderTypeRef.current === undefined) return

    navigateToCheckout(pendingTransactionIdRef.current, pendingOrderTypeRef.current)
  })

  return { navigateToCheckout, navigateToExistingCheckout }
}

export default useNavigateToCheckout
