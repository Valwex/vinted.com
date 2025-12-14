import { CurrencyAmountDto, CurrencyAmountModel } from '../types/currency-amount'

export const transformCurrencyAmountDto = ({
  amount,
  currency_code,
}: CurrencyAmountDto): CurrencyAmountModel => {
  return {
    amount,
    currencyCode: currency_code,
  }
}
