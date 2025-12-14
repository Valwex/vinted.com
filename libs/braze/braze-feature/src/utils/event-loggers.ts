import type * as braze from '@braze/web-sdk'

import { CatalogNavigationDto } from '@marketplace-web/catalog/catalog-data'
import {
  BrazeCustomEvent,
  BrazeMarketingChannelType,
  InAppModalMessageModel,
  InAppNotificationMessageModel,
  logSdkLoggingFailure,
} from '@marketplace-web/braze/braze-data'

import { BrazeCardLogger, BrazeCardLoggers } from '../types/event-loggers'
import { getCategoriesFromCatalogTree } from './catalog-utils'
import { Store } from '../consumers/generic-store'

async function brazeLogCardDismissal(card: braze.Card) {
  const { logCardDismissal } = await import('@braze/web-sdk')

  const isLogged = logCardDismissal(card)

  if (!isLogged) {
    logSdkLoggingFailure(card.id, 'card-dismissal', card.extras?.channel, card.extras?.tracking)
  }

  return isLogged
}

async function brazeLogCardClick(card: braze.Card) {
  const { logCardClick } = await import('@braze/web-sdk')

  const isLogged = logCardClick(card, true)

  if (!isLogged) {
    logSdkLoggingFailure(card.id, 'card-click', card.extras?.channel, card.extras?.tracking)
  }

  return isLogged
}

async function brazeLogCardImpressions(...cards: Array<braze.Card>) {
  const { logCardImpressions } = await import('@braze/web-sdk')

  const isLogged = logCardImpressions(cards, true)

  if (!isLogged) {
    cards.forEach(({ id, extras }) => {
      logSdkLoggingFailure(id, 'card-impression', extras?.channel, extras?.tracking)
    })
  }

  return isLogged
}

export async function brazeLogInAppMessageClick({
  original,
}: InAppModalMessageModel | InAppNotificationMessageModel) {
  const { logInAppMessageClick } = await import('@braze/web-sdk')

  try {
    const isLogged = logInAppMessageClick(original)
    if (!isLogged) throw new Error('Failed to log in-app message click')
  } catch {
    logSdkLoggingFailure(
      original.message,
      'in-app-click',
      BrazeMarketingChannelType.InAppMessage,
      original.extras.tracking,
    )
  }
}

export async function brazeLogInAppMessageButtonClick(
  { original }: InAppModalMessageModel,
  index: 0 | 1,
) {
  const { logInAppMessageButtonClick } = await import('@braze/web-sdk')

  const isLogged = logInAppMessageButtonClick(original.buttons[index]!, original)

  if (!isLogged) {
    logSdkLoggingFailure(
      original.message,
      'in-app-button-click',
      BrazeMarketingChannelType.InAppMessage,
      original.extras.tracking,
    )
  }
}

export async function brazeLogInAppMessageImpression({
  original,
}: InAppModalMessageModel | InAppNotificationMessageModel) {
  const { logInAppMessageImpression } = await import('@braze/web-sdk')

  const isLogged = logInAppMessageImpression(original)

  if (!isLogged) {
    logSdkLoggingFailure(
      original.message,
      'in-app-impression',
      BrazeMarketingChannelType.InAppMessage,
      original.extras.tracking,
    )
  }
}

export const getCardLoggersById = (
  cardStores: ReadonlyArray<Store<ReadonlyArray<braze.Card> | null>>,
): BrazeCardLoggers => {
  const applyLogCardFunctionById =
    (logCard: (card: braze.Card) => Promise<boolean>): BrazeCardLogger =>
    async id => {
      const foundCard = cardStores.flatMap(store => store.state).find(card => card?.id === id)

      if (!foundCard) return false

      return logCard(foundCard)
    }

  return {
    logCardImpression: applyLogCardFunctionById(brazeLogCardImpressions),
    logCardClick: applyLogCardFunctionById(brazeLogCardClick),
    logCardDismissal: applyLogCardFunctionById(brazeLogCardDismissal),
  }
}

export const logSavedCategoryEvent = async (
  catalogId: string | number | undefined,
  userExternalId: string | null | undefined,
  catalogTrees: Array<CatalogNavigationDto>,
  brandIds?: Array<string> | Array<number>,
) => {
  if (!catalogId) return

  const { brazeLogCustomEvent } = await import('./custom-event')

  const extra: any = getCategoriesFromCatalogTree(catalogId, catalogTrees)
  const brand = brandIds?.map((id: string | number) => id.toString())

  if (brand && brand.length > 0) extra.brand = brand

  brazeLogCustomEvent({
    event: BrazeCustomEvent.SavedCategory,
    extra,
    userExternalId,
  })
}
