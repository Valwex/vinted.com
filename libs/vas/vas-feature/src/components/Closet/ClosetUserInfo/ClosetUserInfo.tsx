'use client'

import { MouseEvent } from 'react'
import { Badge, Button, Cell, Image, Rating, Spacer, Text } from '@vinted/web-ui'
import { Eye16 } from '@vinted/monochrome-icons'

import { useBreakpoint } from '@marketplace-web/breakpoints/breakpoints-feature'
import { navigateToPage } from '@marketplace-web/browser/browser-navigation-util'
import { useTracking } from '@marketplace-web/observability/event-tracker-data'
import { useTranslate } from '@marketplace-web/i18n/i18n-feature'
import { EMPTY_USER_IMAGE_NAME, useAsset } from '@marketplace-web/shared/assets'
import { clickListItemEvent, ClosetUserModel } from '@marketplace-web/vas/vas-data'

import { MEMBER_PROFILE_URL } from '../../../constants/routes'

type Props = {
  user: ClosetUserModel
  position: number
  isBusinessUser: boolean
  isPreview: boolean
  onClick?: () => void
  onViewProfileClick?: () => void
}

const ClosetUserInfo = ({
  user,
  position,
  isBusinessUser,
  isPreview,
  onClick,
  onViewProfileClick,
}: Props) => {
  const noPhotoAsset = useAsset('assets/no-photo')
  const breakpoints = useBreakpoint()
  const translate = useTranslate('closet_promotion.listing')
  const userTranslate = useTranslate('user')
  const businessTranslate = useTranslate('business')
  const { track } = useTracking()

  const { id, login, photoUrl, feedbackReputation, feedbackCount } = user
  const imageSize = breakpoints.phones ? 'medium' : 'large'
  const ratingSize = breakpoints.phones ? 'small' : 'regular'
  const cellStyling = breakpoints.phones ? 'narrow' : undefined

  function handleClick(event: MouseEvent) {
    event.preventDefault()

    track(
      clickListItemEvent({
        id: user.id,
        position,
        contentType: 'promoted_closet',
        contentSource: isPreview ? 'promoted_closets_preview' : 'promoted_closets',
      }),
    )

    onClick?.()

    navigateToPage(MEMBER_PROFILE_URL(id))
  }

  function handleViewProfileClick(event: MouseEvent) {
    event.preventDefault()

    onViewProfileClick?.()

    navigateToPage(MEMBER_PROFILE_URL(id))
  }

  function renderTitle() {
    return (
      <>
        <a href={MEMBER_PROFILE_URL(id)} onClick={handleClick} tabIndex={-1} aria-hidden="true">
          <Text type="title" as="span">
            {login}
          </Text>
        </a>
        {isBusinessUser && (
          <>
            <Spacer size="small" orientation="vertical" />
            <Badge content={businessTranslate('badge')} />
          </>
        )}
      </>
    )
  }

  const renderSuffix = () => {
    if (isPreview) {
      return (
        <Badge
          iconName={Eye16}
          content={translate('preview_badge')}
          theme="muted"
          styling="light"
          testId="closet-promotion--preview-badge"
        />
      )
    }

    return (
      <Button
        size="small"
        text={translate('actions.view_seller')}
        url={MEMBER_PROFILE_URL(id)}
        onClick={handleViewProfileClick}
      />
    )
  }

  return (
    <Cell
      prefix={
        <a href={MEMBER_PROFILE_URL(id)} onClick={handleClick} tabIndex={-1} aria-hidden="true">
          <Image
            role="img"
            src={photoUrl || noPhotoAsset(EMPTY_USER_IMAGE_NAME)}
            size={imageSize}
            styling="circle"
          />
        </a>
      }
      suffix={renderSuffix()}
      title={renderTitle()}
      body={
        <Rating
          aria={{ 'aria-hidden': 'true' }}
          value={feedbackReputation}
          text={feedbackCount}
          emptyStateText={userTranslate('feedback.no_reviews')}
          size={ratingSize}
        />
      }
      styling={cellStyling}
      aria={{
        'aria-label': translate(
          'a11y.description',
          { count: feedbackCount, max_rating: 5, rating: feedbackReputation, username: login },
          { count: feedbackCount },
        ),
      }}
    />
  )
}

export default ClosetUserInfo
