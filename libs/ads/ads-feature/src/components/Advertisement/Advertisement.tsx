'use client'

import { ReactNode, Suspense, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { find } from 'lodash'
import classNames from 'classnames'

import { AdPage, AdShape, AdsPlacementModel } from '@marketplace-web/ads/ads-data'
import { useFeatureSwitch } from '@marketplace-web/feature-flags/feature-switches-data'
import { useDebounce } from '@marketplace-web/shared/ui-helpers'
import { useAbTest, useTrackAbTest } from '@marketplace-web/feature-flags/ab-tests-data'
import { useSession } from '@marketplace-web/shared/session-data'
import { useBrowserNavigation } from '@marketplace-web/browser/browser-navigation-util'

import AdsContext from '../../containers/AdsProvider/AdsContext'
import AdContent from './AdContent'
import AdPlaceholder from './AdPlaceholder'
import AdErrorBoundary from './AdErrorBoundary'
import AdMock from './AdMock'
import { getAdPlacementId, getIabCategoriesById } from './utils'
import useStickyOptions from '../../hooks/useStickyOptions'

type Props = {
  shape: AdShape
  config?: AdsPlacementModel
  isManuallyRendered?: boolean
  isManuallyRefreshed?: boolean
  isSidebarAd?: boolean
  renderFallback?: () => ReactNode
  suffix?: ReactNode
  isIncremental?: boolean
  categoryId?: number
}

const ITEM_PAGE_REGEX = /^\/items\/\d+-[a-z0-9-]+$/i

const Advertisement = ({
  shape,
  config,
  isSidebarAd = false,
  isManuallyRendered = false,
  isManuallyRefreshed = false,
  renderFallback,
  suffix,
  isIncremental = false,
  categoryId,
}: Props) => {
  const ref = useRef<HTMLDivElement>(null)
  const [isAdRendered, setIsAdRendered] = useState<boolean>(false)
  const [isFallbackShown, setIsFallbackShown] = useState<boolean>(false)
  const hasFallback = Boolean(renderFallback)
  const [isVanAdPrioritized, setIsVanAdPrioritized] = useState(true)
  const { relativeUrl } = useBrowserNavigation()

  const isItemPage = ITEM_PAGE_REGEX.test(relativeUrl)

  const iabItemPageTest = useAbTest('web_iab_item_page_v1')
  useTrackAbTest(iabItemPageTest, isItemPage)

  const iabCategories = iabItemPageTest?.variant === 'on' ? getIabCategoriesById(categoryId) : null

  const isLoggedIn = Boolean(useSession().user)

  const handleVanAdPriority = useCallback(() => {
    setIsVanAdPrioritized(false)
  }, [])

  const updateFallbackVisibility = useDebounce(
    (isAdVisible: boolean) => {
      const shouldShowFallback = !isAdVisible

      // If fallback is already shown, we don't want to start showing the ad later
      if (!isFallbackShown && shouldShowFallback) {
        setIsFallbackShown(shouldShowFallback)
      }
    },
    1500,
    false,
  )

  const { shouldMockAds, placements, generateIncrementalPlacementId, generatePlacementId } =
    useContext(AdsContext)
  const placement = find(placements, { shape })

  // TODO: Rework this when we have real Van ads
  // For now it will be used only under the condition
  // that web_ads_van_placement feature switch is enabled
  const shouldShowVanAd = useFeatureSwitch('web_ads_van_placement')
  const shouldDisableVanAd = useFeatureSwitch('web_ads_disable_van_placement')

  const shouldDisplayVanAd = shouldShowVanAd && !shouldDisableVanAd && isLoggedIn

  const vanPlacement = find(placements, { shape, mediation: 'van' })

  const placementConfig = useMemo(
    () => config || (shouldDisplayVanAd && isVanAdPrioritized && vanPlacement) || placement,
    [config, placement, vanPlacement, shouldDisplayVanAd, isVanAdPrioritized],
  )

  const id = useMemo(
    () => (isIncremental ? generateIncrementalPlacementId() : generatePlacementId(shape)),
    [isIncremental, shape, generateIncrementalPlacementId, generatePlacementId],
  )

  const stickyOptions = useStickyOptions({
    isSticky: placementConfig?.options.isSticky,
  })

  const handleAdRender = useCallback(
    (isAdVisible: boolean) => {
      setIsAdRendered(isAdVisible)
      if (hasFallback) updateFallbackVisibility(isAdVisible)
    },
    [updateFallbackVisibility, hasFallback],
  )

  const hideAd = !placementConfig || (isFallbackShown && hasFallback)

  if (hideAd) return renderFallback?.()

  return (
    <Suspense>
      <AdErrorBoundary
        pageName={placementConfig.page || AdPage.Unknown}
        placementId={getAdPlacementId(placementConfig)}
      >
        {shouldMockAds ? (
          <AdMock shape={shape} isSidebarAd={isSidebarAd} stickyOptions={stickyOptions} />
        ) : (
          <div
            className={classNames(
              'slot-container',
              `slot-container--${shape}`,
              isAdRendered && 'slot-container--rendered',
              isSidebarAd && 'slot-sidebar',
              !!stickyOptions && 'slot-sticky',
            )}
            data-testid="slot-container"
            ref={ref}
            suppressHydrationWarning
            style={{ top: stickyOptions?.offset }}
          >
            <AdPlaceholder shape={shape} />
            <AdContent
              id={id}
              placementConfig={placementConfig}
              isManuallyRefreshed={isManuallyRefreshed}
              isManuallyRendered={isManuallyRendered}
              onAdRender={handleAdRender}
              isAdRendered={isAdRendered}
              handleVanAdPriority={handleVanAdPriority}
              iabCategories={iabCategories}
            />
          </div>
        )}
        {suffix}
      </AdErrorBoundary>
    </Suspense>
  )
}

export default Advertisement
