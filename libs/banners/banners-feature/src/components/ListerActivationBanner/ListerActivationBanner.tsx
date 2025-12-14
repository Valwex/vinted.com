'use client'

import { Ref, forwardRef, useState } from 'react'
import { Button, Image, Text } from '@vinted/web-ui'
import { X12 } from '@vinted/monochrome-icons'

import { useBreakpoint, BreakpointMap } from '@marketplace-web/breakpoints/breakpoints-feature'
import { useTracking } from '@marketplace-web/observability/event-tracker-data'
import { ListerActivationBannerModel, clickEvent } from '@marketplace-web/banners/banners-data'

type BreakpointItemCount = {
  default: number
} & Partial<Record<keyof BreakpointMap, number>>

type Props = {
  breakpointItemCount: BreakpointItemCount
  banner: ListerActivationBannerModel
  onClose: (banner: ListerActivationBannerModel) => void
}

// TODO: remove `forwardRef` in React 19
const ListerActivationBanner = forwardRef(
  ({ breakpointItemCount, banner, onClose }: Props, ref?: Ref<HTMLDivElement>) => {
    const { active } = useBreakpoint()
    const [isClosed, setIsClosed] = useState(false)
    const { track } = useTracking()

    function handleClose() {
      track(
        clickEvent({
          target: 'close_lister_activation_banner',
          targetDetails: banner.catalogId.toString(),
        }),
      )

      setIsClosed(true)

      onClose(banner)
    }

    function handleLinkClick() {
      track(
        clickEvent({
          target: 'upload_after_lister_activation_banner',
          targetDetails: banner.catalogId.toString(),
        }),
      )
    }

    function getBreakpointPhotoItems(photoItems: Array<string>) {
      let itemCount = breakpointItemCount.default
      const targetBreakpoint = active.find(breakpoint => breakpointItemCount[breakpoint])

      if (targetBreakpoint)
        itemCount = breakpointItemCount[targetBreakpoint] || breakpointItemCount.default

      return photoItems.slice(0, itemCount)
    }

    function renderCloseButton() {
      return (
        <div className="lister-activation-banner__close">
          <Button
            inline
            styling="flat"
            iconName={X12}
            size="small"
            onClick={handleClose}
            testId="lister-activation-banner-close-button"
          />
        </div>
      )
    }

    function renderPhotoItems(photoItems: Array<string>) {
      return (
        <div className="lister-activation-banner__photos">
          {photoItems.map(item => (
            <div className="lister-activation-banner__photo-item" key={item}>
              <Image styling="rounded" ratio="small-portrait" src={item} loading="lazy" />
            </div>
          ))}
        </div>
      )
    }

    function renderBottomInfo() {
      return (
        <div className="lister-activation-banner__bottom-info">
          <div className="lister-activation-banner__bottom-info-text">
            <Text as="h3" type="subtitle" text={banner.subtitle} />
            <Text as="h2" type="heading" text={banner.title} />
          </div>
          <div className="lister-activation-banner__bottom-info-action">
            <Button
              styling="filled"
              text={banner.buttonLinkText}
              onClick={handleLinkClick}
              url={banner.buttonLinkUrl}
            />
          </div>
        </div>
      )
    }

    if (isClosed) return null

    return (
      <div className="lister-activation-banner" ref={ref}>
        {renderCloseButton()}
        {renderPhotoItems(getBreakpointPhotoItems(banner.imageUrls))}
        {renderBottomInfo()}
      </div>
    )
  },
)

export default ListerActivationBanner
