'use client'

import { CancelCircleFilled32, CheckCircleFilled32, X24 } from '@vinted/monochrome-icons'
import { Button, Cell, Icon, Spacer, Text } from '@vinted/web-ui'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useIsClient } from 'usehooks-ts'

import { isInternalUrl } from '@marketplace-web/browser/url-util'

import { FlashMessageType, popFlashMessage } from '../../utils/flash-message'
import { FLASH_MESSAGE_TRANSLATION_PREFIX } from './constants'

type IconProps = React.ComponentProps<typeof Icon>

const flashMessageIconMap: Record<FlashMessageType, IconProps['name']> = {
  success: CheckCircleFilled32,
  warning: CancelCircleFilled32,
}

const flashMessageColorMap: Record<FlashMessageType, IconProps['color']> = {
  success: 'greyscale-level-6',
  warning: 'greyscale-level-6',
}

type Props = {
  closeLabel?: string
  flashMessages: Record<string, string>
}

const FlashMessage = ({ closeLabel, flashMessages }: Props) => {
  const [flashMessage, setFlashMessage] = useState(popFlashMessage())
  const isClientSideRenderReady = useIsClient()

  const searchParams = useSearchParams()

  const flashMessageCode = searchParams?.get('flash_message_code')
  const flashMessageActionCode = searchParams?.get('flash_message_action_code')
  const flashMessageActionUrl = searchParams?.get('flash_message_action_url')

  useEffect(() => {
    const flashMessageText =
      flashMessages[`${FLASH_MESSAGE_TRANSLATION_PREFIX}.${flashMessageCode}`]

    if (!flashMessageText) return

    const getAction = () => {
      const flashMessageActionText =
        flashMessages[`${FLASH_MESSAGE_TRANSLATION_PREFIX}.${flashMessageActionCode}`]

      if (!flashMessageActionText || !flashMessageActionUrl) return undefined

      return {
        text: flashMessageActionText,
        url: flashMessageActionUrl,
      }
    }

    setFlashMessage({
      type: FlashMessageType.Success,
      message: flashMessageText,
      action: getAction(),
    })
  }, [flashMessageActionCode, flashMessageActionUrl, flashMessageCode, flashMessages])

  const handleClose = () => setFlashMessage(null)

  if (!flashMessage || !isClientSideRenderReady) return null

  const renderMessage = () => (
    <div className="u-flexbox u-align-items-center">
      <Icon
        name={flashMessageIconMap[flashMessage.type]}
        color={flashMessageColorMap[flashMessage.type]}
        display="block"
      />
      <Spacer size="large" orientation="vertical" />
      <Text as="span" text={flashMessage.message} theme="inherit" bold />
    </div>
  )

  const renderSuffix = () => {
    const action = flashMessage?.action

    if (action && isInternalUrl(action.url)) {
      return <Button url={action.url} text={action.text} styling="filled" size="small" inverse />
    }

    return (
      <Button
        onClick={handleClose}
        styling="flat"
        icon={<Icon name={X24} color="greyscale-level-6" />}
        aria={{ 'aria-label': closeLabel }}
      />
    )
  }

  return (
    <>
      <Cell
        theme={flashMessage.type}
        title={renderMessage()}
        suffix={renderSuffix()}
        testId="flash-message"
      />
      <Spacer size="x-large" />
    </>
  )
}

export default FlashMessage
