'use client'

import { Button, Cell, Spacer, Text } from '@vinted/web-ui'
import { useRef } from 'react'
import { InView } from 'react-intersection-observer'

import {
  userClickHomepageBlockCta,
  userViewHomepageBlock,
  userViewHomepageBlockCta,
  HomepageItemBlockCtaModel,
  HomepageItemModel,
  ItemBlockCtaType,
} from '@marketplace-web/home/home-page-data'
import { useTracking } from '@marketplace-web/observability/event-tracker-data'
import { useBreakpoint } from '@marketplace-web/breakpoints/breakpoints-feature'
import { ErrorBoundary } from '@marketplace-web/error-display/error-display-util'
import { ComponentError } from '@marketplace-web/error-display/error-display-feature'
import { GenericPromoBoxModel } from '@marketplace-web/braze/braze-data'

import { logHomeError } from '../../utils/client-observability'
import HorizontallyScrollableItems from '../../HorizontallyScrollableItems'
import BlockTitle from '../../common/BlockTitle'
import DynamicSpacer from '../../common/DynamicSpacer'

type Props = {
  id?: string
  title: string
  subtitle?: string | null
  name: string
  items: Array<HomepageItemModel>
  promoBox: GenericPromoBoxModel | null
  homepageSessionId: string
  position: number
  headerCta?: HomepageItemBlockCtaModel | null
  itemCta?: HomepageItemBlockCtaModel | null
}

const ItemsBlock = ({
  title,
  subtitle,
  name,
  items,
  promoBox,
  homepageSessionId,
  position,
  headerCta,
  itemCta,
  id,
}: Props) => {
  const { track } = useTracking()
  const breakpoints = useBreakpoint()

  const isItemsBlockSeen = useRef(false)
  const seenCtas = useRef<Array<ItemBlockCtaType>>([])

  const handleCtaClick = (type: ItemBlockCtaType) => () => {
    track(
      userClickHomepageBlockCta({
        type,
        blockName: name,
        blockPosition: position,
        homepageSessionId,
        id,
      }),
    )
  }

  const handleCtaView = (type: ItemBlockCtaType) => () => {
    if (seenCtas.current.includes(type)) return

    seenCtas.current.push(type)
    track(
      userViewHomepageBlockCta({
        type,
        blockName: name,
        blockPosition: position,
        homepageSessionId,
        id,
      }),
    )
  }

  const handleHeaderCtaView = (inView: boolean) =>
    inView && handleCtaView(ItemBlockCtaType.Header)()

  const renderHeader = () => (
    <>
      <DynamicSpacer portables="Large" desktops="XLarge" />
      <Cell
        styling={breakpoints.portables ? 'tight' : 'narrow'}
        title={
          <div className="homepage-layouts-text-truncation">
            <BlockTitle title={title} width="Parent" />
          </div>
        }
        body={
          subtitle ? (
            <div className="homepage-layouts-text-truncation">
              <Text type="subtitle" width="parent" text={subtitle} as="p" />
            </div>
          ) : null
        }
        testId={`${name}-header`}
        suffix={
          headerCta && (
            <InView onChange={handleHeaderCtaView}>
              <Button
                url={headerCta.url}
                onClick={handleCtaClick(ItemBlockCtaType.Header)}
                styling="flat"
                text={<Text as="span" theme="primary" text={headerCta.title} />}
                aria={{
                  'aria-label': headerCta.accessibilityLabel || '',
                }}
                testId={`${name}-header-cta`}
              />
            </InView>
          )
        }
        fullWidthTitle
      />
      <DynamicSpacer portables="Large" desktops="Regular" />
    </>
  )

  const renderCta = () => {
    if (!itemCta) return null

    return (
      <HorizontallyScrollableItems.CtaItem
        url={itemCta.url}
        onClick={handleCtaClick(ItemBlockCtaType.Item)}
        content={itemCta.title}
        testId={`${name}-item-cta`}
        onEnter={handleCtaView(ItemBlockCtaType.Item)}
      />
    )
  }

  const handleBlockView = (inView: boolean) => {
    if (!inView) return
    if (isItemsBlockSeen.current) return

    isItemsBlockSeen.current = true

    track(
      userViewHomepageBlock({ blockName: name, blockPosition: position, homepageSessionId, id }),
    )
  }

  return (
    <InView onChange={handleBlockView}>
      <HorizontallyScrollableItems
        items={items}
        cta={renderCta()}
        promoBox={promoBox}
        header={renderHeader()}
        homepageSessionId={homepageSessionId}
        itemTestId={name}
        preventLog
        testId={`${name}-block`}
        itemsFullWidthAlignment
      />
      <Spacer size="x-large" />
    </InView>
  )
}

const ItemsBlockErrorBoundary = (props: Props) => (
  <ErrorBoundary
    FallbackComponent={ComponentError}
    preventLog
    onError={err => logHomeError(err, props.name)}
  >
    <ItemsBlock {...props} />
  </ErrorBoundary>
)

export default ItemsBlockErrorBoundary
