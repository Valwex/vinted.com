'use client'

import { useState } from 'react'

import { isResponseSuccessful } from '@marketplace-web/core-api/api-client-util'
import {
  useBrowserNavigation,
  redirectToPage,
} from '@marketplace-web/browser/browser-navigation-util'
import { cookiesDataByName, useCookie } from '@marketplace-web/environment/cookies-util'
import { useTracking } from '@marketplace-web/observability/event-tracker-data'
import { useSession } from '@marketplace-web/shared/session-data'
import {
  LanguageDto,
  updateUserLanguage,
  changeLanguageEvent,
} from '@marketplace-web/language/language-data'

import { removeLocaleUrlParam } from './utils'

type Props = {
  activeLanguage: LanguageDto
  setActiveLanguage: (language: LanguageDto) => void
}

const useLanguageSelector = ({ activeLanguage, setActiveLanguage }: Props) => {
  const { user, screen } = useSession()
  const userId = user?.id

  const cookies = useCookie()

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { relativeUrl, urlQuery } = useBrowserNavigation()
  const { track } = useTracking()

  const hideMenu = () => {
    setIsMenuOpen(false)
  }

  const toggleMenu = () => {
    setIsMenuOpen(prevState => !prevState)
  }

  const saveLanguage = async (language: LanguageDto) => {
    hideMenu()

    track(
      changeLanguageEvent({
        fromLanguage: activeLanguage?.code || null,
        toLanguage: language.code,
        screen,
      }),
    )

    if (userId) {
      const response = await updateUserLanguage({ userId, locale: language.code })

      if (!isResponseSuccessful(response)) return
    } else {
      cookies.set(cookiesDataByName['anonymous-locale'], language.code)
    }

    setActiveLanguage(language)

    cookies.delete(cookiesDataByName.locale)
    redirectToPage(removeLocaleUrlParam(relativeUrl, urlQuery))
  }

  return {
    isMenuOpen,
    toggleMenu,
    hideMenu,
    saveLanguage,
  }
}

export default useLanguageSelector
