'use client'

import { AllHTMLAttributes, PropsWithChildren, MouseEvent } from 'react'

import { useTracking } from '@marketplace-web/observability/event-tracker-data'

import {
  handleDismissVerificationPrompt,
  trackEmailCodeSkipEvent,
} from '../../../utils/client-email-code-test-handlers'
import HeaderLogoAnchor from '../../../components/HeaderLogoAnchor'

type NoNavigationHeaderLogoAnchorProps = {
  userId: number
}

const BaseNoNavigationHeaderLogoAnchor = ({
  userId,
  ...props
}: PropsWithChildren<NoNavigationHeaderLogoAnchorProps & AllHTMLAttributes<HTMLAnchorElement>>) => {
  const { track } = useTracking()

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()

    trackEmailCodeSkipEvent({ track, userId })
    handleDismissVerificationPrompt({ userId })
  }

  return <HeaderLogoAnchor {...props} onClick={handleClick} />
}

export default BaseNoNavigationHeaderLogoAnchor
