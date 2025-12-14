import { createEndMark, createStartMark } from '@marketplace-web/messaging/tracking-data'

export const MARK_NAMESPACE = 'messaging_navigation'

export enum Mark {
  Conversation = 'conversation',
  ConversationDetails = 'conversation_details',
  Inbox = 'inbox',
}

export const isMessagingMark = (name: string): name is Mark =>
  Object.values(Mark).includes(name as Mark)

export const createConversationNavigationStartMark = () =>
  createStartMark(MARK_NAMESPACE, Mark.Conversation)

export const createConversationDetailsNavigationStartMark = () =>
  createStartMark(MARK_NAMESPACE, Mark.ConversationDetails)

export const createInboxNavigationStartMark = () => createStartMark(MARK_NAMESPACE, Mark.Inbox)

export const InboxNavigationEndMark = createEndMark(MARK_NAMESPACE, Mark.Inbox)
export const ConversationNavigationEndMark = createEndMark(MARK_NAMESPACE, Mark.Conversation)
export const ConversationDetailsNavigationEndMark = createEndMark(
  MARK_NAMESPACE,
  Mark.ConversationDetails,
)
