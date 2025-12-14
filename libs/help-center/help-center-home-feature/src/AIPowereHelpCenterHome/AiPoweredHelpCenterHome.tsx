'use client'

import { Card, Cell, Image, Label, Spacer, Text } from '@vinted/web-ui'
import { useEffect } from 'react'
import { useIsClient } from 'usehooks-ts'

import { useFetch } from '@marketplace-web/core-api/api-client-util'
import { useBrowserNavigation } from '@marketplace-web/browser/browser-navigation-util'
import { useTracking } from '@marketplace-web/observability/event-tracker-data'
import { useTranslate } from '@marketplace-web/i18n/i18n-feature'
import { useSession } from '@marketplace-web/shared/session-data'
import { useAsset } from '@marketplace-web/shared/assets'
import { ContentLoader } from '@marketplace-web/common-components/content-loader-ui'
import { useAbTest, useTrackAbTest } from '@marketplace-web/feature-flags/ab-tests-data'

import { generateFaqLink } from '@marketplace-web/help-center/help-center-faq-entry-url-data'
import { HelpCenterSearchInputNew } from '@marketplace-web/help-center/help-center-ai-powered-help-feature'
import {
  helpcenterAiHomeScreenView,
  HelpCenterHomeFaqEntryModel,
  transformHelpCenterHomeFaqsResponse,
  transformHelpCenterNavigationResponse,
} from '@marketplace-web/help-center/help-center-home-data'
import { HelpCenterTransactions } from '@marketplace-web/help-center/help-center-transactions-feature'
import useHelpCenterSessionTracking from '@marketplace-web/help-center/help-center-session-tracking-util'

import { HelpCenterNavigation } from '@marketplace-web/help-center/help-center-faq-navigation-feature'

import { getFaqEntries } from '@marketplace-web/help-center/help-center-faq-entry-data'
import {
  getRecentTransactions,
  transformHelpCenterTransactionsResponse,
} from '@marketplace-web/help-center/help-center-transactions-data'
import { useFeatureSwitch } from '@marketplace-web/feature-flags/feature-switches-data'

const HC_HOME_VISIBLE_TRANSACTION_COUNT = 3

const AiPoweredHelpCenterHome = () => {
  const aiHelpQuerySuggestionsAbTest = useAbTest('ai_help_query_suggestions_web_v1')
  const isAiHelpQuerySuggestionsFsEnabled = useFeatureSwitch(
    'help_center_ai_powered_help_search_suggestions',
  )

  useTrackAbTest(aiHelpQuerySuggestionsAbTest, isAiHelpQuerySuggestionsFsEnabled)

  const isClientSideRenderReady = useIsClient()
  const translate = useTranslate('help_center')
  const { track } = useTracking()
  const { isWebview } = useSession()

  const asset = useAsset('/assets/icons/faq')

  const { access_channel, thread_id } = useBrowserNavigation().searchParams
  const { helpCenterSessionId } = useHelpCenterSessionTracking()

  useEffect(() => {
    if (!helpCenterSessionId) return

    track(
      helpcenterAiHomeScreenView({
        helpCenterSessionId,
        accessChannel: typeof access_channel === 'string' ? access_channel : null,
      }),
    )
  }, [access_channel, track, helpCenterSessionId])

  const {
    fetch: fetchRecentTransactions,
    transformedData: recentTransactions,
    isLoading: isTransactionsLoading,
  } = useFetch(getRecentTransactions, transformHelpCenterTransactionsResponse)

  const {
    fetch: fetchFaqs,
    data: faqs,
    transformedData: faqEntries,
    isLoading: isFaqsLoading,
  } = useFetch(getFaqEntries, transformHelpCenterHomeFaqsResponse)

  useEffect(() => {
    Promise.all([fetchRecentTransactions(HC_HOME_VISIBLE_TRANSACTION_COUNT), fetchFaqs()])
  }, [fetchFaqs, fetchRecentTransactions])

  const renderSearch = () => {
    if (isWebview) return null

    return <HelpCenterSearchInputNew />
  }

  const renderNavigation = () => {
    if (!faqs) return null

    const navigationFaqEntries = transformHelpCenterNavigationResponse(faqs)

    return (
      <HelpCenterNavigation navigationFaqEntries={navigationFaqEntries} isLoading={isFaqsLoading} />
    )
  }

  const renderTransactions = () => {
    if (!recentTransactions?.transactions.length) return <Spacer size="large" />

    return (
      <>
        <Label
          type="leading"
          text={translate('ai_search.transactions_overview.subtitle')}
          styling="default"
        />
        <HelpCenterTransactions
          transactions={recentTransactions.transactions}
          hasMoreTransactions={recentTransactions.totalCount > HC_HOME_VISIBLE_TRANSACTION_COUNT}
        />
      </>
    )
  }

  const renderIcon = (icon: string | undefined, title: string) => {
    let iconPath = icon
    if (!iconPath) return null
    if (iconPath === 'covid-19') {
      iconPath = 'getting-started'
    }

    return (
      <Image
        src={asset(`${iconPath}.svg`, { theme: { dark: `${iconPath}_dark.svg` } })}
        size="large"
        alt={title}
      />
    )
  }

  const renderEntry = ({ id, title, icon }: HelpCenterHomeFaqEntryModel) => {
    if (!title) return null

    return (
      <a
        key={id}
        href={generateFaqLink({ id, title }, access_channel, thread_id)}
        className="faq__category"
        title={title}
        data-testid={`help-center-home--faq-category-${id}`}
      >
        {renderIcon(icon, title)}
        <div className="faq__category-title">{title}</div>
      </a>
    )
  }

  const renderFaqEntries = () => {
    if (!faqEntries) return null

    return (
      <div className="faq__entries-wrapper">
        <Card>
          <div className="faq__categories" role="list">
            {faqEntries.map(renderEntry)}
          </div>
        </Card>
      </div>
    )
  }

  if (isTransactionsLoading || isFaqsLoading || !isClientSideRenderReady) {
    return (
      <ContentLoader
        styling={ContentLoader.Styling.Wide}
        size={ContentLoader.Size.Large}
        testId="help-center-home-loader"
      />
    )
  }

  return (
    <>
      <aside className="body-content__sidebar faq__navigation faq__navigation--secondary">
        <Spacer size="large" orientation="horizontal" />
        {renderNavigation()}
      </aside>
      <div
        className={
          aiHelpQuerySuggestionsAbTest?.variant === 'on_2'
            ? 'faq faq__home-nosearchbar'
            : 'faq faq__home-withsearchbar'
        }
      >
        <Spacer size="large" orientation="vertical" />
        <Text as="h2" type="heading" text={translate('ai_search.title')} />
        <Label type="leading" text={translate('ai_search.subtitle')} styling="default" />
        <div className="faq__home-search-wrapper">{renderSearch()}</div>
        {renderTransactions()}
        <Cell>
          <Text as="h2" type="section-heading" text={translate('faq.general_topics')} />
        </Cell>
        {renderFaqEntries()}
      </div>
    </>
  )
}

export default AiPoweredHelpCenterHome
