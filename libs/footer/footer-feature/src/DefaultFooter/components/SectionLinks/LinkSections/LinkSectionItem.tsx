'use client'

import { useTracking } from '@marketplace-web/observability/event-tracker-data'
import { clickEvent } from '@marketplace-web/footer/footer-data'

type Props = {
  text: string
  url: string
  clickEventTarget?: Parameters<typeof clickEvent>[0]
  testId?: string
}

const LinkSectionItem = ({ text, url, clickEventTarget, testId }: Props) => {
  const { track } = useTracking()

  return (
    <li className="main-footer__links-section-row">
      <a
        className="main-footer__links-section-link"
        href={url}
        onClick={() => {
          if (!clickEventTarget) {
            return
          }
          track(clickEvent(clickEventTarget))
        }}
        data-testid={testId}
      >
        {text}
      </a>
    </li>
  )
}

export default LinkSectionItem
