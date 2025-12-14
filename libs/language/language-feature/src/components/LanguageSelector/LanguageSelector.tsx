'use client'

import { useState, useEffect } from 'react'
import { useIntl } from 'react-intl'

import { getLanguages, LanguageDto } from '@marketplace-web/language/language-data'

import LanguageSelectorDropdown from './LanguageSelectorDropdown'
import LanguageSelectorModal from './LanguageSelectorModal'

type Props = {
  isStandalone?: boolean
  initialLanguages?: Array<LanguageDto>
}

const getActiveLanguage = (languages: Array<LanguageDto>, locale: string) => {
  const currentLanguage = languages.find(language => language.current)
  const defaultLanguage = languages.find(language => language.code === locale)

  return currentLanguage || defaultLanguage
}

const LanguageSelector = ({ isStandalone = false, initialLanguages = [] }: Props) => {
  const { locale } = useIntl()
  const activeLang = getActiveLanguage(initialLanguages, locale)

  const [languages, setLanguages] = useState<Array<LanguageDto>>(initialLanguages)
  const [activeLanguage, setActiveLanguage] = useState<LanguageDto | null>(activeLang || null)

  useEffect(() => {
    const loadLanguages = async () => {
      if (languages.length) return

      const response = await getLanguages()

      if ('errors' in response) return

      const remoteActiveLanguage = getActiveLanguage(response.languages, locale)

      if (remoteActiveLanguage) {
        setActiveLanguage(remoteActiveLanguage)
      }

      setLanguages(response.languages)
    }

    loadLanguages()
  }, [locale, languages])

  if (languages.length <= 1 || !activeLanguage) return null

  return (
    <>
      <div className="u-mobiles-only">
        <LanguageSelectorModal
          languages={languages}
          activeLanguage={activeLanguage}
          setActiveLanguage={setActiveLanguage}
          isStandalone={isStandalone}
        />
      </div>
      <div className="u-desktops-only">
        <LanguageSelectorDropdown
          languages={languages}
          activeLanguage={activeLanguage}
          setActiveLanguage={setActiveLanguage}
        />
      </div>
    </>
  )
}

export default LanguageSelector
