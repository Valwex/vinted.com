'use client'

import { useCallback, useMemo, useState } from 'react'

import { useSession } from '@marketplace-web/shared/session-data'
import { useAbTest, useTrackAbTestCallback } from '@marketplace-web/feature-flags/ab-tests-data'
import { navigateToPage } from '@marketplace-web/browser/browser-navigation-util'
import { urlWithParams } from '@marketplace-web/browser/url-util'
import { useRefUrl } from '@marketplace-web/ref-url/ref-url-feature'

import { AuthModalContext } from './AuthModalContext'

const SIGNUP_URL = '/member/signup/select_type'

enum AuthModalState {
  Standard = 'standard',
  Business = 'business',
  Closed = 'closed',
}

type Props = {
  children: React.ReactNode
  authModalComponent: () => JSX.Element
}

const AuthModalProvider = ({ children, authModalComponent: AuthModalComponent }: Props) => {
  const userId = useSession().user?.id
  const [authModalState, setAuthModalState] = useState(AuthModalState.Closed)

  const authModalRemovalAbTest = useAbTest('web_auth_modal_removal')
  const trackAbTest = useTrackAbTestCallback()
  const refUrl = useRefUrl()

  const openAuthModal = useCallback(
    ({ isBusiness }: { isBusiness?: boolean } = {}) => {
      if (!isBusiness) {
        trackAbTest(authModalRemovalAbTest)

        if (authModalRemovalAbTest?.variant === 'on') {
          navigateToPage(urlWithParams(SIGNUP_URL, { ref_url: refUrl, track: '1' }))

          return
        }
      }

      setAuthModalState(isBusiness ? AuthModalState.Business : AuthModalState.Standard)
    },
    [authModalRemovalAbTest, refUrl, trackAbTest],
  )

  const closeAuthModal = useCallback(() => {
    setAuthModalState(AuthModalState.Closed)
  }, [])

  const contextValue = useMemo(() => {
    return {
      openAuthModal,
      closeAuthModal,
      isAuthModalOpen: authModalState !== AuthModalState.Closed,
      isBusinessAuth: authModalState === AuthModalState.Business,
    }
  }, [openAuthModal, closeAuthModal, authModalState])

  return (
    <AuthModalContext.Provider value={contextValue}>
      {children}
      {!userId && <AuthModalComponent />}
    </AuthModalContext.Provider>
  )
}

export default AuthModalProvider
