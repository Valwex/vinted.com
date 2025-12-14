import {
  ControlMessage,
  FullScreenMessage,
  HtmlMessage,
  InAppMessage,
  ModalMessage,
  SlideUpMessage,
} from '@braze/web-sdk'

import { logBrazeMessage } from '@marketplace-web/braze/braze-data'
import {
  getSessionStorageItem,
  removeSessionStorageItem,
  setSessionStorageItem,
} from '@marketplace-web/browser/browser-storage-util'

import { GenericInAppMessage } from '../types/generic-in-app-message'

export const STORED_IN_APP_MESSAGE_KEY = 'storedInAppMessage'
const SEPARATOR = ',,,,,'

const IN_APP_MESSAGE_CONSTRUCTORS_MAP = {
  FullScreenMessage,
  HtmlMessage,
  ModalMessage,
  SlideUpMessage,
  ControlMessage,
  InAppMessage, // This class needs to be the last, because some other classes extend it.
}
const isConstructorName = (
  constructorName: string,
): constructorName is keyof typeof IN_APP_MESSAGE_CONSTRUCTORS_MAP =>
  constructorName in IN_APP_MESSAGE_CONSTRUCTORS_MAP

const encodeInAppMessage = (inAppMessage: GenericInAppMessage) => {
  // We cannot use `inAppMessage.constructor.name` because it is minified and might change on every build.
  const constructorName = Object.entries(IN_APP_MESSAGE_CONSTRUCTORS_MAP).find(
    ([, constructor]) => inAppMessage instanceof constructor,
  )?.[0]
  const stringifiedMessage = JSON.stringify(inAppMessage)

  if (!constructorName) throw new Error('unknownConstructor')

  return [constructorName, stringifiedMessage].join(SEPARATOR)
}

const decodeInAppMessage = (encodedMessage: string) => {
  const [constructorName, stringifiedMessage] = encodedMessage.split(SEPARATOR)

  if (!stringifiedMessage) throw new Error('invalid')
  if (!isConstructorName(constructorName!)) {
    throw new Error(`unknownStoredConstructorName(${constructorName!})`)
  }

  const { prototype } = IN_APP_MESSAGE_CONSTRUCTORS_MAP[constructorName]

  const inAppMessage = Object.assign(
    Object.create(prototype) as typeof prototype,
    JSON.parse(stringifiedMessage) as typeof prototype,
  )

  return inAppMessage
}

const logStoredInAppMessageError = (error: unknown) => {
  if (!(error instanceof Error)) return

  logBrazeMessage(`storedInAppMessageError(${error.message})`)
}

/**
 * A utility object for storing and retrieving an in-app message in the session storage.
 */
export const storedInAppMessage = {
  get(): GenericInAppMessage | null {
    try {
      const encodedMessage = getSessionStorageItem(STORED_IN_APP_MESSAGE_KEY)

      if (!encodedMessage) return null

      return decodeInAppMessage(encodedMessage)
    } catch (error: unknown) {
      logStoredInAppMessageError(error)

      return null
    }
  },

  set(inAppMessage: GenericInAppMessage) {
    try {
      const encodedMessage = encodeInAppMessage(inAppMessage)

      setSessionStorageItem(STORED_IN_APP_MESSAGE_KEY, encodedMessage)
    } catch (error: unknown) {
      logStoredInAppMessageError(error)
    }
  },

  clear() {
    try {
      removeSessionStorageItem(STORED_IN_APP_MESSAGE_KEY)
    } catch (error: unknown) {
      logStoredInAppMessageError(error)
    }
  },
}
