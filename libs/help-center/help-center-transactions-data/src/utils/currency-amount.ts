import { isString } from 'lodash'

import { CurrencyAmountDto } from '../types/currency-amount'

export const isCurrencyAmountDto = (
  value?: CurrencyAmountDto | string | null,
): value is CurrencyAmountDto => !!value && !isString(value)
