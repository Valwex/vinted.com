'use client'

import { Button, Card, Stack, Icon, Text } from '@vinted/web-ui'
import { X16 } from '@vinted/monochrome-icons'
import { useState } from 'react'

import {
  CtaWidgetModel,
  clickEvent,
  postHomepageAction,
} from '@marketplace-web/home/home-page-data'
import { useTracking } from '@marketplace-web/observability/event-tracker-data'
import { useBreakpoint } from '@marketplace-web/breakpoints/breakpoints-feature'
import { useTranslate } from '@marketplace-web/i18n/i18n-feature'

import HomepageBlockLayout from '../Layouts/HomepageBlockLayout'
import BlockArrangement from '../../common/BlockArrangement'
import DynamicSpacer from '../../common/DynamicSpacer'

type Props = CtaWidgetModel & {
  position: number
  homepageSessionId: string
}

const CtaWidget = (props: Props) => {
  const [isShown, setIsShown] = useState(true)
  const { track } = useTracking()
  const breakpoints = useBreakpoint()
  const translate = useTranslate()

  if (!isShown) return null

  const trackCtaClick = () => {
    track(
      clickEvent({
        target: 'homepage_cta_widget_cta',
        targetDetails: JSON.stringify({ homepage_session_id: props.homepageSessionId }),
      }),
    )
    postHomepageAction({ blockName: props.name })
  }

  const handleClose = () => {
    setIsShown(false)
    postHomepageAction({ blockName: props.name })
  }

  return (
    <BlockArrangement
      prefix={<DynamicSpacer portables="X2Large" desktops="X2Large" />}
      suffix={<DynamicSpacer portables="X2Large" desktops="X3Large" />}
    >
      <Card>
        <HomepageBlockLayout {...props} className="homepage-cta-widget">
          <div className="u-flexbox u-flex-direction-column u-fill-width">
            <Stack distribution="space-in-between">
              <Stack direction="column">
                <Text as="h2" text={props.title} type="title" />
                <Text as="p" text={props.description} type="subtitle" />
              </Stack>
              <div>
                <Button
                  styling="flat"
                  icon={<Icon name={X16} color="greyscale-level-1" />}
                  inline
                  title={translate('common.a11y.actions.dialog_close')}
                  onClick={handleClose}
                />
              </div>
            </Stack>
            <div className="u-ui-padding-top-x2-large">
              <Button
                url={props.cta.url}
                text={props.cta.title}
                onClick={trackCtaClick}
                styling="filled"
                inline={breakpoints.desktops}
              />
            </div>
          </div>
        </HomepageBlockLayout>
      </Card>
    </BlockArrangement>
  )
}

export default CtaWidget
