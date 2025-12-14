import { createElement, HTMLElementType } from 'react'

import { ISO_LANGUAGE_CODES } from '@marketplace-web/i18n/i18n-data'

const WHITELISTED_HTML_TAGS: Array<HTMLElementType> = [
  'b',
  'div',
  'i',
  'li',
  'ol',
  'p',
  'span',
  'strong',
  'ul',
  'u',
]

export const defaultInterpolations = WHITELISTED_HTML_TAGS.reduce(
  (accumulator, tag) => {
    accumulator[tag] = (chunks: JSX.Element) => createElement(tag, null, chunks)

    return accumulator
  },
  {} as Record<HTMLElementType, (chunks: JSX.Element) => ReturnType<typeof createElement>>,
)

/**
 * NOTES:
 * Pluralization Rule source of truth is written here https://docs.google.com/document/d/18nvEFey6tZ5vfjdGnQ3Ywpv3geazW0TKueMqKtv-Dgk/edit?tab=t.0"
 */

export enum PluralizeSuffix {
  Zero = 'zero',
  One = 'one',
  Two = 'two',
  Few = 'few',
  Other = 'other',
}

const { Zero, One, Two, Few, Other } = PluralizeSuffix

type Pluralize = (count: number) => string

const ltPluralize: Pluralize = count => {
  if (count % 10 === 1 && count % 100 !== 11) return One

  return [2, 3, 4, 5, 6, 7, 8, 9].includes(count % 10) &&
    ![11, 12, 13, 14, 15, 16, 17, 18, 19].includes(count % 100)
    ? Few
    : Other
}

const czPluralize: Pluralize = count => {
  if (count === 1) return One

  return [2, 3, 4].includes(count) ? Few : Other
}

const plPluralize: Pluralize = count => {
  if (count % 10 === 1 && count % 100 !== 11) return One

  return [2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100) ? Few : Other
}

const slPluralize: Pluralize = count => {
  if (count % 10 === 1 && count % 100 !== 11) return One
  if (count % 10 === 2 && ![12, 13, 14].includes(count % 100)) return Two
  if (count % 10 === 3 && ![13, 14].includes(count % 100)) return Few

  return Other
}

const lvPluralize: Pluralize = count => {
  const lastDigit = count % 10
  const lastTwoDigits = count % 100
  if (count === 0) return Zero
  if (lastDigit === 1 && lastTwoDigits !== 11) return One
  if (lastDigit >= 2 && lastDigit <= 9 && !(lastTwoDigits >= 10 && lastTwoDigits <= 19)) return Few

  return Other
}

const roPluralize: Pluralize = count => {
  if (count === 1) return One

  return count >= 20 ? Other : Few
}

const huPluralize: Pluralize = () => One

const frPluralize: Pluralize = count => (count <= 1 ? One : Other)

const skPluralize: Pluralize = count => {
  if (count === 1) return One

  return [2, 3, 4].includes(count) ? 'few' : 'other'
}

const hrPluralize: Pluralize = count => {
  if (count === 1) return One

  return [2, 3, 4].includes(count) ? Few : Other
}

const defaultPluralize: Pluralize = count => (count === 1 ? One : Other)

const { lt, cs, pl, ro, hu, fr, sk, hr, sl, lv } = ISO_LANGUAGE_CODES

const pluralFunctionMap: Record<string, Pluralize> = {
  [lt]: ltPluralize,
  [cs]: czPluralize,
  [pl]: plPluralize,
  [ro]: roPluralize,
  [hu]: huPluralize,
  [fr]: frPluralize,
  [sk]: skPluralize,
  [hr]: hrPluralize,
  [sl]: slPluralize,
  [lv]: lvPluralize,
}

export const pluralization = (locale: string) => {
  const pluralizationFunction = pluralFunctionMap[locale]

  return pluralizationFunction ?? defaultPluralize
}
