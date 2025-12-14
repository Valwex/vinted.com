'use client'

import { Fragment } from 'react'

import {
  BlockEntityType,
  HomepageBlockEntityModel,
  ThumbnailsBlockStyle,
  HomepageItemBlockModel,
  HomepageBlocksModel,
  HomepageItemModel,
  BannersBlockModel,
  ThumbnailsBlockModel,
} from '@marketplace-web/home/home-page-data'
import { useHomeInserts } from '@marketplace-web/vas/vas-feature'
import {
  useHomeListerActivationBanner,
  HomeListerActivationBanner,
} from '@marketplace-web/banners/banners-feature'
import { useStickyPromoBox, useBrazePromoBoxes } from '@marketplace-web/braze/braze-feature'
import { GenericPromoBoxModel, PromoBoxType } from '@marketplace-web/braze/braze-data'
import ClickableListCards from '@marketplace-web/seo/clickable-list-cards-ui'

import { ClickableListCardsDto } from '@marketplace-web/seo/clickable-list-cards-data'

import ItemsBlock from './ItemsBlock'
import { HorizontalRowsBlock, ThumbnailsBlock, BannersBlock } from './Layouts'
import BlockArrangement from '../common/BlockArrangement'
import { useHomeContext } from '../HomeProvider'
import useTabs from '../hooks/useTabs'
import Item from './Item'
import Header from './Header'
import BrazePromoBox from './BrazePromoBox'
import useInsertBrazePromoBoxes from '../hooks/useInsertBrazePromoBoxes'
import useRemoveEmptySlots from '../hooks/useRemoveEmptySlots'
import DynamicSpacer from '../common/DynamicSpacer'
import ExposureBlock from '../ExposureBlock'
import Divided from '../common/Divided'
import CtaWidget from './CtaWidget'
import AcceptedOfferWidget from './AcceptedOfferWidget'

type Props = {
  blocks: HomepageBlocksModel
}

