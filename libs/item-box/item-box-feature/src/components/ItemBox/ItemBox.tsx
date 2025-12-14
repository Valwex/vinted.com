'use client'

import { ReactNode, MouseEvent } from 'react'
import classNames from 'classnames'
import { Badge, Cell, Image, Spacer, Text, Icon } from '@vinted/web-ui'

import { getTestId } from '@marketplace-web/vendor-abstractions/web-ui-util'
import { ItemBoxModel } from '@marketplace-web/item-box/product-item-data'
import { ItemBoxPricing } from '@marketplace-web/escrow-pricing/escrow-pricing-feature'
import { ProactiveModerationItemCheckbox } from '@marketplace-web/proactive-moderation/proactive-moderation-feature'

import ItemBoxFavourite from './ItemBoxFavourite'
import ItemBoxMessage from './ItemBoxMessage'
import ItemBoxFavouriteIcon from './ItemBoxFavouriteIcon'
import InformationBreakdown from './InformationBreakdown'
import { getIconName } from './utils/getIconName'

export type RenderFavouriteArgsType = {
  favourite: React.ComponentProps<typeof ItemBoxFavourite>
}

type Props = {
  itemId: number
  price: string
  favourite?: React.ComponentProps<typeof ItemBoxFavourite> | null
  oldPrice?: string | null
  url?: string
  badge?: React.ComponentProps<typeof Badge> | null
  image?: string | null
  /**
   * Sets the background color on an image element.
   * Accepts any legal CSS color values (Hexadecimal, RGB, predefined names etc.).
   */
  imageColor?: string | null
  imagesExperimental?: Array<string>
  imageDisplayMode?: 'single' | 'collage'
  imagesExperimentalOverlayDisabled?: boolean
  /**
   * Accepts custom favourite element.
   * `favourite` has to be defined for this property to take effect.
   */

  renderFooter?: ReactNode
  renderPriceBreakdown?: ReactNode
  onClick?: (event: MouseEvent) => void
  status?: React.ComponentProps<typeof ItemBoxMessage> | null
  bumpText?: ReactNode
  /**
   * Adds data-testid attribute to parent and children components.
   * When used, --badge, --selected-icon, --image, --overlay-link,
   * --price-text, --old-price-text, --bump-text,
   * --footer, --favourite, --owner, --description, --status suffixes applied accordingly.
   */
  testId?: string
  hasFavouritedChanged?: boolean
  itemBox?: ItemBoxModel | null
  openItemInNewTab?: boolean
}

const MIN_COLLAGE_IMAGES_COUNT = 3

