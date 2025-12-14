'use client'

import { QuestionCircle16, X24 } from '@vinted/monochrome-icons'
import {
  BottomSheet,
  Button,
  Cell,
  Dialog,
  Divider,
  Image,
  Navigation,
  PromoBanner,
  Spacer,
  Text,
} from '@vinted/web-ui'
import { useState } from 'react'

import { useBreakpoint } from '@marketplace-web/breakpoints/breakpoints-feature'
import { useTracking } from '@marketplace-web/observability/event-tracker-data'
import { useTranslate } from '@marketplace-web/i18n/i18n-feature'
import { useAsset } from '@marketplace-web/shared/assets'
import {
  clickEvent,
  clickClosetPromotionEvent,
  ClosetModel,
  VasEntryPointModel,
  ContentSource,
} from '@marketplace-web/vas/vas-data'

import { getPromotedClosetContentSource } from '../../utils/contentSource'
import Closet from '../Closet'
import ClosetPromotionCheckout from './ClosetPromotionCheckout'

type Props = {
  wide?: boolean
  banner?: VasEntryPointModel
  closet: ClosetModel
  position: number
  contentSource?: ContentSource
  homepageSessionId?: string
  isPreview?: boolean
  onClick?: () => void
}

const ClosetPromotion = ({
  wide = false,
  banner,
  closet,
  position,
  contentSource,
  homepageSessionId,
  isPreview = false,
  onClick,
}: Props) => {
  const { track } = useTracking()
  const breakpoints = useBreakpoint()
  const translate = useTranslate('closet_promotion.listing')
  const asset = useAsset('assets/closet-promotion')

  const [isHelpVisible, setIsHelpVisible] = useState(false)
  const [isPrecheckoutOpen, setIsPrecheckoutOpen] = useState(false)

  function handlePrecheckoutOpen() {
    setIsPrecheckoutOpen(true)
  }

  function handlePrecheckoutClose() {
    setIsPrecheckoutOpen(false)
  }

  function handleCheckoutButtonClick() {
    handlePrecheckoutOpen()
    track(
      clickEvent({
        target: 'promote_closet',
      }),
    )
  }

  function handleHelpClick() {
    setIsHelpVisible(true)

    track(
      clickClosetPromotionEvent({
        ownerId: closet.user.id,
        contentSource: getPromotedClosetContentSource(contentSource),
        target: 'spotlight_information',
      }),
    )
  }

  function handleHelpClose() {
    setIsHelpVisible(false)
  }

  function renderClosetPromotionBanner() {
    if (!banner || !closet.showBanner) return null

    return (
      <>
        <Spacer />
        <PromoBanner
          title={banner.title}
          body={banner.subtitle}
          icon={<Image src={asset('diamond-star-32.svg')} />}
          styling="tight"
          clickable
          actionText={banner.buttonTitle ?? ''}
          onClick={handleCheckoutButtonClick}
          testId="closet-promotion-banner"
        />
      </>
    )
  }

  function renderHelpPopup() {
    if (breakpoints.phones) {
      return (
        <BottomSheet
          isVisible={isHelpVisible}
          onClose={handleHelpClose}
          title={translate('help.title_v2')}
          closeButtonEnabled
          closeOnOverlayClick
        >
          <Cell styling="wide" body={translate('help.body_v2')} />
        </BottomSheet>
      )
    }

    return (
      <Dialog show={isHelpVisible} defaultCallback={handleHelpClose} closeOnOverlay>
        <Navigation
          body={
            <Cell>
              <Text text={translate('help.title_v2')} type="title" as="span" />
            </Cell>
          }
          right={
            <Button
              styling="flat"
              onClick={handleHelpClose}
              iconName={X24}
              theme="amplified"
              inline
              testId="closet-promotion--help-close-button"
            />
          }
        />
        <Divider />
        <Cell styling="wide" body={translate('help.body_v2')} />
      </Dialog>
    )
  }

  function renderHelp() {
    return (
      <>
        <div className="u-flexbox u-align-items-center u-ui-padding-left-medium">
          <Text type="subtitle" as="span">
            {translate('title_v2')}
          </Text>
          <Button
            styling="flat"
            iconName={QuestionCircle16}
            iconColor="greyscale-level-2"
            size="medium"
            inline
            onClick={handleHelpClick}
            testId="closet-promotion--help-button"
            aria={{ 'aria-label': translate('help.title_v2') }}
          />
        </div>
        {renderHelpPopup()}
      </>
    )
  }

  return (
    <>
      <Closet
        user={closet.user}
        items={closet.items}
        wide={wide}
        position={position}
        contentSource={contentSource}
        homepageSessionId={homepageSessionId}
        isPreview={isPreview}
        onClick={onClick}
      />
      {renderHelp()}
      {renderClosetPromotionBanner()}
      {!!banner && closet.showBanner && (
        <ClosetPromotionCheckout
          isOpen={isPrecheckoutOpen}
          handlePrecheckoutClose={handlePrecheckoutClose}
        />
      )}
    </>
  )
}

export default ClosetPromotion
