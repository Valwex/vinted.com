import {
  changeUser,
  enableSDK,
  initialize,
  openSession,
  setLogger,
  setSdkAuthenticationSignature,
  subscribeToSdkAuthenticationFailures,
} from '@braze/web-sdk'

import { BrazeErrorType } from '@marketplace-web/braze/braze-data'
import { withMemoizedPromise } from '@marketplace-web/vendor-abstractions/http-client-util/server'

import {
  FullScreenInAppMessageStore,
  InboxMessageCardStore,
  InboxNotificationCardStore,
  ModalInAppMessageStore,
  PromoBoxCardStore,
  SlideUpInAppMessageStore,
  controlInAppMessageConsumer,
  htmlInAppMessageConsumer,
} from './consumers'
import { ContentCardProvider, InAppMessageProvider } from './providers'
import type { NullableBrazeStores } from './types/store'
import { flushBraze, getBrazeUserId } from './utils/async-utils'
import { fetchAuthToken } from './utils/auth-token'

export type InitializeBrazeOptions = {
  apiKey: string
  baseUrl: string
  safariWebsitePushId?: string
  isCookieFSEnabled: boolean
  userExternalId: string
  logger?: (message: string) => void
}

export type InitializeBrazeReturnType = Promise<
  {
    stores: NullableBrazeStores
  } & (
    | {
        initialized: false
        providers: null
      }
    | {
        initialized: true
        providers: {
          inAppMessageProvider: InAppMessageProvider
          contentCardProvider: ContentCardProvider
        }
      }
  )
>

const IN_APP_MESSAGE_Z_INDEX = 100030

/*
 * NOTE: Make sure to dynamically import this function to avoid importing Braze SDK in the server.
 * Braze SDK will throw an error if it's imported in the server environment.
 *
 * @throws Error if Braze initialization fails
 */
export const unsafeInitializeBraze = withMemoizedPromise(
  async ({
    apiKey,
    baseUrl,
    logger,
    safariWebsitePushId,
    isCookieFSEnabled,
    userExternalId,
  }: InitializeBrazeOptions): InitializeBrazeReturnType => {
    const authToken = await fetchAuthToken({ externalUserId: userExternalId })

    if (!authToken) {
      throw new Error('emptyJwt')
    }

    enableSDK()
    if (logger) setLogger(logger)

    const isInitializationSuccessful = initialize(apiKey, {
      enableLogging: Boolean(logger),
      baseUrl,
      inAppMessageZIndex: IN_APP_MESSAGE_Z_INDEX,
      safariWebsitePushId,
      allowUserSuppliedJavascript: true, // enable custom code in-app messages
      enableSdkAuthentication: true,
      noCookies: isCookieFSEnabled,
    })

    if (!isInitializationSuccessful) {
      throw new Error(BrazeErrorType.InitializationFailure)
    }

    const brazeUserId = await getBrazeUserId()
    const isActiveUser = brazeUserId === userExternalId

    if (isActiveUser) setSdkAuthenticationSignature(authToken)

    const promoBoxCardStore = new PromoBoxCardStore()
    const inboxMessageCardStore = new InboxMessageCardStore()
    const inboxNotificationCardStore = new InboxNotificationCardStore()
    const modalInAppMessageStore = new ModalInAppMessageStore()
    const slideUpInAppMessageStore = new SlideUpInAppMessageStore()
    const fullScreenInAppMessageStore = new FullScreenInAppMessageStore()

    const contentCardProvider = new ContentCardProvider(
      promoBoxCardStore,
      inboxMessageCardStore,
      inboxNotificationCardStore,
    )

    const inAppMessageProvider = new InAppMessageProvider(
      modalInAppMessageStore,
      slideUpInAppMessageStore,
      fullScreenInAppMessageStore,
      htmlInAppMessageConsumer,
      controlInAppMessageConsumer,
    )

    // Subscriptions must be made before calling `openSession`
    // https://js.appboycdn.com/web-sdk/latest/doc/modules/braze.html#subscribetocontentcardsupdates
    contentCardProvider.subscribeToBraze({ useCache: isActiveUser })
    inAppMessageProvider.subscribeToBraze()

    if (isActiveUser) {
      openSession()
    } else {
      changeUser(userExternalId, authToken)
    }

    window.flushBraze = flushBraze

    subscribeToSdkAuthenticationFailures(async failure => {
      const freshAuthToken = await fetchAuthToken({ fresh: true, externalUserId: userExternalId })

      if (!freshAuthToken) return
      if (failure.userId && failure.userId !== userExternalId) {
        changeUser(userExternalId, freshAuthToken)

        return
      }

      setSdkAuthenticationSignature(freshAuthToken)
    })

    return {
      initialized: true,
      stores: {
        promoBoxCardStore,
        inboxMessageCardStore,
        inboxNotificationCardStore,
        slideUpInAppMessageStore,
        modalInAppMessageStore,
        fullScreenInAppMessageStore,
      },
      providers: {
        inAppMessageProvider,
        contentCardProvider,
      },
    }
  },
  { cacheDuration: Infinity, clearOnException: true },
)
