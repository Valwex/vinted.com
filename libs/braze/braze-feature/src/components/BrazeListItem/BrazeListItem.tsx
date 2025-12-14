'use client'

// TODO: Move whole file to braze module

import { CheckmarkShield12 } from '@vinted/monochrome-icons'
import { Cell, Icon, Image, Spacer, Text } from '@vinted/web-ui'
import { noop } from 'lodash'

import {
  BRAZE_VINTED_LOGO_IMAGE_PATH,
  BrazeInboxMessageCardDto,
  transformBrazeInboxMessageCardDto,
} from '@marketplace-web/braze/braze-data'
import { FormattedRelativeTime, useTranslate } from '@marketplace-web/i18n/i18n-feature'
import { useAsset } from '@marketplace-web/shared/assets'
import { Conversation } from '@marketplace-web/messaging/conversation-messaging-data'
import { useConversationNavigator } from '@marketplace-web/messaging/navigation-feature'

type Props = {
  activeConversation: Conversation | undefined
  card: BrazeInboxMessageCardDto
  onCloseSidebar: () => void
  onSetConversation: (conversation: Conversation) => void
  onClick?: () => void
}

const MAX_CHARACTERS = 180

const truncateString = (text: string, length: number) =>
  text.length > length ? `${text.substring(0, length)}...` : text

const BrazeListItem = ({
  activeConversation,
  card,
  onCloseSidebar,
  onSetConversation,
  onClick = noop,
}: Props) => {
  const translate = useTranslate()
  const asset = useAsset()
  const conversationNavigator = useConversationNavigator()

  const isConversationActive = card.id === String(activeConversation?.id)

  const handleClick = () => {
    onCloseSidebar()

    if (isConversationActive) return

    const conversation = transformBrazeInboxMessageCardDto(card)

    onSetConversation(conversation)
    conversationNavigator.navigate(card.id)
    onClick()
  }

  const renderImage = () => {
    return (
      <Image
        role="img"
        src={card.extras.logoURL || asset(BRAZE_VINTED_LOGO_IMAGE_PATH)}
        fallbackSrc={asset(BRAZE_VINTED_LOGO_IMAGE_PATH)}
        size="large"
        styling="circle"
        testId={`inbox-list-item-image-${card.id}`}
      />
    )
  }

  const renderTitle = () => {
    return (
      <Text
        as="h2"
        type="title"
        text={
          <>
            {translate('conversations.list.braze.message_title')}
            <Spacer orientation="vertical" size="small" />
            <Icon
              name={CheckmarkShield12}
              color="primary-default"
              aria={{
                'aria-label': translate('inbox.a11y.moderator_badge'),
              }}
              testId="moderator-badge-icon"
            />
          </>
        }
      />
    )
  }

  const renderLastInteractionTime = () => {
    const createdAt = new Date(card.updated).getTime()

    return <Text as="h3" type="subtitle" text={<FormattedRelativeTime value={createdAt} />} />
  }

  const renderMessageContent = () => {
    return <Text as="span" text={truncateString(card.title, MAX_CHARACTERS)} truncate html />
  }

  return (
    <Cell
      title={renderTitle()}
      prefix={renderImage()}
      subtitle={renderLastInteractionTime()}
      body={renderMessageContent()}
      highlighted={!card.viewed}
      type="navigating"
      theme={isConversationActive ? 'inverseExperimental' : undefined}
      onClick={handleClick}
      testId={`inbox-list-item-${card.id}`}
    />
  )
}

export default BrazeListItem
