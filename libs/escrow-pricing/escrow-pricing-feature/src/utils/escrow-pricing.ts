import { EscrowFeesModel, EscrowFees } from '@marketplace-web/escrow-pricing/escrow-pricing-data'
import { CurrencyAmountModel } from '@marketplace-web/currency/currency-data'

export const formatEscrowFeeFallback = (serviceFee: CurrencyAmountModel): EscrowFeesModel => ({
  itemVerification: null,
  electronicsVerification: null,
  shipping: null,
  buyerProtection: {
    discountPercentage: 0,
    finalPrice: serviceFee,
    discount: { amount: '0', currencyCode: serviceFee.amount },
    type: EscrowFees.BuyerProtection,
    isFree: Number(serviceFee.amount) === 0,
    originalPrice: serviceFee,
  },
})
