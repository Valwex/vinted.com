import { Response } from '@marketplace-web/core-api/api-client-util'

import { transformCurrencyAmountDto } from './currency-amount'
import {
  EscrowFeesModel,
  NonShippingEscrowFeeEntity,
  ShippingFeeEntity,
  EscrowFeesDto,
  GetItemEscrowFeesResp,
} from '../types/escrow-fees'
import { EscrowFees } from '../constants/escrow-fees'

const isFree = (fee: NonShippingEscrowFeeEntity | ShippingFeeEntity): boolean =>
  !!fee?.final_price?.amount && Number(fee.final_price.amount) === 0

const transformNonShippingEscrowFee = (fee: NonShippingEscrowFeeEntity) => ({
  originalPrice: transformCurrencyAmountDto(fee.original_price),
  finalPrice: transformCurrencyAmountDto(fee.final_price),
  discount: transformCurrencyAmountDto(fee.discount),
  discountPercentage: fee.discount_percentage,
  isFree: isFree(fee),
  discountStartDate: fee.discount_rule?.start_date,
  discountEndDate: fee.discount_rule?.end_date,
  lowestPrice30Days:
    fee.lowest_price_30_days && transformCurrencyAmountDto(fee.lowest_price_30_days),
  landingPageUri: fee.discount_rule?.landing_page_uri,
  showPriceRangeRuleNote: !!fee.discount_rule?.additional_info?.show_price_range_rule_note,
})

export const transformBuyerProtectionFee = (buyerProtection: NonShippingEscrowFeeEntity | null) => {
  if (!buyerProtection) return null

  return {
    ...transformNonShippingEscrowFee(buyerProtection),
    type: EscrowFees.BuyerProtection,
  }
}

export const transformItemVerificationFee = (
  itemVerification: NonShippingEscrowFeeEntity | null,
) => {
  if (!itemVerification) return null

  return {
    ...transformNonShippingEscrowFee(itemVerification),
    type: EscrowFees.ItemVerification,
    landingPageUri: itemVerification.discount_rule?.landing_page_uri,
  }
}

export const transformShippingFee = (shipping?: ShippingFeeEntity) => {
  if (!shipping) return null

  return {
    type: EscrowFees.Shipping,
    originalPrice: transformCurrencyAmountDto(shipping.original_price),
    finalPrice: transformCurrencyAmountDto(shipping.final_price),
    discount: transformCurrencyAmountDto(shipping.discount),
    maxDiscountPercentage: shipping.pricing_rule?.additional_info?.max_discount_percentage,
    discountPercentage: shipping.discount_percentage,
    isFree: isFree(shipping),
  }
}

export const transformElectronicsVerificationFee = (
  electronicsVerification: NonShippingEscrowFeeEntity | null,
) => {
  if (!electronicsVerification) return null

  return {
    ...transformNonShippingEscrowFee(electronicsVerification),
    type: EscrowFees.ElectronicsVerification,
  }
}

export const transformEscrowFees = (dto: EscrowFeesDto): EscrowFeesModel => ({
  buyerProtection: transformBuyerProtectionFee(dto[EscrowFees.BuyerProtection]),
  itemVerification: transformItemVerificationFee(dto[EscrowFees.ItemVerification]),
  shipping: transformShippingFee(dto[EscrowFees.Shipping]),
  electronicsVerification: transformElectronicsVerificationFee(
    dto[EscrowFees.ElectronicsVerification],
  ),
  noteTranslationKey: dto[EscrowFees.Note]?.web_note_key,
})

export const transformItemEscrowFeesResponse = (response: Response<GetItemEscrowFeesResp>) =>
  transformEscrowFees(response.escrow_fees)
