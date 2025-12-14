'use client'

import { useCallback, useEffect, useState } from 'react'

import { useFetch } from '@marketplace-web/core-api/api-client-util'
import { useBrowserNavigation } from '@marketplace-web/browser/browser-navigation-util'
import { useTracking } from '@marketplace-web/observability/event-tracker-data'
import { UiState } from '@marketplace-web/shared/ui-state-util'
import { removeParamsFromQuery } from '@marketplace-web/browser/url-util'
import { useAbTest, useTrackAbTestCallback } from '@marketplace-web/feature-flags/ab-tests-data'
import {
  clickEvent,
  prepareClosetPromotionOrder,
  transformPrepareClosetPromotionOrderResponse,
  transformClosetPromotionPricingResponse,
  getClosetPromotionPricing,
  prepareClosetPromotionOrderSvcVas,
  transformPrepareClosetPromotionOrderResponseSvcVas,
} from '@marketplace-web/vas/vas-data'

import {
  CheckoutOrderTypeMap,
  ExtraServiceOrderType,
  viewSingleCheckoutEvent,
} from '@marketplace-web/checkout/checkout-data'
import {
  GenericErrorModal,
  useNavigateToCheckout,
} from '@marketplace-web/checkout/checkout-feature'

import { PreCheckoutModal } from '../../constants/closet-promotion'
import ClosetPromotionDynamicPricingInfoModal from './ClosetPromotionDynamicPricingInfoModal'
import ClosetPromotionPreCheckoutHelpModal from './ClosetPromotionPreCheckoutHelpModal'
import ClosetPromotionPreCheckoutModal from './ClosetPromotionPreCheckoutModal'

type Props = {
  isOpen: boolean
  handlePrecheckoutClose: () => void
}

