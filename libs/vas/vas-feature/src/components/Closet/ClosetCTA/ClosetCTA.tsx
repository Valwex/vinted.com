'use client'

import { Cell, Text } from '@vinted/web-ui'
import { useInView } from 'react-intersection-observer'

import { navigateToPage } from '@marketplace-web/browser/browser-navigation-util'

import { useTracking } from '@marketplace-web/observability/event-tracker-data'
import { useTranslate } from '@marketplace-web/i18n/i18n-feature'

import { viewEvent } from '@marketplace-web/vas/vas-data'

import { MEMBER_PROFILE_URL } from '../../../constants/routes'

type Props = {
  itemCount: number
  userId: number
  position: number
  onClick?: () => void
}

const ClosetCTA = ({ itemCount, userId, position, onClick }: Props) => {
  const { track } = useTracking()
  const translate = useTranslate('closet_promotion.listing.actions')
  const { ref } = useInView({
    threshold: 1,
    onChange: inView => {
      if (!inView) return
      track(
        viewEvent({
          target: 'see_whole_closet_cta',
          targetDetails: JSON.stringify({
            position,
            userIdentifier: userId,
          }),
        }),
      )
    },
  })

  function handleCtaClick() {
    onClick?.()

    navigateToPage(MEMBER_PROFILE_URL(userId))
  }

  return (
    <div ref={ref} className="closet__cta-container" data-testid="closet-cta">
      <div className="closet__cta">
        <Cell
          type="navigating"
          chevron={false}
          onClick={handleCtaClick}
          theme="transparent"
          testId="show-all-items"
        >
          <Text
            type="title"
            theme="muted"
            alignment="center"
            width="parent"
            as="span"
            text={translate('view_all_items', { count: itemCount }, { count: itemCount })}
          />
        </Cell>
      </div>
    </div>
  )
}

export default ClosetCTA
