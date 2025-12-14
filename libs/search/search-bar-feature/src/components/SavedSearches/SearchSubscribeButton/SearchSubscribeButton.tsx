'use client'

import { useContext, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { Text, Icon, Button } from '@vinted/web-ui'
import { Bookmark24, BookmarkFilled24 } from '@vinted/monochrome-icons'

import { useSession } from '@marketplace-web/shared/session-data'
import { toggleSearchSubscriptionEvent } from '@marketplace-web/search/search-bar-data'
import { CatalogNavigationDto } from '@marketplace-web/catalog/catalog-data'
import { useTracking } from '@marketplace-web/observability/event-tracker-data'
import { useBreakpoint } from '@marketplace-web/breakpoints/breakpoints-feature'
import { useTranslate } from '@marketplace-web/i18n/i18n-feature'
import { BrazeContext, logSavedCategoryEvent } from '@marketplace-web/braze/braze-feature'
import { getSearchSessionData } from '@marketplace-web/search/search-feature'
import { useBrowserNavigation } from '@marketplace-web/browser/browser-navigation-util'

import SearchSubscribeModal from '../SearchSubscribeModal'
import { useSavedSearchesContext } from '../../SavedSearchesProvider'
import { urlToApiParams } from '../../SavedSearchesProvider/transformers'
import useSavedSearchesSubscribeEducation from '../SearchSubscribeModal/useSavedSearchesSubscribeEducation'

type Props = {
  catalogTree: Array<CatalogNavigationDto>
}

const SearchSubscribeButton = ({ catalogTree }: Props) => {
  const { track } = useTracking()
  const breakpoints = useBreakpoint()
  const translate = useTranslate()
  const { user } = useSession()
  const userExternalId = useContext(BrazeContext).userExternalId.value

  const userId = user?.id

  const queryParams = useBrowserNavigation().searchParams

  const [isLoading, setIsLoading] = useState(false)

  const { currentSearch, actions } = useSavedSearchesContext()

  const {
    showSearchSubscriptionEducation,
    closeSearchSubscriptionEducation,
    isSubscribedModalOpen,
  } = useSavedSearchesSubscribeEducation()

  const toggleSubscription = (event: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    const params = urlToApiParams(new URL(window.location.href))
    const searchSessionData = getSearchSessionData()

    if (isLoading) {
      event.preventDefault()

      return
    }

    if (!userId) return

    setIsLoading(true)
    actions.toggleCurrentSearchSubscription(params, userId).finally(() => setIsLoading(false))

    if (!currentSearch?.subscribed) {
      showSearchSubscriptionEducation()
      logSavedCategoryEvent(
        params.catalog_id,
        userExternalId,
        catalogTree,
        [queryParams.brand_ids || []].flat(),
      )
    }

    track(
      toggleSearchSubscriptionEvent({
        savedRecentSearchSessionId: null,
        savedRecentSearchListId: null,
        screen: 'catalog',
        isSubscribing: !currentSearch?.subscribed,
        searchSessionId: searchSessionData.searchSessionId || '',
        searchTitle: currentSearch?.title,
        searchQuery: currentSearch?.search_text ?? params.search_text,
        globalSearchSessionId: searchSessionData.globalSearchSessionId,
      }),
    )
  }

  if (queryParams.search_by_image_uuid || queryParams.disable_search_saving === 'true' || !userId) {
    return null
  }

  const action = currentSearch?.subscribed ? 'delete' : 'save'
  const text = <FormattedMessage id={`saved_searches.actions.${action}`} />

  const a11yLabel = breakpoints.phones ? translate(`saved_searches.a11y.${action}`) : undefined

  return (
    <>
      <SearchSubscribeModal
        isOpen={isSubscribedModalOpen}
        onClose={closeSearchSubscriptionEducation}
      />
      <Button
        isLoading={isLoading}
        text={
          !breakpoints.phones && (
            <Text type="subtitle" theme="amplified" as="span">
              {text}
            </Text>
          )
        }
        icon={
          <Icon
            name={currentSearch?.subscribed ? BookmarkFilled24 : Bookmark24}
            color={currentSearch?.subscribed ? 'primary-default' : 'greyscale-level-1'}
          />
        }
        onClick={toggleSubscription}
        aria={{
          'aria-label': a11yLabel,
        }}
        testId={`catalog-search-${action}-button`}
        theme="muted"
      />
    </>
  )
}

export default SearchSubscribeButton
