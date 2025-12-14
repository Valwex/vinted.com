'use client'

import { MouseEvent, useCallback, useEffect, useMemo, useState } from 'react'
import { Button, Card, Cell, Image, InfoBanner, Spacer, Text } from '@vinted/web-ui'
import type { InfoBannerType } from '@vinted/web-ui'
import { v4 as uuid } from 'uuid'

import {
  TaxpayerBannerRenderLocation,
  TaxpayerBannerStyleType,
  TaxpayerBannerTrackingId,
  TaxpayerBannerType,
  transformTaxpayerEducation,
  dismissTaxpayerFillFormModal,
  dismissTaxpayerRestrictionBanner,
  dismissTaxpayerRestrictionModal,
  getTaxpayersSpecialVerificationEducation,
  TaxpayerBannerActionModel,
  TaxpayerBannerModel,
  TaxpayerEducationModel,
  taxpayersFormForceTriggerEvent,
  taxpayersClickEvent,
  taxpayersViewEvent,
  clickEvent,
} from '@marketplace-web/taxpayers/taxpayers-data'

import { useBreakpoint } from '@marketplace-web/breakpoints/breakpoints-feature'
import {
  getSessionStorageItem,
  setSessionStorageItem,
} from '@marketplace-web/browser/browser-storage-util'
import { navigateToPage } from '@marketplace-web/browser/browser-navigation-util'
import { useTracking } from '@marketplace-web/observability/event-tracker-data'
import { useFeatureSwitch } from '@marketplace-web/feature-flags/feature-switches-data'
import { useSession } from '@marketplace-web/shared/session-data'
import { UiState } from '@marketplace-web/shared/ui-state-util'
import { useAsset } from '@marketplace-web/shared/assets'
import { useRefUrl } from '@marketplace-web/ref-url/ref-url-feature'

import TaxpayerRestrictionInfoModal from '../Taxpayer/TaxpayerRestrictionInfoModal'
import TaxpayersSpecialVerificationRestrictionInfoModal from '../Taxpayer/TaxpayersSpecialVerificationRestrictionInfoModal'
import TaxpayerEducationModal from '../../pages/TaxpayerForm/components/TaxpayerEducationModal'
import TaxpayersSpecialVerificationFailureModal from '../TaxpayersSpecialVerificationFailureModal'
import TaxpayerFillFormModal from '../Taxpayer/TaxpayerFillFormModal'

import { TaxpayerSpecialVerificationLinks } from '../../constants/taxpayer'
import { SPECIAL_VERIFICATION_FORM_URL_WITH_REF } from '../../constants/routes'

type Props = {
  banner: TaxpayerBannerModel
  isBannerInFeed: boolean
  renderLocation: TaxpayerBannerRenderLocation
  screen?: string
}

