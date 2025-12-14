'use client'

import { MouseEvent, MutableRefObject, useEffect, useRef, useState } from 'react'
import { Button, Cell, Icon, Label, Spacer, Text } from '@vinted/web-ui'
import { Bookmark24, BookmarkFilled24 } from '@vinted/monochrome-icons'
import { InView } from 'react-intersection-observer'

import { useTracking } from '@marketplace-web/observability/event-tracker-data'
import { useTranslate } from '@marketplace-web/i18n/i18n-feature'
import { toUrlQuery } from '@marketplace-web/browser/url-util'

import { getSearchSessionData, SavedSearchType } from '@marketplace-web/search/search-feature'
import { SortByOption } from '@marketplace-web/catalog/catalog-data'
import {
  toggleSearchSubscriptionEvent,
  viewSavedSearchEvent,
  SavedSearchDto,
} from '@marketplace-web/search/search-bar-data'
import { useSession } from '@marketplace-web/shared/session-data'

import { useSavedSearchesContext } from '../../SavedSearchesProvider'
import { searchDtoToUrlParams } from '../../SavedSearchesProvider/transformers'

type RenderSavedSearchArgs = {
  search: SavedSearchDto
  index: number
}

type Props = {
  searchUrl: string
  highlightedIndex: number | null
  onSearchClick?: ((index: number, search: SavedSearchDto, event: MouseEvent) => void) | null
  onSubscribeClick?: ((index: number, search: SavedSearchDto, event: MouseEvent) => void) | null
  savedRecentSearchSessionId: MutableRefObject<string>
  seenRecentSearches: MutableRefObject<Set<number>>
  savedRecentSearchListId: MutableRefObject<string>
}

const SavedSearchesList = ({
  searchUrl,
  highlightedIndex,
  onSearchClick,
  onSubscribeClick,
  savedRecentSearchSessionId,
  seenRecentSearches,
  savedRecentSearchListId,
}: Props) => {
  const translate = useTranslate('saved_searches')
  const { user } = useSession()
  const { track } = useTracking()

  const [isSearchLoadingMap, setIsSearchLoadingMap] = useState<Record<number, boolean>>({})

  const setIsSearchLoading = (searchId: number, isLoading: boolean) =>
    setIsSearchLoadingMap(prev => ({ ...prev, [searchId]: isLoading }))

  const { searches, actions } = useSavedSearchesContext()

  const activeSavedSearchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    activeSavedSearchRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [highlightedIndex])

  const onItemClick = (index: number, search: SavedSearchDto) => (event: MouseEvent) => {
    if (onSearchClick) onSearchClick(index, search, event)
  }

  const onSearchSubscribeClick = (index: number, search: SavedSearchDto) => (event: MouseEvent) => {
    const { searchSessionId, globalSearchSessionId } = getSearchSessionData()

    if (user) {
      setIsSearchLoading(search.id, true)
      actions
        .toggleSearchSubscription(search.id, user.id)
        .finally(() => setIsSearchLoading(search.id, false))
    }

    event.stopPropagation()
    event.preventDefault()

    track(
      toggleSearchSubscriptionEvent({
        savedRecentSearchSessionId: savedRecentSearchSessionId.current,
        savedRecentSearchListId: savedRecentSearchListId.current,
        screen: 'search_items',
        position: index + 1,
        searchSessionId: searchSessionId || '',
        isSubscribing: !search.subscribed,
        searchTitle: search.title,
        searchQuery: search.search_text,
        globalSearchSessionId,
      }),
    )

    if (onSubscribeClick) onSubscribeClick(index, search, event)
  }

  const getOnViewSavedSearch = (index: number, search: SavedSearchDto) => (inView: boolean) => {
    if (!inView) return

    if (seenRecentSearches.current.has(search.id)) return
    seenRecentSearches.current.add(search.id)

    const { searchSessionId, globalSearchSessionId } = getSearchSessionData()

    track(
      viewSavedSearchEvent({
        savedRecentSearchListId: savedRecentSearchListId.current,
        savedRecentSearchSessionId: savedRecentSearchSessionId.current,
        screen: 'search_items',
        position: index + 1,
        newItemsCount: search.new_items_count,
        searchTitle: search.title,
        unrestrictedNewItemsCount: search.unrestricted_new_items_count,
        searchSessionId,
        globalSearchSessionId,
        type: search.subscribed ? SavedSearchType.SubscribedSearch : SavedSearchType.RecentSearch,
      }),
    )
  }

  const renderYourSearchesLabel = () => (
    <>
      <Label text={translate('list.title')} type="stacked" />
      <Spacer />
    </>
  )

  function renderSavedSearchSuffix(index: number, search: SavedSearchDto) {
    return (
      <div className="u-position-relative u-zindex-bump">
        <Button
          icon={
            <Icon
              name={search.subscribed ? BookmarkFilled24 : Bookmark24}
              color={search.subscribed ? 'primary-default' : 'greyscale-level-3'}
              aria={{
                'aria-label': search.subscribed
                  ? translate('a11y.remove_saved_search', { title: search.title })
                  : translate('a11y.save_search', { title: search.title }),
              }}
            />
          }
          styling="flat"
          theme="muted"
          testId="subscription-toggle"
          onClick={onSearchSubscribeClick(index, search)}
          isLoading={isSearchLoadingMap[search.id]}
        />
      </div>
    )
  }

  function renderSavedSearchTitle(title: string, newItemsCount: number | null) {
    return (
      <div className="u-flexbox">
        {!!newItemsCount && (
          <div className="u-ui-padding-right-small u-no-wrap">
            <Text as="span" text={`+${newItemsCount}`} theme="primary" />
          </div>
        )}
        <span className="u-ellipsis u-flex-1">{title}</span>
      </div>
    )
  }

  const renderSavedSearch = ({ search, index }: RenderSavedSearchArgs) => {
    const { id, title, subtitle, new_items_count: newItemsCount } = search
    const params = {
      ...searchDtoToUrlParams(search),
      search_id: id,
      order: SortByOption.NewestFirst,
    }
    const url = `${searchUrl}?${toUrlQuery(params)}`

    const isHighlighted = index === highlightedIndex

    return (
      <div ref={isHighlighted ? activeSavedSearchRef : null}>
        <Cell
          type="navigating"
          title={renderSavedSearchTitle(title, newItemsCount)}
          suffix={renderSavedSearchSuffix(index, search)}
          highlighted={isHighlighted}
          url={url}
          onClick={onItemClick(index, search)}
          aria={{
            'aria-label': search.title,
          }}
        >
          {!!subtitle && <Text as="span" text={subtitle} truncate />}
        </Cell>
      </div>
    )
  }

  function renderSavedSearches() {
    return (
      <>
        {renderYourSearchesLabel()}
        {searches.map((search, index) => (
          <InView key={search.id} onChange={getOnViewSavedSearch(index, search)}>
            {renderSavedSearch({ search, index })}
          </InView>
        ))}
      </>
    )
  }

  return (
    <div className="saved-searches">
      <Cell styling="tight" testId="saved-searches">
        <div className="saved-searches__content">{renderSavedSearches()}</div>
      </Cell>
    </div>
  )
}

export default SavedSearchesList