const ClosetPromotionCheckout = ({ isOpen, handlePrecheckoutClose }: Props) => {
  const { track } = useTracking()
  const { cp_precheckout: closetPromotionPrecheckoutParam } = useBrowserNavigation().searchParams
  const { replaceHistoryState, relativeUrl, urlQuery } = useBrowserNavigation()
  const trackExpose = useTrackAbTestCallback()

  const vasApiGatewaySwapPromotedClosetsOrdersAbTest = useAbTest(
    'vas_api_gateway_swap_promoted_closets_orders',
  )
  const isVasApiGatewaySwapPromotedClosetsOrdersAbTestOn =
    vasApiGatewaySwapPromotedClosetsOrdersAbTest?.variant === 'on'

  const { navigateToCheckout } = useNavigateToCheckout()

  const [uiState, setUiState] = useState(UiState.Idle)
  const [activeModal, setActiveModal] = useState<PreCheckoutModal>(PreCheckoutModal.None)

  const {
    fetch: fetchClosetPromotionPricing,
    transformedData: closetPromotionPricing,
    isLoading: isClosetPromotionPricingLoading,
    error: closetPromotionPricingError,
  } = useFetch(getClosetPromotionPricing, transformClosetPromotionPricingResponse)

  const {
    fetch: prepareOrderCore,
    transformedData: orderCore,
    error: orderErrorCore,
  } = useFetch(prepareClosetPromotionOrder, transformPrepareClosetPromotionOrderResponse)

  const {
    fetch: prepareOrderSvcVas,
    transformedData: orderSvcVas,
    error: orderErrorSvcVas,
  } = useFetch(
    prepareClosetPromotionOrderSvcVas,
    transformPrepareClosetPromotionOrderResponseSvcVas,
  )

  const prepareOrder = isVasApiGatewaySwapPromotedClosetsOrdersAbTestOn
    ? prepareOrderSvcVas
    : prepareOrderCore
  const order = isVasApiGatewaySwapPromotedClosetsOrdersAbTestOn ? orderSvcVas : orderCore
  const orderError = isVasApiGatewaySwapPromotedClosetsOrdersAbTestOn
    ? orderErrorSvcVas
    : orderErrorCore

  useEffect(() => {
    if (activeModal !== PreCheckoutModal.PreCheckout) return
    if (closetPromotionPricing) return

    fetchClosetPromotionPricing()
  }, [fetchClosetPromotionPricing, activeModal, closetPromotionPricing])

  useEffect(
    function startPreCheckoutFromParam() {
      if (closetPromotionPrecheckoutParam !== 'true') return

      setActiveModal(PreCheckoutModal.PreCheckout)
    },
    [closetPromotionPrecheckoutParam],
  )

  useEffect(
    function startPreCheckoutFromProp() {
      if (!isOpen) return

      setActiveModal(PreCheckoutModal.PreCheckout)
    },
    [isOpen],
  )

  useEffect(
    function setErrorModal() {
      if (!orderError && !closetPromotionPricingError) return

      setUiState(UiState.Failure)

      setActiveModal(PreCheckoutModal.GenericErrorModal)
    },
    [orderError, closetPromotionPricingError],
  )

  const orderId = order?.id
  const orderType = CheckoutOrderTypeMap[ExtraServiceOrderType.ClosetPromotion]

  const fetchCheckoutId = useCallback(async () => {
    if (!orderId) return

    track(
      viewSingleCheckoutEvent({
        checkoutId: null,
        orderId: orderId.toString(),
        orderType,
      }),
    )

    const isError = await navigateToCheckout(orderId, orderType)

    if (isError) {
      setUiState(UiState.Failure)

      setActiveModal(PreCheckoutModal.GenericErrorModal)
    }
  }, [navigateToCheckout, orderId, orderType, track])

  useEffect(
    function startCheckoutAfterOrderPrepare() {
      if (!order) return
      if (!orderId) return

      track(
        clickEvent({
          screen: 'closet_promo_prepare',
          target: 'review_closet_promo_order',
          targetDetails: order.id.toString(),
        }),
      )

      fetchCheckoutId()
    },
    [order, orderId, track, fetchCheckoutId],
  )

  function openPreCheckoutModal() {
    setActiveModal(PreCheckoutModal.PreCheckout)
  }

  function openDynamicPricingInfoModal() {
    setActiveModal(PreCheckoutModal.DynamicPricingInfo)

    track(
      clickEvent({
        screen: 'closet_promo_prepare',
        target: 'dynamic_pricing_info',
      }),
    )
  }

  function closeCheckoutModal() {
    if (closetPromotionPrecheckoutParam === 'true') {
      const urlWithoutParam = removeParamsFromQuery(relativeUrl, urlQuery, ['cp_precheckout'])
      replaceHistoryState(urlWithoutParam)
    }
    setActiveModal(PreCheckoutModal.None)
    handlePrecheckoutClose()
  }

  function handlePreCheckoutConfirm() {
    setUiState(UiState.Pending)

    prepareOrder()
    trackExpose(vasApiGatewaySwapPromotedClosetsOrdersAbTest)
  }

  function handlePreCheckoutPreview() {
    track(
      clickEvent({
        screen: 'closet_promo_prepare',
        target: 'how_its_working',
      }),
    )

    setActiveModal(PreCheckoutModal.PreCheckoutHelp)
  }

  return (
    <>
      <ClosetPromotionPreCheckoutModal
        pricing={closetPromotionPricing}
        isPricingLoading={isClosetPromotionPricingLoading}
        isOrderLoading={uiState === UiState.Pending}
        show={activeModal === PreCheckoutModal.PreCheckout}
        onNextAction={handlePreCheckoutConfirm}
        onPreview={handlePreCheckoutPreview}
        onDynamicPricingInfo={openDynamicPricingInfoModal}
        onBack={closeCheckoutModal}
      />
      <ClosetPromotionPreCheckoutHelpModal
        show={activeModal === PreCheckoutModal.PreCheckoutHelp}
        onBack={openPreCheckoutModal}
      />
      <ClosetPromotionDynamicPricingInfoModal
        show={activeModal === PreCheckoutModal.DynamicPricingInfo}
        onBack={openPreCheckoutModal}
      />
      <GenericErrorModal
        isShown={activeModal === PreCheckoutModal.GenericErrorModal}
        onClose={closeCheckoutModal}
      />
    </>
  )
}

export default ClosetPromotionCheckout
