'use client'

import { Button, Card, Stack, Text, Image } from '@vinted/web-ui'

import { InView } from 'react-intersection-observer'

import {
  AcceptedOfferWidgetModel,
  clickEvent,
  postHomepageAction,
  userViewHomepageElement,
} from '@marketplace-web/home/home-page-data'
import { useTracking } from '@marketplace-web/observability/event-tracker-data'
import { useBreakpoint } from '@marketplace-web/breakpoints/breakpoints-feature'

import HomepageBlockLayout from '../Layouts/HomepageBlockLayout'
import TwoColumnsArrangement from '../../common/TwoColumnsArrangement'
import DynamicSpacer from '../../common/DynamicSpacer'
import InformationBreakdown from './InformationBreakdown'

type Props = AcceptedOfferWidgetModel & {
  position: number
  homepageSessionId: string
}

const AcceptedOfferWidget = (props: Props) => {
  const { track } = useTracking()
  const breakpoints = useBreakpoint()

  const trackCtaClick = () => {
    track(
      clickEvent({
        target: 'homepage_accepted_offer_widget_cta',
        targetDetails: JSON.stringify({
          homepage_session_id: props.homepageSessionId,
          item_id: props.item.id,
        }),
      }),
    )
  }

  const trackView = (inView: boolean) => {
    if (!inView) return

    postHomepageAction({
      blockName: props.name,
      payload: [String(props.item.id)],
    })
    track(
      userViewHomepageElement({
        blockName: props.name,
        position: props.position,
        contentSource: props.name,
        contentSourceId: String(props.item.id),
        homepageSessionId: props.homepageSessionId,
      }),
    )
  }

  return (
    <TwoColumnsArrangement
      prefix={<DynamicSpacer phones="XLarge" />}
      suffix={<DynamicSpacer phones="X2Large" />}
    >
      <InView
        as="div"
        className="homepage-accepted-offer-widget-wrapper"
        triggerOnce
        onChange={trackView}
      >
        <Card>
          <HomepageBlockLayout {...props} className="homepage-accepted-offer-widget">
            <Stack direction="column" height="content">
              <Text as="h2" text={props.title} type={breakpoints.phones ? 'title' : 'heading'} />
              <Text as="p" text={props.subtitle} type="subtitle" />
            </Stack>

            <div className="homepage-accepted-offer-widget__image homepage-accepted-offer-widget__image--tablets-up">
              <Image
                src={props.item.thumbnailUrl}
                alt={props.item.itemBox?.accessibilityLabel || ''}
                ratio="landscape"
              />
            </div>

            <Stack
              distribution="space-in-between"
              alignment="bottom"
              height="content"
              gap="regular"
              wrap
            >
              <Stack gap="regular" height="content">
                <div className="homepage-accepted-offer-widget__image homepage-accepted-offer-widget__image--phones">
                  <Image
                    src={props.item.thumbnailUrl}
                    ratio="small-portrait"
                    alt={props.item.itemBox?.accessibilityLabel || ''}
                  />
                </div>
                <InformationBreakdown item={props.item} />
              </Stack>

              <div className="u-flexbox u-align-items-flex-end u-fill-height">
                <Button
                  url={props.cta.url}
                  text={props.cta.body}
                  onClick={trackCtaClick}
                  styling="filled"
                  inline={breakpoints.desktops}
                  size="medium"
                />
              </div>
            </Stack>
          </HomepageBlockLayout>
        </Card>
      </InView>
    </TwoColumnsArrangement>
  )
}

export default AcceptedOfferWidget
