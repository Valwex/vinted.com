'use client'

import { Heart16, HeartFilled16 } from '@vinted/monochrome-icons'
import { Animation, Icon, Spacer, Text } from '@vinted/web-ui'
import classNames from 'classnames'
import { ReactNode } from 'react'

import { getTestId } from '@marketplace-web/vendor-abstractions/web-ui-util'
import { useAsset } from '@marketplace-web/shared/assets'
import { useTranslate } from '@marketplace-web/i18n/i18n-feature'
import { useFeatureSwitch } from '@marketplace-web/feature-flags/feature-switches-data'

type Props = {
  favourited: boolean
  count: number
  onClick?: () => void
  titleIcon?: string
  experimentalIndicator?: ReactNode
  /**
   * Adds data-testid attribute to parent and children components.
   * When used, --favourite-icon and --favourite-count suffixes applied accordingly.
   */
  hasFavouritedChanged?: boolean
  hasOverlay: boolean
  testId?: string
}

const ItemBoxFavouriteIcon = ({
  favourited = false,
  count = 0,
  onClick,
  titleIcon,
  experimentalIndicator,
  hasFavouritedChanged,
  hasOverlay,
  testId,
}: Props) => {
  const translate = useTranslate('item.a11y')
  const asset = useAsset('/assets/animations')

  const isPrideFavouriteButtonEnabled = useFeatureSwitch('pride_favourite_button')

  const getAriaLabel = () => {
    const textWithoutCount = translate(favourited ? 'favorited' : 'not_favorited')
    const textWithCount = translate(favourited ? 'unfavourite' : 'favourite', { count }, { count })

    return count > 0 ? textWithCount : textWithoutCount
  }

  const showPrideHeart = isPrideFavouriteButtonEnabled && favourited && hasFavouritedChanged

  const renderIcon = () => {
    if (experimentalIndicator) return experimentalIndicator

    if (showPrideHeart) {
      return (
        <Animation
          size={Animation.Size.Small}
          animationUrl={asset('pride-heart16.json')}
          aria={{ 'aria-hidden': 'true' }}
          loop={false}
        />
      )
    }

    return (
      <Icon
        name={favourited ? HeartFilled16 : Heart16}
        color={favourited ? 'warning-default' : 'greyscale-level-2'}
        title={titleIcon}
        testId={favourited ? 'favourite-filled-icon' : 'favourite-icon'}
      />
    )
  }

  const handleClick = () => {
    if (!onClick) return

    onClick()
  }

  const renderActionFeedback = () => (
    <span aria-live="polite" className="u-visually-hidden">
      {translate(favourited ? 'added_to_favorites' : 'removed_from_favorites')}
    </span>
  )

  return (
    <div className="u-position-absolute u-right u-bottom u-zindex-bump">
      <button
        aria-pressed={favourited}
        aria-label={getAriaLabel()}
        data-testid={getTestId(testId, 'favourite')}
        onClick={handleClick}
        type="button"
        className={classNames(
          'u-background-white u-flexbox u-align-items-center new-item-box__favourite-icon',
          {
            'new-item-box__favourite-icon-overlay': hasOverlay,
          },
        )}
      >
        {renderIcon()}
        {count > 0 && (
          <>
            <Spacer orientation="vertical" size="small" />
            <Text text={count} type="caption" as="span" testId="favourite-count-text" />
          </>
        )}
      </button>
      {renderActionFeedback()}
    </div>
  )
}

export default ItemBoxFavouriteIcon
