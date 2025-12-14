'use client'

import { Fragment } from 'react'
import { Cell, Spacer, Text } from '@vinted/web-ui'

import { ContentLoader } from '@marketplace-web/common-components/content-loader-ui'
import { useBrowserNavigation } from '@marketplace-web/browser/browser-navigation-util'
import { useTranslate } from '@marketplace-web/i18n/i18n-feature'

import {
  getFaqPathDataFromUrl,
  generateFaqLink,
} from '@marketplace-web/help-center/help-center-faq-entry-url-data'

import {
  HelpCenterNavigationItemModel,
  HelpCenterNavigationModel,
} from '@marketplace-web/help-center/help-center-home-data'

type Props = {
  navigationFaqEntries: HelpCenterNavigationModel | undefined
  isLoading: boolean
}
const HC_ROOT_FAQ_ID = 3

const HelpCenterNavigation = ({ navigationFaqEntries, isLoading }: Props) => {
  const translate = useTranslate('help_center.navigation')
  const { relativeUrl, searchParams } = useBrowserNavigation()
  const { access_channel, thread_id, search_text } = searchParams

  const getTextTheme = (isActive: boolean) => (isActive ? 'amplified' : 'muted')

  const getNavigationItemIsActive = (faqEntry: HelpCenterNavigationItemModel) => {
    const faqEntryData = getFaqPathDataFromUrl(relativeUrl)

    if (!faqEntryData) {
      return false
    }

    const { faqEntryId, faqEntryParentId } = faqEntryData

    if (faqEntry.id === HC_ROOT_FAQ_ID && !faqEntryId && !faqEntryParentId && !search_text) {
      return true
    }

    return faqEntryParentId === faqEntry.id || faqEntryId === faqEntry.id
  }

  const renderSubNavigationItem = (faqEntry: HelpCenterNavigationItemModel) => {
    if (!faqEntry.title) {
      return null
    }

    const isSubNavigationItemActive = getNavigationItemIsActive(faqEntry)

    return (
      <Cell
        key={faqEntry.id}
        url={generateFaqLink(faqEntry, access_channel, thread_id)}
        styling="narrow"
        theme="transparent"
        type="navigating"
        role="listitem"
        aria={{ 'aria-label': faqEntry.title }}
      >
        <Spacer orientation="vertical" size="large" />
        <Text
          as="h3"
          text={faqEntry.title}
          type="subtitle"
          theme={getTextTheme(isSubNavigationItemActive)}
          bold={isSubNavigationItemActive}
        />
      </Cell>
    )
  }

  const renderSubNavigation = (faqEntry: HelpCenterNavigationItemModel) => {
    if (faqEntry.id === HC_ROOT_FAQ_ID) {
      return null
    }

    const faqEntrySubNavigationItems = faqEntry.childFaqEntries?.filter(childFaqEntry =>
      Boolean(childFaqEntry.childFaqEntries),
    )

    if (!faqEntrySubNavigationItems?.length) {
      return null
    }

    return (
      <Cell styling="narrow" theme="transparent">
        {faqEntrySubNavigationItems.map(renderSubNavigationItem)}
      </Cell>
    )
  }

  const renderNavigationItem = (faqEntry: HelpCenterNavigationItemModel) => {
    if (!faqEntry.title) return null

    const isNavigationItemActive = getNavigationItemIsActive(faqEntry)

    return (
      <Fragment key={faqEntry.id}>
        <Cell
          url={generateFaqLink(
            { id: faqEntry.id, title: faqEntry.title },
            access_channel,
            thread_id,
          )}
          theme="transparent"
          type="navigating"
          role="listitem"
          aria={{ 'aria-label': faqEntry.title }}
        >
          <Text
            as="span"
            text={faqEntry.title}
            theme={getTextTheme(isNavigationItemActive)}
            bold={isNavigationItemActive}
          />
        </Cell>
        {isNavigationItemActive && renderSubNavigation(faqEntry)}
      </Fragment>
    )
  }

  const renderNavigation = () => {
    if (isLoading) {
      return <ContentLoader testId="help-center-navigation-loading-spinner" />
    }

    if (!navigationFaqEntries) {
      return null
    }

    return (
      <>
        {renderNavigationItem({
          id: navigationFaqEntries.rootFaqEntryId,
          title: navigationFaqEntries.rootFaqEntryTitle,
        })}
        {navigationFaqEntries.childFaqEntries?.map(renderNavigationItem)}
      </>
    )
  }

  return (
    <>
      <Cell theme="transparent">
        <Text as="h1" text={translate('page_title')} type="section-heading" />
      </Cell>
      <ul className="body-content__navigation">{renderNavigation()}</ul>
    </>
  )
}

export default HelpCenterNavigation
