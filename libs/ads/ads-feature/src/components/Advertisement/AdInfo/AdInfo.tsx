'use client'

import { Text } from '@vinted/web-ui'
import { Suspense, useContext } from 'react'

import { useTranslate } from '@marketplace-web/i18n/i18n-feature'
import {
  useAbTest,
  useTrackAbTest,
  shouldTrackOnce,
} from '@marketplace-web/feature-flags/ab-tests-data'

import AdsContext from '../../../containers/AdsProvider/AdsContext'
import { AdControls } from './AdControls'

type Props = {
  underline?: boolean
  placementId?: string
}

const AdInfo = ({ underline, placementId }: Props) => {
  const translate = useTranslate('advertisements')
  const { getSlotInfo } = useContext(AdsContext)

  const adReportTest = useAbTest('ad_report')
  useTrackAbTest(adReportTest, shouldTrackOnce)
  const slotInfo = getSlotInfo(placementId)

  const shouldShowAdControls = adReportTest?.variant === 'on' && slotInfo

  return (
    <Suspense>
      <div className="slot-info" data-testid="slot-info" suppressHydrationWarning>
        <div className="slot-info__content">
          <Text
            as="h4"
            type="caption"
            theme="muted"
            text={translate('advertisement')}
            underline={underline}
          />
          {shouldShowAdControls && <AdControls slotInfo={slotInfo} />}
        </div>
      </div>
    </Suspense>
  )
}

export default AdInfo
