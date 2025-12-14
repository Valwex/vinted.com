import {
  OnboardingModalDto,
  OnboardingModalModel,
  SingleStepOnboardingModalDto,
  SingleStepOnboardingModalModel,
} from '../types/onboarding-banner'

export const transformOnboardingModal = ({
  name,
  ab_test,
  actions,
  steps,
}: OnboardingModalDto): OnboardingModalModel => ({
  name,
  type: 'onboarding_modal',
  abTest: ab_test,
  actions,
  steps: steps.map(step => ({
    name: step.name,
    title: step.title,
    body: step.body,
    imageUrl: step.image_url,
    video: step.video && {
      vertical: {
        formats: step.video.vertical.formats,
        imageUrl: step.video.vertical.image_url,
      },
    },
    videoDark: step.video_dark && {
      vertical: {
        formats: step.video_dark.vertical.formats,
        imageUrl: step.video_dark.vertical.image_url,
      },
    },
  })),
})

export const transformSingleStepOnboardingModal = ({
  name,
  title,
  sections,
  actions,
  ab_test,
}: SingleStepOnboardingModalDto): SingleStepOnboardingModalModel => ({
  name,
  title,
  sections: sections?.map(section => ({
    title: section.title,
    body: section.body,
    imageUrl: section.image_url,
  })),
  actions,
  abTest: ab_test,
})
