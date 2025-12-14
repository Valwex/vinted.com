'use client'

import {
  createElement,
  JSXElementConstructor,
  PropsWithChildren,
  ReactNode,
  useContext,
  useEffect,
  useRef,
} from 'react'
import { IntlProvider } from 'react-intl'

import { UnreadMessagesQueryClientProvider } from '@marketplace-web/messaging/unread-messages-data'
import { AuthModal } from '@marketplace-web/auth-flow/auth-flow-feature'
import { AuthModalProvider } from '@marketplace-web/auth-flow/auth-modal-context-feature'
import { AbTestsProvider } from '@marketplace-web/feature-flags/ab-tests-data'
import { BreakpointProvider } from '@marketplace-web/breakpoints/breakpoints-feature'
import {
  CookieManagerProvider,
  createCookieManager,
} from '@marketplace-web/environment/cookies-util'
import { FeatureSwitchesProvider } from '@marketplace-web/feature-flags/feature-switches-data'
import { RequestProvider } from '@marketplace-web/environment/request-context-data'
import { BrowserNavigationProvider } from '@marketplace-web/browser/browser-navigation-util'
import { SessionProvider } from '@marketplace-web/shared/session-data'
import { SystemConfigurationProvider } from '@marketplace-web/shared/system-configuration-data'
import { ConsentProvider } from '@marketplace-web/consent/consent-data'

import { TrackingContext } from '@marketplace-web/observability/event-tracker-data'
import { IncogniaScriptProvider } from '@marketplace-web/bot-detection/incognia-feature'

type ProviderProps<T extends JSXElementConstructor<any>> = Omit<React.ComponentProps<T>, 'children'>

type Props = {
  featureSwitchesProps: ProviderProps<typeof FeatureSwitchesProvider>
  systemConfigurationProps: ProviderProps<typeof SystemConfigurationProvider>
  sessionProps: ProviderProps<typeof SessionProvider>
  abTestsProps: ProviderProps<typeof AbTestsProvider>
  intlProps: ProviderProps<typeof IntlProvider>
  cookies: Record<string, string | undefined>
  nextRequestProps: ProviderProps<typeof RequestProvider>
  browserNavigationProps: ProviderProps<typeof BrowserNavigationProvider>
  breakpointProps: ProviderProps<typeof BreakpointProvider>
  consentProps: ProviderProps<typeof ConsentProvider>
}

const createProvider =
  <T extends JSXElementConstructor<any>>(provider: T, props?: ProviderProps<T>) =>
  (children: ReactNode) =>
    createElement(provider, props, children)

const ClientDataContextProviders = ({
  children,
  featureSwitchesProps,
  systemConfigurationProps,
  sessionProps,
  abTestsProps,
  intlProps,
  cookies,
  nextRequestProps,
  browserNavigationProps,
  breakpointProps,
  consentProps,
}: PropsWithChildren<Props>) => {
  const cookieManagerRef = useRef<ReturnType<typeof createCookieManager> | null>(null)
  cookieManagerRef.current ??= createCookieManager(cookies)
  const trackingContext = useContext(TrackingContext)

  const { user, debugPin, anonId, trackingPlatform, screen } = sessionProps.initialSessionData
  const { portal } = systemConfigurationProps.configuration

  useEffect(() => {
    if (!trackingContext?.tracker) return

    trackingContext.tracker.updateContext({
      anonId: anonId || '',
      userId: user?.id,
      portal: portal || '',
      debugPin: debugPin ? Number(debugPin) : null,
      platform: trackingPlatform || null,
      languageCode: user?.locale || '',
      screen: {
        width: 0,
        height: 0,
        name: screen,
      },
      utm: {},
    })

    trackingContext.tracker.drainEventQueue()
  }, [trackingContext, anonId, portal, debugPin, user?.id, user?.locale, trackingPlatform, screen])

  return [
    createProvider(FeatureSwitchesProvider, featureSwitchesProps),
    createProvider(SystemConfigurationProvider, systemConfigurationProps),
    createProvider(SessionProvider, sessionProps),
    createProvider(AbTestsProvider, abTestsProps),
    createProvider(IntlProvider, intlProps),
    createProvider(UnreadMessagesQueryClientProvider),
    createProvider(CookieManagerProvider, { cookieManager: cookieManagerRef.current }),
    createProvider(RequestProvider, nextRequestProps),
    createProvider(BrowserNavigationProvider, browserNavigationProps),
    createProvider(BreakpointProvider, breakpointProps),
    createProvider(IncogniaScriptProvider),
    createProvider(AuthModalProvider, { authModalComponent: AuthModal }),
    createProvider(ConsentProvider, consentProps),
  ].reduceRight((providerChildren, provider) => provider(providerChildren), children)
}

export default ClientDataContextProviders
