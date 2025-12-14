import {
  CurrencyAmountDto,
  CurrencyAmountModel,
  CurrencyDto,
  CurrencyModel,
} from '../types/currency'

export const transformCurrencyDto = ({
  amount,
  currency_code,
}: CurrencyDto): CurrencyAmountModel => {
  // Todo: update code to use numbers instead of converting to string after vas_api_gateway_swap_bump_minimum_price AB test is finished
  return {
    amount: amount.toString(),
    currencyCode: currency_code,
  }
}

export const transformCurrencyDtoToModel = ({
  amount,
  currency_code,
}: CurrencyDto): CurrencyModel => {
  return {
    amount,
    currencyCode: currency_code,
  }
}

export const transformCurrencyAmountDto = ({
  amount,
  currency_code,
}: CurrencyAmountDto): CurrencyAmountModel => {
  return {
    amount,
    currencyCode: currency_code,
  }
}
