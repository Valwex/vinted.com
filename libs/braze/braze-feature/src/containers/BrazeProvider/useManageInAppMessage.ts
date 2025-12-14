import { useEffect } from 'react'

import { WHITELISTING_RULES } from '@marketplace-web/braze/braze-data'
import { useBrowserNavigation } from '@marketplace-web/browser/browser-navigation-util'
import { cookiesDataByName, useCookie } from '@marketplace-web/environment/cookies-util'
import { UiState } from '@marketplace-web/shared/ui-state-util'

import { InAppMessageProvider } from '../../providers'

const isPathWhitelisted = (path: string) =>
  WHITELISTING_RULES.some(rule => new RegExp(rule).test(path))

export default function useManageInAppMessage(
  inAppMessageProvider: InAppMessageProvider | undefined,
) {
  const { relativeUrl, urlParams, searchParams } = useBrowserNavigation()
  const cookies = useCookie()

  const isShowingOnboardingModal = urlParams.onboarding_modal_status === 'shown'
  const couldOnboardingModalBeShown =
    cookies.get(cookiesDataByName.banners_ui_state) === UiState.Pending
  const isProfilePromoShown = !!searchParams.promo_shown

  const isAnyModalShown =
    isShowingOnboardingModal || couldOnboardingModalBeShown || isProfilePromoShown
  const shouldEnable = isPathWhitelisted(relativeUrl) && !isAnyModalShown

  useEffect(() => {
    if (!inAppMessageProvider) return

    if (shouldEnable) {
      inAppMessageProvider.enable()
      inAppMessageProvider.publishStoredMessages()
    } else {
      inAppMessageProvider.disable()
    }
  }, [inAppMessageProvider, shouldEnable])
}
