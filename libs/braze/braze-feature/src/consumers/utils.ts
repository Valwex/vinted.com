import type braze from '@braze/web-sdk'

import {
  brazeChannels,
  logIncorrectContentError,
  logMissingContentError,
} from '@marketplace-web/braze/braze-data'

export function getCardCampaignData(card: braze.Card): string {
  const cardId = card.id || ''

  try {
    // The campaign id is the first part of the decoded card id
    // https://www.braze.com/docs/user_guide/message_building_by_channel/content_cards/testing#debug
    const campaignId = atob(cardId).split('_')[0]

    return `campaignId: ${campaignId!}`
  } catch {
    // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
    return card.extras?.tracking!
  }
}

/**
 * Lets you validate, if a given `braze.Card` has valid:
 *  - `id` and `updated` fields
 *  - a `channel` on the `extras` field, matching the one passed as an argument
 *     (will log an error if the field is incorrect or missing)
 *  - the passed `card` instance is has been created from one of the given constructors
 */
export function isValidBrazeCard<T extends ReadonlyArray<typeof braze.Card>>(
  card: braze.Card,
  channel: string,
  ...matchingConstructors: T
): card is InstanceType<T[number]> & { id: string; updated: Date; extras: Record<string, string> } {
  if (
    !matchingConstructors.some(constructor => card instanceof constructor) ||
    !card.id ||
    !card.updated
  ) {
    // TODO: log error when `id` or `updated` are missing
    return false
  }

  const cardChannel = card.extras?.channel

  if (!cardChannel) {
    logMissingContentError(card.id, 'channel', undefined, getCardCampaignData(card))
  } else if (!brazeChannels.includes(cardChannel)) {
    logIncorrectContentError(card.id, 'channel', cardChannel, getCardCampaignData(card))
  }

  return Boolean(cardChannel) && cardChannel === channel
}
