'use client'

import { useIntl } from 'react-intl'

import { useFeatureSwitch } from '@marketplace-web/feature-flags/feature-switches-data'

import { PRESS_CENTER_URL } from '../../constants/routes'

const SUSTAINABILITY_REPORT_LOCALES = ['pl', 'nl', 'de', 'it', 'es']
const PRESS_CENTER_LOCALES = ['en', 'fr', 'lt']

const getSustainablityLandingPageLocaleParam = (activeLocale: string) =>
  SUSTAINABILITY_REPORT_LOCALES.includes(activeLocale) ? `?lang=${activeLocale}` : ''

const getLocaleSubPath = (activeLocale: string) =>
  PRESS_CENTER_LOCALES.includes(activeLocale) ? `/${activeLocale}` : ''

function useCompanyWeb() {
  const isSustainabilityMenuEnabled = useFeatureSwitch('sustainability_page_press_center_link')
  const isPressMenuEnabled = useFeatureSwitch('press_menu')
  const { locale } = useIntl()
  const shortLocale = locale.substring(0, 2)
  const companyWebUrl = `${PRESS_CENTER_URL}${getLocaleSubPath(shortLocale)}`
  const newsroomUrl = `${companyWebUrl}/newsroom`
  const sustainabilityLandingPageUrl = `${companyWebUrl}/sustainability${getSustainablityLandingPageLocaleParam(shortLocale)}`

  return {
    isPressMenuEnabled,
    isSustainabilityMenuEnabled,
    newsroomUrl,
    sustainabilityLandingPageUrl,
  }
}

export default useCompanyWeb
