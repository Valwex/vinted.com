'use client'

import { Button } from '@vinted/web-ui'

import { clickEvent } from '@marketplace-web/welcome-image/welcome-image-data'
import { useTracking } from '@marketplace-web/observability/event-tracker-data'

import { HOW_IT_WORKS_URL } from '../../constants/routes'

type Props = {
  text: string
}

const SecondaryButton = ({ text }: Props) => {
  const { track } = useTracking()

  function trackSubtitleClick() {
    const trackData = {
      target: 'help',
      targetDetails: 'Landing page banner how-it-works',
    } as const

    track(clickEvent(trackData))
  }

  return (
    <Button
      text={text}
      url={HOW_IT_WORKS_URL}
      styling="filled"
      inverse
      onClick={trackSubtitleClick}
    />
  )
}

export default SecondaryButton
