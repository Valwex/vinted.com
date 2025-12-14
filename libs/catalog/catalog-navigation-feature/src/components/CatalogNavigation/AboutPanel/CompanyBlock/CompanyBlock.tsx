'use client'

import { useFeatureSwitch } from '@marketplace-web/feature-flags/feature-switches-data'
import { useCompanyWeb } from '@marketplace-web/company-info/company-links-feature'
import { useTracking } from '@marketplace-web/observability/event-tracker-data'
import { useTranslate } from '@marketplace-web/i18n/i18n-feature'
import { clickEvent } from '@marketplace-web/catalog/catalog-navigation-data'

import {
  ACCESSIBILITY_URL,
  ADVERTISING_URL,
  JOBS_URL,
  JOBS_URL_NEW,
  MAIN_NAVIGATION_ABOUT_TAB_URL,
} from '../../../../constants/routes'
import LinkCell from '../LinkCell'
import LinksGroup from '../LinksGroup'

const CompanyBlock = () => {
  const translate = useTranslate('header.main_navigation.about')
  const { track } = useTracking()
  const {
    isPressMenuEnabled,
    isSustainabilityMenuEnabled,
    newsroomUrl,
    sustainabilityLandingPageUrl,
  } = useCompanyWeb()

  const isJobsPageEnabled = useFeatureSwitch('jobs_page')
  const isNewJobsUrlEnabled = useFeatureSwitch('new_jobs_career_portal')
  const isAccesibilityLandingPageEnabled = useFeatureSwitch('web_portal_accessibility_landing_page')

  const handleSustainabilityClick = () => {
    track(
      clickEvent({
        target: 'sustainability_page_link',
        targetDetails: 'navigation_web',
      }),
    )
  }

  const jobsUrl = isNewJobsUrlEnabled ? JOBS_URL_NEW : JOBS_URL

  return (
    <LinksGroup title={translate('company.title')}>
      <LinkCell title={translate('company.items.about')} url={MAIN_NAVIGATION_ABOUT_TAB_URL} />
      {isJobsPageEnabled && (
        <LinkCell testId="jobs-link-header" title={translate('company.items.jobs')} url={jobsUrl} />
      )}
      {isSustainabilityMenuEnabled && (
        <LinkCell
          title={translate('company.items.sustainability')}
          url={sustainabilityLandingPageUrl}
          onClick={handleSustainabilityClick}
        />
      )}
      {isPressMenuEnabled && (
        <LinkCell title={translate('company.items.press')} url={newsroomUrl} testId="press-link" />
      )}
      <LinkCell title={translate('company.items.advertising')} url={ADVERTISING_URL} />
      {isAccesibilityLandingPageEnabled && (
        <LinkCell
          title={translate('company.items.accessibility')}
          url={ACCESSIBILITY_URL}
          testId="accessibility-link-header"
        />
      )}
    </LinksGroup>
  )
}

export default CompanyBlock
