export const INBOX_URL = '/inbox'
export const CONVERSATION_URL = (conversationId: number | string): string =>
  `/inbox/${conversationId}`

export const CONVERSATION_DETAILS_URL = (conversationId: number | string): string =>
  `/inbox/${conversationId}/details`

export const INBOX_WANT_IT_PATH = (receiverId: number | string, itemId: number | string): string =>
  `/inbox/want_it?receiver_id=${receiverId}&item_id=${itemId}`

export const INBOX_ROUTE_PATHS = {
  INBOX: 'inbox/*',
  CONVERSATION: ':id',
  CONVERSATION_DETAILS: 'details',
  WANT_IT: 'want_it',
}

export const INBOX_FULL_ROUTE_PATHS = {
  CONVERSATION: 'inbox/:id',
  CONVERSATION_DETAILS: 'inbox/:id/details',
}

export const ID_REGEX = /^\/inbox(?:\/(\d+))?/