type InfoBannerActionProps = {
  text: string
  callback: (event: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void
}

type InfoBannerActionReturnProps =
  | []
  | [InfoBannerActionProps]
  | [InfoBannerActionProps, InfoBannerActionProps]

const WARDROBE_FILL_FORM_MODAL_KEY = 'is_taxpayer_fill_form_wardrobe_modal_seen'
const FEED_FILL_FORM_MODAL_KEY = 'is_taxpayer_fill_form_feed_modal_seen'

const TaxpayerBanner = ({ banner, isBannerInFeed, screen, renderLocation }: Props) => {
  const { track } = useTracking()
  const refUrl = useRefUrl()
  const asset = useAsset('/assets/taxpayers/banner')
  const breakpoints = useBreakpoint()

  const [show, setShow] = useState(true)
  const [showTaxpayersRestrictionModal, setShowTaxpayersRestrictionModal] = useState(true)
  const [
    showTaxpayersSpecialVerificationRestrictionModal,
    setShowTaxpayersSpecialVerificationRestrictionModal,
  ] = useState(true)

  const [taxpayersEducation, setTaxpayersEducation] = useState<TaxpayerEducationModel | null>(null)
  const [showTaxpayersEducationModal, setShowTaxpayersEducationModal] = useState(false)
  const [taxpayerEducationModalUiState, setTaxpayerEducationModalUiState] = useState(UiState.Idle)

  const [
    showTaxpayersSpecialVerificationFailureModal,
    setShowTaxpayersSpecialVerificationFailureModal,
  ] = useState(false)

  const { screen: screenName } = useSession()
  const isTaxpayerSpecialVerificationBannerFsEnabled = useFeatureSwitch(
    'web_special_verification_taxpayers_banners',
  )
  const specialVerificationSessionId = useMemo(() => uuid(), [])

  const [showFillFormModal, setShowFillFormModal] = useState(false)
  const isForcedFormEnabled = useFeatureSwitch('web_taxpayers_banners_force_redirect')

  const shouldSkipFormForce =
    (banner.id === TaxpayerBannerTrackingId.Restricted ||
      banner.id === TaxpayerBannerTrackingId.SellingBlocked) &&
    banner.newsFeed.showModal &&
    isBannerInFeed

  const trackFormForce = useCallback(() => {
    track(
      taxpayersFormForceTriggerEvent({
        screen: screenName,
      }),
    )
  }, [screenName, track])

  useEffect(() => {
    if (!isForcedFormEnabled) return
    if (renderLocation !== TaxpayerBannerRenderLocation.Wardrobe) return
    if (getSessionStorageItem(WARDROBE_FILL_FORM_MODAL_KEY) === 'true') return
    if (
      banner.id !== TaxpayerBannerTrackingId.DataRequest &&
      banner.id !== TaxpayerBannerTrackingId.SecondReminder &&
      banner.id !== TaxpayerBannerTrackingId.Restricted &&
      banner.id !== TaxpayerBannerTrackingId.SellingBlocked
    )
      return

    trackFormForce()
    setShowFillFormModal(true)
    setSessionStorageItem(WARDROBE_FILL_FORM_MODAL_KEY, 'true')
  }, [banner.id, isForcedFormEnabled, renderLocation, trackFormForce])

  useEffect(() => {
    if (!isForcedFormEnabled) return
    if (renderLocation !== TaxpayerBannerRenderLocation.Feed) return
    if (!banner.newsFeed.forceRedirect) return

    if (getSessionStorageItem(FEED_FILL_FORM_MODAL_KEY) === 'true' || shouldSkipFormForce) return

    trackFormForce()
    setShowFillFormModal(true)
    setSessionStorageItem(FEED_FILL_FORM_MODAL_KEY, 'true')
    dismissTaxpayerFillFormModal()
  }, [
    shouldSkipFormForce,
    banner.newsFeed.forceRedirect,
    isForcedFormEnabled,
    renderLocation,
    trackFormForce,
  ])

  useEffect(() => {
    if (!banner.id) return
    if (isBannerInFeed && banner.newsFeed.dismissed) return

    track(
      taxpayersViewEvent({
        target: 'banner',
        target_details: banner.id,
        screen: screen || screenName,
      }),
    )
  }, [
    banner.id,
    banner.isSpecialVerification,
    banner.newsFeed.dismissed,
    isBannerInFeed,
    screen,
    screenName,
    track,
  ])

  useEffect(() => {
    const fetchTaxpayersEducationSections = async () => {
      setTaxpayerEducationModalUiState(UiState.Pending)

      const response = await getTaxpayersSpecialVerificationEducation()

      if ('errors' in response) {
        setTaxpayerEducationModalUiState(UiState.Failure)

        return
      }

      const education = transformTaxpayerEducation(response.education)

      setTaxpayerEducationModalUiState(UiState.Success)
      setTaxpayersEducation(education)
    }

    if (!banner.isSpecialVerification) return

    fetchTaxpayersEducationSections()
  }, [banner.isSpecialVerification])

  const bannerTypeMapping = {
    [TaxpayerBannerType.Warning]: 'warning',
    [TaxpayerBannerType.Error]: 'error',
    [TaxpayerBannerType.Success]: 'success',
    [TaxpayerBannerType.Info]: 'info',
  } satisfies Record<TaxpayerBannerType, InfoBannerType>
  const maximumBannerActions = 2

  const getBannerType = () => {
    return bannerTypeMapping[banner.type]
  }

  const handleBannerActionClick = (actionLink: string) => {
    navigateToPage(`${actionLink}?ref_url=${refUrl}`)
  }

  const handleSpecialVerificationBannerActionClick = (actionLink: string) => {
    switch (actionLink) {
      case TaxpayerSpecialVerificationLinks.StartVerification:
        navigateToPage(SPECIAL_VERIFICATION_FORM_URL_WITH_REF(refUrl, specialVerificationSessionId))
        break

      case TaxpayerSpecialVerificationLinks.CorrectYourReport:
        setShowTaxpayersSpecialVerificationFailureModal(true)
        break

      case TaxpayerSpecialVerificationLinks.NavigateToSpecialVerificationForm:
        navigateToPage(SPECIAL_VERIFICATION_FORM_URL_WITH_REF(refUrl, specialVerificationSessionId))
        break

      default:
        break
    }
  }

  const transformBannerAction = (action: TaxpayerBannerActionModel) => ({
    text: action.title,
    callback: () => {
      track(
        taxpayersClickEvent({
          screen: screenName,
          target: 'banner',
          target_details: action.type === 'primary' ? 'finalise' : 'learn',
          target_name: banner.id || '',
        }),
      )

      if (banner.isSpecialVerification) {
        handleSpecialVerificationBannerActionClick(action.link)

        return
      }

      handleBannerActionClick(action.link)
    },
  })

  const getBannerActions = (): InfoBannerActionReturnProps => {
    if (!banner.actions) return []

    const primaryAction = banner.actions.find(action => action.type === 'primary')
    const secondaryAction = banner.actions.find(action => action.type === 'secondary')

    if (banner.actions.length === maximumBannerActions && primaryAction && secondaryAction) {
      return [transformBannerAction(primaryAction), transformBannerAction(secondaryAction)]
    }

    if (banner.actions.length === 1 && primaryAction) {
      return [transformBannerAction(primaryAction)]
    }

    if (banner.actions.length === 1 && secondaryAction) {
      return [transformBannerAction(secondaryAction)]
    }

    return []
  }

  const handleBannerDismiss = () => {
    if (
      banner.id !== TaxpayerBannerTrackingId.VerificationSuccess &&
      !(banner.newsFeed.isDismissible && isBannerInFeed)
    )
      return

    setShow(false)
    dismissTaxpayerRestrictionBanner()

    track(
      taxpayersClickEvent({
        screen: screenName,
        target: 'banner',
        target_name: banner.id || '',
        target_details: 'close',
      }),
    )
  }

  const handleTaxpayersRestrictionModalClose = () => {
    setShowTaxpayersRestrictionModal(false)
    dismissTaxpayerRestrictionModal()
  }

  const handleTaxpayersSpecialVerificationRestrictionModalClose = () => {
    setShowTaxpayersSpecialVerificationRestrictionModal(false)
    dismissTaxpayerRestrictionModal()
  }

  const handleTaxpayersEducationModalClose = () => {
    setShowTaxpayersEducationModal(false)
  }

  const handleTaxpayersSpecialVerificationFailureModalClose = () => {
    setShowTaxpayersSpecialVerificationFailureModal(false)
  }

  const handleTaxpayersEducationModalConfirm = () => {
    track(
      clickEvent({
        screen: 'taxpayers_special_verification_education',
        target: 'start_special_verification',
        targetDetails: JSON.stringify({ verification_id: specialVerificationSessionId }),
      }),
    )

    navigateToPage(SPECIAL_VERIFICATION_FORM_URL_WITH_REF(refUrl, specialVerificationSessionId))
  }

  const renderTaxpayersRestrictionModal = () => {
    if (!isBannerInFeed) return null
    if (!banner.newsFeed.showModal) return null
    if (banner.isSpecialVerification) return null

    return (
      <TaxpayerRestrictionInfoModal
        show={showTaxpayersRestrictionModal}
        isSellingBlocked={banner.id === TaxpayerBannerTrackingId.SellingBlocked}
        screen={screen}
        onClose={handleTaxpayersRestrictionModalClose}
      />
    )
  }

  const renderTaxpayersSpecialVerificationRestrictionModal = () => {
    if (!isBannerInFeed) return null
    if (!banner.newsFeed.showModal) return null
    if (!banner.isSpecialVerification) return null

    if (!isTaxpayerSpecialVerificationBannerFsEnabled) return null

    return (
      <TaxpayersSpecialVerificationRestrictionInfoModal
        show={showTaxpayersSpecialVerificationRestrictionModal}
        screen={screen}
        onClose={handleTaxpayersSpecialVerificationRestrictionModalClose}
      />
    )
  }

  const renderTaxpayersEducationalModal = () => {
    if (!banner.isSpecialVerification) return null

    return (
      <TaxpayerEducationModal
        show={showTaxpayersEducationModal}
        taxpayerEducation={taxpayersEducation}
        isSpecialVerification={banner.isSpecialVerification}
        uiState={taxpayerEducationModalUiState}
        onClose={handleTaxpayersEducationModalClose}
        onConfirm={handleTaxpayersEducationModalConfirm}
      />
    )
  }

  const renderSpecialVerificationFailureModal = () => {
    if (!banner.isSpecialVerification) return null

    return (
      <TaxpayersSpecialVerificationFailureModal
        show={showTaxpayersSpecialVerificationFailureModal}
        onClose={handleTaxpayersSpecialVerificationFailureModalClose}
      />
    )
  }

  const handleFillFormModalClose = () => {
    setShowFillFormModal(false)
  }

  const renderFillFormModal = () => (
    <TaxpayerFillFormModal show={showFillFormModal} onClose={handleFillFormModalClose} />
  )

  if (banner.newsFeed.dismissed && banner.id === TaxpayerBannerTrackingId.VerificationSuccess)
    return null
  if (isBannerInFeed && banner.newsFeed.dismissed) return null
  if (!show) return null

  const isBannnerClosable =
    (banner.newsFeed.isDismissible && isBannerInFeed) ||
    banner.id === TaxpayerBannerTrackingId.VerificationSuccess

  // TODO: this will be removed/scaled, ab test is in backend
  const handleIllustratedBannerActionClick = () => {
    const action = banner.actions?.[0]

    if (!action) return

    track(
      taxpayersClickEvent({
        screen: screenName,
        target: 'banner',
        target_details: action.type === 'primary' ? 'finalise' : 'learn',
        target_name: banner.id || '',
      }),
    )

    if (banner.isSpecialVerification) {
      handleSpecialVerificationBannerActionClick(action.link)

      return
    }

    handleBannerActionClick(action.link)
  }

  if (!banner.showInScreens.includes(renderLocation)) return null

  const getBannerCardTheme = () => {
    if (banner.type === TaxpayerBannerType.Warning) {
      return 'exposeLightExperimental'
    }

    return 'primaryLightExperimental'
  }

  const getBannerButtonTheme = () => {
    if (banner.type === TaxpayerBannerType.Warning) {
      return 'expose'
    }

    return undefined
  }

  const trackLearnMoreClick = () => {
    track(
      taxpayersClickEvent({
        screen: screenName,
        target: 'banner',
        target_details: 'learn',
        target_name: banner.id || '',
      }),
    )
  }

  // This function serves purpose for ab test since we can not modify <a color in <Text /> and should be cleaned up
  const renderBannerBody = () => {
    if (!banner.body.includes('<a'))
      return <Text html text={banner.body} as="p" testId={`taxpayer-banner-body-${banner.id}`} />

    return (
      <div
        className="taxpayer-banner-body"
        onClick={trackLearnMoreClick}
        onKeyDown={trackLearnMoreClick}
        tabIndex={0}
        role="link"
      >
        <Text html text={banner.body} as="p" testId={`taxpayer-banner-body-${banner.id}`} />
      </div>
    )
  }

  const renderModals = () => {
    return (
      <>
        {renderTaxpayersRestrictionModal()}
        {renderTaxpayersSpecialVerificationRestrictionModal()}
        {renderTaxpayersEducationalModal()}
        {renderSpecialVerificationFailureModal()}
        {renderFillFormModal()}
      </>
    )
  }

  // TODO: this will be removed/scaled, ab test is in backend
  if (
    banner.style?.type === TaxpayerBannerStyleType.Illustrated &&
    banner.actions &&
    !breakpoints.phones
  ) {
    return (
      <>
        <div>
          <Card experimentalTheme={getBannerCardTheme()}>
            <Cell
              styling="wide"
              theme="transparent"
              title={<Text as="h1" text={banner.title} type="heading" />}
              body={renderBannerBody()}
              prefix={
                <Image
                  src={asset(`${banner.style.image || ''}.svg`)}
                  size="x2-large"
                  testId="taxpayer-banner-illustration"
                />
              }
              suffix={
                <Button
                  text={banner.actions[0]?.title}
                  styling="filled"
                  size={breakpoints.phones ? 'small' : undefined}
                  testId={`taxpayer-banner-action-${banner.id}`}
                  theme={getBannerButtonTheme()}
                  onClick={handleIllustratedBannerActionClick}
                />
              }
            />
          </Card>
        </div>
        {renderModals()}
      </>
    )
  }

  // TODO: this will be removed/scaled, ab test is in backend
  if (
    banner.style?.type === TaxpayerBannerStyleType.Illustrated &&
    banner.actions &&
    breakpoints.phones
  ) {
    return (
      <>
        <div>
          <Card experimentalTheme={getBannerCardTheme()}>
            <Cell theme="transparent" styling="wide">
              <Text as="h1" text={banner.title} type="title" />
              <Cell
                styling="tight"
                theme="transparent"
                body={renderBannerBody()}
                suffix={
                  <Image
                    src={asset(`${banner.style.image || ''}.svg`)}
                    size="x-large"
                    testId="taxpayer-banner-illustration"
                  />
                }
              />
              <Spacer />
              <Button
                text={banner.actions[0]?.title}
                styling="filled"
                testId={`taxpayer-banner-action-${banner.id}`}
                theme={getBannerButtonTheme()}
                onClick={handleIllustratedBannerActionClick}
              />
            </Cell>
          </Card>
        </div>
        {renderModals()}
      </>
    )
  }

  return (
    <>
      <InfoBanner
        title={banner.title}
        body={<Text text={banner.body} html as="p" testId={`taxpayer-banner-body-${banner.id}`} />}
        closable={isBannnerClosable}
        styling="tight"
        type={getBannerType()}
        actions={getBannerActions()}
        onClose={handleBannerDismiss}
        testId="taxpayer-banner"
      />
      <Spacer size="x-small" />
      {renderModals()}
    </>
  )
}

export default TaxpayerBanner
