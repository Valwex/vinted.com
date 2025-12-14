import { CurrencyAmountDto, CurrencyAmountModel } from '../types/currency-amount'
import { isCurrencyAmountDto } from '../utils/currency-amount'

const transformCurrencyAmountDto = ({
  amount,
  currency_code,
}: CurrencyAmountDto): CurrencyAmountModel => {
  return {
    amount,
    currencyCode: currency_code,
  }
}

export const transformCurrencyAmountDtoOrString = (
  dtoOrString: CurrencyAmountDto | string,
  fallbackCurrencyCode: string,
): CurrencyAmountModel => {
  if (isCurrencyAmountDto(dtoOrString)) return transformCurrencyAmountDto(dtoOrString)

  return {
    amount: dtoOrString,
    currencyCode: fallbackCurrencyCode,
  }
}
