import { Response } from '@marketplace-web/core-api/api-client-util'

import {
  ClosetPromotionPricingModel,
  ClosetPromotionPricingDto,
  ClosetPromotionPricingResp,
} from '../types/closet-promotion-pricing'
import { transformCurrencyDtoToModel } from './currency'

export const transformClosetPromotionPricing = (
  dto: ClosetPromotionPricingDto,
): ClosetPromotionPricingModel => ({
  effectiveDays: dto.effective_days,
  isSalesTaxApplicable: dto.sales_tax_applicable,
  totalPrice: transformCurrencyDtoToModel(dto.total_price),
  discountedPrice: transformCurrencyDtoToModel(dto.discounted_price),
  pricePerDay: transformCurrencyDtoToModel(dto.price_per_day),
})
export const transformClosetPromotionPricingResponse = (
  response: Response<ClosetPromotionPricingResp>,
): ClosetPromotionPricingModel => transformClosetPromotionPricing(response.promoted_closet_pricing)
