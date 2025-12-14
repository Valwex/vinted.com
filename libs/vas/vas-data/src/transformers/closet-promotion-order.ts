import { Response } from '@marketplace-web/core-api/api-client-util'

import {
  ClosetPromotionOrderModel,
  ClosetPromotionOrderDto,
  PromotedClosetOrderResp,
  PromotedClosetOrderRespSvcVas,
} from '../types/closet-promotion-order'

export const transformClosetPromotionOrder = (
  dto: ClosetPromotionOrderDto,
): ClosetPromotionOrderModel => ({
  id: dto.id,
})

export const transformPrepareClosetPromotionOrderResponse = (
  response: Response<PromotedClosetOrderResp>,
) => transformClosetPromotionOrder(response.closet_promotion.closet_promotion_order)

export const transformPrepareClosetPromotionOrderResponseSvcVas = (
  response: Response<PromotedClosetOrderRespSvcVas>,
) => transformClosetPromotionOrder(response.closet_promotion_order)
