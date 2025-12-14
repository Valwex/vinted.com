import { CurrencyAmountModel } from '../types/currency-amount'

type IntlProps = {
  locale: string
  currency: string
}

type AmountProps = {
  maxLength?: number
}

type CurrencyFormatParams = {
  formatAsNegative?: boolean
  keepFractionDigits?: boolean
}

const DEFAULT_CURRENCY_FORMAT_PARAMS: Required<CurrencyFormatParams> = {
  formatAsNegative: false,
  keepFractionDigits: true,
}

const NO_FRACTION_DIGITS_CURRENCY_OPTIONS: Partial<Intl.NumberFormatOptions> = {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
}

const formatCurrency = (
  rawValue: string | number | null | undefined,
  props: IntlProps,
  params?: CurrencyFormatParams,
) => {
  const { locale, currency } = props
  const { formatAsNegative, keepFractionDigits } = {
    ...DEFAULT_CURRENCY_FORMAT_PARAMS,
    ...params,
  }

  const value = rawValue || 0
  const numberValue = formatAsNegative ? Number(value) * -1 : Number(value)

  const fractionDigitsSetup = !keepFractionDigits && NO_FRACTION_DIGITS_CURRENCY_OPTIONS

  return new Intl.NumberFormat(locale, {
    currency,
    style: 'currency',
    useGrouping: false,
    ...fractionDigitsSetup,
  }).format(numberValue)
}

const formatCurrencyAmount = (
  rawValue: CurrencyAmountModel,
  locale: string,
  params?: CurrencyFormatParams,
) => {
  return formatCurrency(rawValue.amount, { locale, currency: rawValue.currencyCode }, params)
}

const formatAmount = (value: string | null | undefined, props?: AmountProps) => {
  if (!value) return null

  const decimalMaxLength = 3
  let maxLength = 5
  let formattedValue = value

  if (formattedValue === '.') formattedValue = '0.00'
  if (props?.maxLength) ({ maxLength } = props)

  formattedValue = formattedValue.replace(/,/g, '.')
  formattedValue = formattedValue.replace(/[^0-9.]/g, '')
  formattedValue = formattedValue.replace(/\.+/g, '.')
  formattedValue = formattedValue.replace(/(.*\.[0-9][0-9]?).*/g, '$1')
  formattedValue = formattedValue.replace(/^0+(.*)$/, '0$1')

  if (formattedValue.indexOf('.') !== -1) {
    let amount = formattedValue.substring(0, formattedValue.indexOf('.'))
    let cents = formattedValue.substring(formattedValue.indexOf('.'))

    if (amount.length > maxLength) {
      amount = amount.substring(0, maxLength)
    }

    if (cents.length > decimalMaxLength) {
      cents = cents.substring(0, decimalMaxLength)
    }

    formattedValue = `${amount}${cents}`
  } else if (formattedValue.length > maxLength) {
    if (formattedValue[maxLength + 1] === '.') {
      formatAmount(formattedValue, props)
    } else {
      formattedValue = formattedValue.substring(0, maxLength)
    }
  }

  return formattedValue
}

export { formatCurrency, formatCurrencyAmount, formatAmount }