const ItemBox = ({
  itemId,
  price,
  favourite,
  oldPrice,
  url,
  badge,
  image,
  imageColor,
  imagesExperimental,
  imageDisplayMode = 'single',
  imagesExperimentalOverlayDisabled = false,
  renderFooter,
  renderPriceBreakdown,
  onClick,
  status,
  bumpText,
  testId,
  hasFavouritedChanged,
  itemBox,
  openItemInNewTab = false,
}: Props) => {
  const renderFavouriteIcon = () => {
    if (!favourite) return null

    return (
      <ItemBoxFavouriteIcon
        {...favourite}
        hasFavouritedChanged={hasFavouritedChanged}
        hasOverlay={!!status}
        testId={testId}
      />
    )
  }

  const renderBadges = () => {
    const iconName = getIconName(itemBox?.badge?.icon)
    const secondaryBadge = itemBox?.badge && {
      content: itemBox.badge.title,
      icon: iconName ? <Icon name={iconName} color={itemBox.badge.iconColor} /> : undefined,
    }
    const badgeClassName = itemBox?.badge?.amplifiedText ? 'badge-amplified-text' : undefined

    return (
      <div data-testid={getTestId(testId, 'badge-container')}>
        <Cell styling="narrow" theme="transparent">
          <div className="u-flexbox u-flex-direction-column u-align-items-flex-start u-gap-small">
            {badge ? <Badge testId={getTestId(testId, 'badge')} {...badge} /> : null}
            {secondaryBadge ? (
              <div className={badgeClassName}>
                <Badge testId={getTestId(testId, 'secondary-badge')} {...secondaryBadge} />
              </div>
            ) : null}
          </div>
        </Cell>
      </div>
    )
  }

  const renderOverlay = () => {
    const showBadges = itemBox?.badge || badge

    return (
      <>
        <div>{showBadges && renderBadges()}</div>
        {status ? <ItemBoxMessage testId={testId} {...status} /> : null}
      </>
    )
  }

  const renderExperimentalImagesCollage = () => {
    if (!imagesExperimental || imagesExperimental.length < MIN_COLLAGE_IMAGES_COUNT) return null

    const showAdditionalImagesOverlay =
      imagesExperimental.length > MIN_COLLAGE_IMAGES_COUNT && !imagesExperimentalOverlayDisabled
    const additionalImagesCount = imagesExperimental.length - MIN_COLLAGE_IMAGES_COUNT + 1

    return (
      <div className="new-item-box__collage" data-testid={getTestId(testId, 'collage')}>
        <div className="new-item-box__image collage--image-1">
          <Image
            src={imagesExperimental[0]}
            scaling="cover"
            ratio="portrait"
            color={imageColor}
            alt={itemBox?.accessibilityLabel}
            testId={getTestId(testId, 'image-1')}
          />
        </div>
        <div className="new-item-box__image collage--image-2">
          <Image
            src={imagesExperimental[1]}
            scaling="cover"
            ratio="portrait"
            color={imageColor}
            alt={itemBox?.accessibilityLabel}
            testId={getTestId(testId, 'image-2')}
          />
        </div>
        <div className="new-item-box__image collage--image-3">
          <Image
            src={imagesExperimental[2]}
            scaling="cover"
            ratio="portrait"
            color={imageColor}
            alt={itemBox?.accessibilityLabel}
            testId={getTestId(testId, 'image-3')}
          />
          {showAdditionalImagesOverlay ? (
            <div className="new-item-box__image-overlay">
              <Text type="heading" theme="inverse" text={`+${additionalImagesCount}`} as="span" />
            </div>
          ) : null}
        </div>
      </div>
    )
  }

  const renderImage = () => {
    return (
      <div className="new-item-box__image">
        <Image
          src={image}
          scaling="cover"
          ratio="portrait"
          color={imageColor}
          alt={itemBox?.accessibilityLabel}
          testId={getTestId(testId, 'image')}
          styling="rounded"
        />
      </div>
    )
  }

  const itemBoxOverlayClasses = classNames('new-item-box__overlay', {
    'new-item-box__overlay--clickable': !!onClick || !!url,
  })

  return (
    <div className="new-item-box__container" data-testid={testId}>
      <div className="u-position-relative u-min-height-none u-flex-auto new-item-box__image-container">
        <ProactiveModerationItemCheckbox itemId={itemId} />
        {imageDisplayMode === 'collage'
          ? renderExperimentalImagesCollage() || renderImage()
          : renderImage()}
        {renderFavouriteIcon()}
        {url ? (
          <a
            href={url}
            className={itemBoxOverlayClasses}
            onClick={onClick}
            data-testid={getTestId(testId, 'overlay-link')}
            title={itemBox?.accessibilityLabel}
            target={openItemInNewTab ? '_blank' : '_self'}
            rel="noreferrer"
          >
            {renderOverlay()}
          </a>
        ) : (
          <div className={itemBoxOverlayClasses} onClick={onClick} aria-hidden="true">
            {renderOverlay()}
          </div>
        )}
      </div>

      <div className="new-item-box__summary">
        <Cell styling="tight">
          <InformationBreakdown
            description={{
              title: itemBox?.firstLine || '',
              subtitle: itemBox?.secondLine || '',
              exposure: itemBox?.exposure,
              exposures: itemBox?.exposures,
            }}
            testId={testId}
            renderPriceBreakdown={renderPriceBreakdown}
            renderPrice={<ItemBoxPricing price={price} oldPrice={oldPrice} testId={testId} />}
            bumpText={bumpText}
            actions={itemBox?.actions}
            itemId={itemBox?.itemId}
          />
          {renderFooter && (
            <div data-testid={getTestId(testId, 'footer')}>
              <Spacer />
              {renderFooter}
            </div>
          )}
        </Cell>
      </div>
    </div>
  )
}

export default ItemBox
