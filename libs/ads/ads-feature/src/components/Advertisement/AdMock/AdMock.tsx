import classNames from 'classnames'
import { Text } from '@vinted/web-ui'

import { AdShape } from '@marketplace-web/ads/ads-data'

import { StickyOptions } from '../../../hooks/useStickyOptions/useStickyOptions'

type Props = {
  shape: AdShape
  isSidebarAd?: boolean
  stickyOptions?: StickyOptions
}

const AdMock = ({ shape, isSidebarAd, stickyOptions }: Props) => {
  return (
    <div
      className={classNames(
        'admock-container',
        `admock-container--${shape}`,
        !!stickyOptions && 'admock-sticky',
        isSidebarAd && 'admock-sidebar',
      )}
      data-testid="admock-container"
      style={{ top: stickyOptions?.offset }}
    >
      <div className="admock-content" data-testid="admock-content">
        <div className="admock-info" data-testid="admock-info">
          <Text as="h4" type="caption" theme="muted" text="AdMock" />
        </div>
        <div className={classNames('admock', `admock--${shape}`)} data-testid="admock" />
      </div>
    </div>
  )
}

export default AdMock
