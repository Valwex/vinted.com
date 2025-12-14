'use client'

import { Divider, Label } from '@vinted/web-ui'

import { useFeatureSwitch } from '@marketplace-web/feature-flags/feature-switches-data'
import { SeparatedList } from '@marketplace-web/common-components/separated-list-ui'
import { useCompanyWeb } from '@marketplace-web/company-info/company-links-feature'
import { useTracking } from '@marketplace-web/observability/event-tracker-data'
import { useTranslate } from '@marketplace-web/i18n/i18n-feature'
import { clickEvent } from '@marketplace-web/catalog/catalog-navigation-data'

import {
  ADVERTISING_URL,
  JOBS_URL,
  JOBS_URL_NEW,
  MAIN_NAVIGATION_ABOUT_TAB_URL,
} from '../../../../constants/routes'
import OtherLink from '../OtherLink'

const Company = () => {
  const translate = useTranslate('header.main_navigation.about.company')
  const { track } = useTracking()
  const {
    isPressMenuEnabled,
    isSustainabilityMenuEnabled,
    newsroomUrl,
    sustainabilityLandingPageUrl,
  } = useCompanyWeb()

  const isJobsPageEnabled = useFeatureSwitch('jobs_page')
  const isNewJobsUrlEnabled = useFeatureSwitch('new_jobs_career_portal')
  const jobsUrl = isNewJobsUrlEnabled ? JOBS_URL_NEW : JOBS_URL

  const handleSustainabilityClick = () => {
    track(
      clickEvent({
        target: 'sustainability_page_link',
        targetDetails: 'navigation_web',
      }),
    )
  }

  return (
    <>
      <Label text={translate('title')} />
      <SeparatedList separator={<Divider />}>
        <OtherLink title={translate('items.about')} url={MAIN_NAVIGATION_ABOUT_TAB_URL} />
        {isJobsPageEnabled && <OtherLink title={translate('items.jobs')} url={jobsUrl} />}
        {isSustainabilityMenuEnabled && (
          <OtherLink
            title={translate('items.sustainability')}
            url={sustainabilityLandingPageUrl}
            onClick={handleSustainabilityClick}
          />
        )}
        {isPressMenuEnabled && <OtherLink title={translate('items.press')} url={newsroomUrl} />}
        <OtherLink title={translate('items.advertising')} url={ADVERTISING_URL} />
      </SeparatedList>
    </>
  )
}

export default Company
