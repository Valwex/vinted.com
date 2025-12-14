'use client'

import { ReactNode } from 'react'
import { Button, Cell, Spacer, Text } from '@vinted/web-ui'
import { InView } from 'react-intersection-observer'

import {
  shouldTrackOnce,
  useAbTest,
  useTrackAbTestCallback,
  AbTestExposeEventExtra,
} from '@marketplace-web/feature-flags/ab-tests-data'
import { getTestId } from '@marketplace-web/vendor-abstractions/web-ui-util'
import { SeparatedList } from '@marketplace-web/common-components/separated-list-ui'
import { ItemAction } from '@marketplace-web/item-box/product-item-data'
import { clickEvent } from '@marketplace-web/item-box/item-box-data'
import { useTracking } from '@marketplace-web/observability/event-tracker-data'
import { useSession } from '@marketplace-web/shared/session-data'

type Props = {
  renderPriceBreakdown?: ReactNode
  renderPrice: ReactNode
  testId?: string
  bumpText?: ReactNode
  description?: {
    title: ReactNode
    subtitle?: ReactNode
    exposure?: AbTestExposeEventExtra
    exposures?: Array<AbTestExposeEventExtra>
  } | null
  actions?: Array<ItemAction>
  itemId?: string
}

const InformationBreakdown = (props: Props) => {
  const { renderPriceBreakdown, testId, bumpText, description, renderPrice, actions, itemId } =
    props

  const trackAbTest = useTrackAbTestCallback()
  const abTest = useAbTest(description?.exposure?.test_name || '')
  const { track } = useTracking()
  const { screen } = useSession()

  const shouldRenderActions = actions && actions.length > 0

  const handleDescriptionView = (inView: boolean) => {
    if (!inView) return

    description?.exposures?.forEach(
      ({ test_name, variant, test_id }) =>
        variant && trackAbTest({ name: test_name, variant, id: Number(test_id) }, shouldTrackOnce),
    )

    trackAbTest(abTest, shouldTrackOnce)
  }

  const renderBumpedText = () => (
    <Text
      text={bumpText}
      theme="amplified"
      type="caption"
      testId={getTestId(testId, 'bump-text')}
      as="p"
    />
  )

  const renderDescription = () => {
    if (!description) return null

    return (
      <Cell styling="tight" testId={getTestId(testId, 'description')}>
        <InView
          className="u-flexbox u-justify-content-between"
          as="div"
          onChange={handleDescriptionView}
        >
          <div className="new-item-box__description">
            <Text
              text={description.title}
              type="caption"
              testId={getTestId(testId, 'description-title')}
              as="p"
              truncate
            />
          </div>
          {bumpText && renderBumpedText()}
        </InView>
        <div className="new-item-box__description">
          <Text
            text={description.subtitle}
            type="caption"
            testId={getTestId(testId, 'description-subtitle')}
            as="p"
            truncate
          />
        </div>
      </Cell>
    )
  }

  const handleActionClick = (name: string) => () => {
    track(
      clickEvent({
        target: 'item_box_action',
        screen,
        targetDetails: JSON.stringify({ action_name: name, item_id: itemId }),
      }),
    )
  }

  return (
    <div>
      <div className="u-flexbox u-align-items-flex-start u-ui-padding-bottom-regular">
        <div className="u-min-width-none u-flex-grow">{description && renderDescription()}</div>
      </div>
      <div>
        {shouldRenderActions ? (
          <SeparatedList separator={<Spacer />}>
            {actions?.map(action => (
              <Button
                key={action.title}
                text={action.title}
                url={action.url}
                size="small"
                truncated
                onClick={handleActionClick(action.name)}
              />
            ))}
          </SeparatedList>
        ) : (
          <>
            {renderPrice}
            {renderPriceBreakdown}
          </>
        )}
      </div>
    </div>
  )
}

export default InformationBreakdown
