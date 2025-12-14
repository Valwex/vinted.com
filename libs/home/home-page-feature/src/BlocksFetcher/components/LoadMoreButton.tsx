'use client'

import { Button, Spacer } from '@vinted/web-ui'

import { useTracking } from '@marketplace-web/observability/event-tracker-data'
import { useTranslate } from '@marketplace-web/i18n/i18n-feature'
import { clickEvent } from '@marketplace-web/home/home-page-data'

const LoadMoreButton = ({ onClick }) => {
  const translate = useTranslate()
  const { track } = useTracking()

  const handleLoadMoreButtonClick = () => {
    track(clickEvent({ target: 'feed_load_more_button' }))
    onClick()
  }

  return (
    <div className="u-flexbox u-align-items-center u-flex-direction-column">
      <Spacer size="large" />
      <Button
        theme="primary"
        styling="filled"
        text={translate('feed.actions.load_more')}
        onClick={handleLoadMoreButtonClick}
        testId="feed-load-more-button"
        inline
      />
    </div>
  )
}

export default LoadMoreButton