const HomeBlocks = ({ blocks: data }: Props) => {
  const listerActivationBannerProps = useHomeListerActivationBanner()
  const { getStickyPromoBox } = useStickyPromoBox()
  const { homepageSessionId } = useHomeContext()
  const { currentTab } = useTabs()

  const isFeedPromoBoxEnabled = currentTab.isPromoBoxEnabled
  const brazePromoBoxes = useBrazePromoBoxes(PromoBoxType.Braze)
  const enabledPromoBoxes = isFeedPromoBoxEnabled ? brazePromoBoxes : []

  const blocksWithPromoBoxes = useInsertBrazePromoBoxes({
    blocks: data.blocks,
    isFeedPromoBoxEnabled,
  })
  const blocks = useRemoveEmptySlots(blocksWithPromoBoxes)
  const { renderClosetOrAdComponent } = useHomeInserts({
    catalogId: currentTab.catalogId ?? undefined,
    ...currentTab.feed,
    homepageSessionId,
  })

  const renderHomePageGenericBlock = (
    block: HomepageItemBlockModel,
    position: number,
    index: number,
  ) => {
    const previousBlock = blocks[index - 1]
    const nextBlock = blocks[index + 1]

    return (
      <BlockArrangement suffix={<DynamicSpacer portables="XLarge" desktops="XLarge" />}>
        <Divided previousBlockType={previousBlock?.type} nextBlockType={nextBlock?.type}>
          <ItemsBlock
            {...block}
            promoBox={currentTab.isPromoBoxEnabled ? getStickyPromoBox() : null}
            homepageSessionId={homepageSessionId}
            position={position}
          />
        </Divided>
      </BlockArrangement>
    )
  }

  const renderThumbnailsBlock = (block: ThumbnailsBlockModel, position: number) => {
    if (!block.elements.length) return null

    if (block.style === ThumbnailsBlockStyle.TwoHorizontalRows) {
      return (
        <BlockArrangement>
          <HorizontalRowsBlock
            {...block}
            position={position}
            homepageSessionId={homepageSessionId}
          />
        </BlockArrangement>
      )
    }

    return (
      <BlockArrangement>
        <ThumbnailsBlock {...block} homepageSessionId={homepageSessionId} position={position} />
      </BlockArrangement>
    )
  }

  const renderBannersBlock = (block: BannersBlockModel, position: number) => {
    if (!block.elements.length) return null

    return (
      <BlockArrangement>
        <BannersBlock {...block} position={position} homepageSessionId={homepageSessionId} />
      </BlockArrangement>
    )
  }

  const renderItem = (item: HomepageItemModel, position: number) => {
    return (
      <Item
        item={item}
        position={position}
        homepageSessionId={homepageSessionId}
        brazePromoBoxes={enabledPromoBoxes}
      />
    )
  }

  const renderAdOrCloset = (position: number) => {
    return (
      <BlockArrangement suffix={false}>
        {renderClosetOrAdComponent({
          position,
          id: `slot-${position}`,
          suffix: <DynamicSpacer phones="XLarge" tabletsUp="X3Large" />,
        })}
      </BlockArrangement>
    )
  }

  const renderListerActivationBanner = (position: number) => (
    <BlockArrangement suffix={false}>
      <HomeListerActivationBanner {...listerActivationBannerProps} position={position} />
    </BlockArrangement>
  )

  const renderBrazePromoBox = (promoBox: GenericPromoBoxModel, position: number) => (
    <BrazePromoBox promoBox={promoBox} position={position} brazePromoBoxes={enabledPromoBoxes} />
  )

  const renderClickableListCards = (block: ClickableListCardsDto) => {
    return (
      <BlockArrangement
        prefix={<DynamicSpacer portables="XLarge" desktops="X2Large" />}
        suffix={<DynamicSpacer portables="XLarge" desktops="X3Large" />}
        as="div"
      >
        <ClickableListCards {...block} />
      </BlockArrangement>
    )
  }

  const renderBlock = (block: HomepageBlockEntityModel, position: number, index: number) => {
    switch (block.type) {
      case BlockEntityType.ItemBoxBlock:
        return renderHomePageGenericBlock(block.entity, position, index)
      case BlockEntityType.ThumbnailsBlock:
        return renderThumbnailsBlock(block.entity, position)
      case BlockEntityType.BannersBlock:
        return renderBannersBlock(block.entity, position)
      case BlockEntityType.AdOrCloset:
        return renderAdOrCloset(position)
      case BlockEntityType.Item:
        return renderItem(block.entity, position)
      case BlockEntityType.ListerActivationBanner:
        return renderListerActivationBanner(position)
      case BlockEntityType.BrazePromobox:
        return renderBrazePromoBox(block.entity, position)
      case BlockEntityType.ClickableListCards:
        return renderClickableListCards(block.entity)
      case BlockEntityType.CtaWidget:
        return (
          <CtaWidget {...block.entity} position={position} homepageSessionId={homepageSessionId} />
        )
      case BlockEntityType.AcceptedOfferWidget:
        return (
          <AcceptedOfferWidget
            {...block.entity}
            position={position}
            homepageSessionId={homepageSessionId}
          />
        )
      default:
        return null
    }
  }

  let position = 0

  return (
    <div className="homepage-blocks" data-testid="homepage-blocks">
      {blocks.map((block, index) => {
        if (block.type === BlockEntityType.ExposureBlock)
          return (
            <ExposureBlock {...block.entity} key={block.entity.test_id || block.entity.test_name} />
          )

        if (block.type === BlockEntityType.Header)
          return <Header {...block.entity} key={block.entity.title} />

        if (block.type === BlockEntityType.ListerActivationBanner) {
          const banner = listerActivationBannerProps.generateListerActivationBannerItem(position)
          if (!banner) return null
        }

        position += 1

        return <Fragment key={position}>{renderBlock(block, position, index)}</Fragment>
      })}
    </div>
  )
}

export default HomeBlocks
