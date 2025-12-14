const COMMON_TEXTS_CODES = [
  'catalog-rules',
  'old-catalog-rules',
  'impressum',
  'terms_and_conditions',
  'pass-recomendations',
  'old-terms-and-conditions',
  'pricelist',
  'cookie-policy',
  'mp-terms-and-conditions',
  'terms_and_conditions_updates',
  'safety_policy',
  'referrals-terms',
  'versandkosten-und-lieferbedingungen',
  'chrono-terms-and-conditions',
  'our-platform',
  'popo-terms',
  'privacy_policy',
  'privacy_policy_2',
  'privacy_policy_3',
  'privacy_policy_4',
  'privacy_policy_5',
  'relais-colis-terms',
  'pro_terms_of_use',
  'privacy_policy_accordion',
  'pro_terms_of_sale',
  'pro_guide',
  'old-terms-and-conditions-2',
  'terms_and_conditions_2',
  'terms_and_conditions_3',
  'terms_and_conditions_4',
  'pro_terms_of_use_2',
  'pro_terms_of_sale_2',
  'pro_terms_of_use_3',
  'our-platform-2',
  'pro_guide_2',
  'privacy_policy_6',
  'privacy_policy_7',
  'privacy_policy_accordion_2',
  'research-terms',
  'old_pro_terms_of-use',
  'pro_terms_and_conditions_updates',
  'old_pro_terms_of_use_2',
  'old_pro_terms_of_use_3',
  'colis-prive-terms',
  'vlocker-privacy-policy',
  'old-privacy-policy',
  'old-privacy-policy-2',
] as const

export type CommonTextCode = (typeof COMMON_TEXTS_CODES)[number]

const COMMON_TEXTS = COMMON_TEXTS_CODES.reduce<Record<string, CommonTextCode>>(
  (accumulator, code) => {
    accumulator[code.replace(/_/g, '-').toLowerCase()] = code

    return accumulator
  },
  {},
)

export const COMMON_TEXT_PATH_REGEXPS = Object.keys(COMMON_TEXTS).map(path => `^/${path}$` as const)
