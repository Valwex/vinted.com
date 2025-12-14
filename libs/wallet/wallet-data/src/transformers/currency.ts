import { CurrencyAmountDto, CurrencyAmountModel } from '../types/currency'

export const transformCurrencyAmountDto = ({
  amount,
  currency_code,
}: CurrencyAmountDto): CurrencyAmountModel => {
  return {
    amount,
    currencyCode: currency_code,
  }
}
