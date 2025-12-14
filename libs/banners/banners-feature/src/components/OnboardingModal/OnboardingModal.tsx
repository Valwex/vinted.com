'use client'

import { Dialog } from '@vinted/web-ui'

import { useAbTest, useTrackAbTest } from '@marketplace-web/feature-flags/ab-tests-data'
import { OnboardingModalModel } from '@marketplace-web/banners/banners-data'

import useOnboarding from './hooks/useOnboarding'
import OnboardingTextVariant from './OnboardingTextVariant'
import OnboardingTextActions from './OnboardingTextActions'
import SingleStep from './SingleStep'

import useBanners from '../../hooks/useBanners'

type Props = {
  banner: OnboardingModalModel
}

const OnboardingModal = ({ banner }: Props) => {
  const {
    banners: { singleStepOnboardingModal: singleStepBanner },
  } = useBanners()
  const { isSingleStepModalEnabled, isOpen, setSlide, onModalClose, onPrimaryClick } =
    useOnboarding({
      banner,
      singleStepBanner,
    })

  useTrackAbTest(useAbTest(singleStepBanner?.abTest.name || ''))
  useTrackAbTest(useAbTest(banner.abTest?.name || ''))

  const renderContent = () => {
    if (singleStepBanner && isSingleStepModalEnabled) {
      return (
        <SingleStep
          banner={singleStepBanner}
          onClose={onModalClose}
          onPrimaryClick={onPrimaryClick}
        />
      )
    }

    return (
      <>
        <OnboardingTextVariant banner={banner} onSlideChange={setSlide} onClose={onModalClose} />
        <OnboardingTextActions
          primaryText={banner.actions.primary.title}
          onPrimaryClick={onPrimaryClick}
        />
      </>
    )
  }

  return (
    <Dialog
      show={isOpen}
      defaultCallback={onModalClose}
      closeOnOverlay
      className="u-overflow-visible u-position-relative u-zindex-bump"
    >
      {renderContent()}
    </Dialog>
  )
}

export default OnboardingModal
