'use client'

import { Search16 } from '@vinted/monochrome-icons'
import { Card, Divider, Icon, InputBar, offset, useFloating } from '@vinted/web-ui'
import { isEmpty, trim } from 'lodash'
import { FormEvent, useContext, useEffect, useRef, useState } from 'react'
import { v4 as uuid } from 'uuid'

import { useLatestCallback } from '@marketplace-web/shared/ui-state-util'
import {
  useBrowserNavigation,
  redirectToPage,
} from '@marketplace-web/browser/browser-navigation-util'
import { useTracking } from '@marketplace-web/observability/event-tracker-data'
import { useTranslate } from '@marketplace-web/i18n/i18n-feature'
import { useSession } from '@marketplace-web/shared/session-data'
import { useSystemConfiguration } from '@marketplace-web/shared/system-configuration-data'
import { ListNavigator } from '@marketplace-web/common-components/list-navigator-ui'
import { OutsideClick } from '@marketplace-web/common-components/outside-click-ui'
import { normalizedQueryParam, toUrlQuery, urlWithParams } from '@marketplace-web/browser/url-util'
import { BrazeContext, logSavedCategoryEvent } from '@marketplace-web/braze/braze-feature'
import { CatalogNavigationDto } from '@marketplace-web/catalog/catalog-data'
import {
  getSearchSessionData,
  setSearchStartData,
  SearchBarSearchType,
  SavedSearchType,
  SearchStartType,
} from '@marketplace-web/search/search-feature'
import {
  clickEvent,
  clickSearchSuggestionAutofillEvent,
  searchSuggestionAutofillTextSubmittedEvent,
  selectSavedSearchEvent,
  selectSearchSuggestionEvent,
  SelectSearchSuggestionEventArgs,
  SavedSearchDto,
  SearchSuggestionModel,
} from '@marketplace-web/search/search-bar-data'
import { useAbTest, useTrackAbTestCallback } from '@marketplace-web/feature-flags/ab-tests-data'
import { usePageId } from '@marketplace-web/environment/request-context-data'

import { SavedSearchesList, SearchSubscribeModal } from '../SavedSearches'
import useSavedSearchesSubscribeEducation from '../SavedSearches/SearchSubscribeModal/useSavedSearchesSubscribeEducation'
import { useSavedSearchesContext } from '../SavedSearchesProvider'
import { searchDtoToUrlParams } from '../SavedSearchesProvider/transformers'
import SearchByImageModal from './SearchByImageModal'
import SearchSuggestions, { useSearchSuggestions } from './SearchSuggestions'
import TypeSelector from './TypeSelector'
import useSelectedCatalogs from './useSelectedCatalogs'
import { CATALOG_URL, USER_SEARCH_URL } from '../../constants/routes'

const SEARCH_URLS: Record<SearchBarSearchType, string> = {
  [SearchBarSearchType.Item]: CATALOG_URL,
  [SearchBarSearchType.User]: USER_SEARCH_URL,
}

const MAX_QUERY_LENGTH = 5_000
const SEARCH_SUGGESTION_MIN_QUERY_LENGTH = 1

const isSavedSearchesRendered = (query: string) =>
  isEmpty(query) || query.length < SEARCH_SUGGESTION_MIN_QUERY_LENGTH

type Props = {
  isInCatalog: boolean
  catalogTree: Array<CatalogNavigationDto>
}

const SearchBar = ({ isInCatalog = false, catalogTree }: Props) => {
  const { searchParams, relativeUrl } = useBrowserNavigation()
  const translate = useTranslate()
  const { track } = useTracking()
  const trackAbTest = useTrackAbTestCallback()

  const { user } = useSession()
  const userExternalId = useContext(BrazeContext).userExternalId.value

  const systemConfiguration = useSystemConfiguration()

  const userId = user?.id
  const userCountryCode = user?.country_code
  const countryCode = systemConfiguration?.userCountry

  const {
    showSearchSubscriptionEducation,
    closeSearchSubscriptionEducation,
    isSubscribedModalOpen,
  } = useSavedSearchesSubscribeEducation()

  const { searches, actions } = useSavedSearchesContext()

  const savedRecentSearchListId = useRef('')

  const selectedCatalogs = useSelectedCatalogs(catalogTree)

  const pageId = usePageId()
  const isInitialSearchParamsQueryReset = pageId?.startsWith('help')

  const searchParamsQuery = isInitialSearchParamsQueryReset
    ? ''
    : normalizedQueryParam(searchParams.search_text)

  const [query, setQuery] = useState(searchParamsQuery)

  const getInitialSearchType = () => {
    if (relativeUrl.startsWith('/member/general/search')) {
      return SearchBarSearchType.User
    }

    return SearchBarSearchType.Item
  }

  const [searchType, setSearchType] = useState(getInitialSearchType())
  const [isFocused, setIsFocused] = useState(false)
  const [isTypeSelectorOpen, setIsTypeSelectorOpen] = useState(false)
  const [highlightedSearchText, setHighlightedSearchText] = useState('')
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null)

  const { fetchSuggestions, clearSuggestions, suggestionsListId, suggestions } =
    useSearchSuggestions(query)

  const inputRef = useRef<HTMLInputElement>(null)
  const isSavedSearchesFetched = useRef(false)

  const suggestionsSessionId = useRef(uuid())
  const savedRecentSearchSessionId = useRef(uuid())

  const seenSuggestions = useRef<Set<string>>(new Set())
  const seenRecentSearches = useRef<Set<number>>(new Set())
  const sentSelectSearchIds = useRef<Set<number>>(new Set())

  useEffect(() => {
    if (isFocused) return

    suggestionsSessionId.current = uuid()
    savedRecentSearchSessionId.current = uuid()
    seenSuggestions.current.clear()
    seenRecentSearches.current.clear()

    savedRecentSearchListId.current = uuid()
  }, [isFocused])

  const mobileAutofillClickedSuggestion = useRef<SearchSuggestionModel | null>(null)

  const requestSearches = () => {
    if (!userId) return

    actions.fetchSearches(userId)
    isSavedSearchesFetched.current = true
  }

  const querySearchSuggestions = (queryInput: string) => {
    if (searchType !== SearchBarSearchType.Item || isEmpty(queryInput)) return

    if (!isSavedSearchesRendered(queryInput)) {
      fetchSuggestions(queryInput)
    }
  }

  const focusInput = () => inputRef.current?.focus()

  const blurInput = () => inputRef.current?.blur()

  const toggleTypeSelector = () => setIsTypeSelectorOpen(prevState => !prevState)

  const searchSuggestionUrl = (suggestion: SearchSuggestionModel) => {
    const { item: itemSearchUrl } = SEARCH_URLS

    if (isInCatalog) return undefined

    return `${itemSearchUrl}?search_text=${encodeURIComponent(suggestion.title)}`
  }

  const getPlaceholder = () => {
    const isCatalogPlaceholder = isInCatalog && selectedCatalogs.length

    if (searchType === SearchBarSearchType.Item && isCatalogPlaceholder) {
      const catalogName = selectedCatalogs.map(catalog => catalog.title).join(', ')

      return translate(`searchbar.placeholder.${searchType}_with_catalog_selected`, {
        catalog: catalogName,
      })
    }

    return translate(`searchbar.placeholder.${searchType}`)
  }

  const handleQueryChange = useLatestCallback((newQuery: string) => {
    setHighlightedIndex(null)
    setHighlightedSearchText('')

    if (!isEmpty(trim(newQuery))) {
      querySearchSuggestions(newQuery)
    }

    setQuery(newQuery)
  })

  useEffect(() => {
    handleQueryChange(searchParamsQuery)
  }, [handleQueryChange, searchParamsQuery])

  const handleValueClear = () => setQuery('')

  const handleTypeSelectorClick = () => {
    setIsFocused(false)
    toggleTypeSelector()

    track(clickEvent({ target: 'search_bar_type' }))
  }

  const handleTypeSelectorSelect = (newSearchType: SearchBarSearchType) => {
    toggleTypeSelector()
    focusInput()

    if (searchType !== newSearchType) setSearchType(newSearchType)
  }

  const handleOutClick = () => {
    // Prevent excessive re-rendering
    if (isSubscribedModalOpen || !(isTypeSelectorOpen || isFocused)) return

    setIsTypeSelectorOpen(false)
    setIsFocused(false)
  }

  const handleInputFocus = () => {
    if (!isSavedSearchesFetched.current) requestSearches()

    if (!isSavedSearchesRendered(query) && !isFocused) {
      querySearchSuggestions(query)
    }

    setIsTypeSelectorOpen(false)
    setIsFocused(true)
  }

  const handleInputClick = () => track(clickEvent({ target: 'search_bar' }))

  const handleSubscribeClick = (_index: number, search: SavedSearchDto) => {
    if (!userId) return

    if (!search.subscribed) {
      showSearchSubscriptionEducation()

      logSavedCategoryEvent(
        search.catalog_id,
        userExternalId,
        catalogTree,
        search.brands?.map(brand => brand.id),
      )
    }
  }

  const handleSubscribeModalClose = () => {
    closeSearchSubscriptionEducation()
  }

  const handleSuggestionClick = (suggestion: SearchSuggestionModel, index: number) => {
    const { searchSessionId, globalSearchSessionId } = getSearchSessionData()

    const trackingArgs: SelectSearchSuggestionEventArgs = {
      suggestions: suggestions.map(item => item.title),
      suggestion: suggestion.title,
      query,
      index,
      countryCode: userCountryCode || countryCode,
      searchSessionId: searchSessionId || '',
      globalSearchSessionId,
      suggestionsSessionId: suggestionsSessionId.current,
      isFrontendGeneratedSuggestion: !!suggestion.frontendGeneratedTitle,
    }

    if ('params' in suggestion) {
      trackingArgs.params = suggestion.params
    }

    trackingArgs.suggestionPosition = index + 1
    trackingArgs.suggestionsListId = suggestionsListId.current

    track(selectSearchSuggestionEvent(trackingArgs))

    setSearchStartData({
      searchStartId: suggestionsSessionId.current,
      searchStartType: SearchStartType.SearchSuggestions,
    })

    if (isInCatalog) {
      const updatedUrl = urlWithParams(window.location.href, {
        search_text: suggestion.title,
      })

      window.history.pushState(null, '', updatedUrl)
    }

    setQuery(suggestion.title)
    setIsFocused(false)
  }

  const handleSavedSearchClick = (index: number, savedSearch: SavedSearchDto) => {
    const { searchSessionId, globalSearchSessionId } = getSearchSessionData()

    const savedSearchType = savedSearch.subscribed
      ? SavedSearchType.SubscribedSearch
      : SavedSearchType.RecentSearch

    const searchStartType = savedSearch.subscribed
      ? SearchStartType.SubscribedSearch
      : SearchStartType.RecentSearch

    setSearchStartData({
      searchStartId: savedRecentSearchSessionId.current,
      searchStartType,
    })

    if (sentSelectSearchIds.current.has(savedSearch.id)) return
    sentSelectSearchIds.current.add(savedSearch.id)

    track(
      selectSavedSearchEvent({
        savedRecentSearchListId: savedRecentSearchListId.current,
        savedRecentSearchSessionId: savedRecentSearchSessionId.current,
        screen: 'search_items',
        position: index + 1,
        searchSessionId: searchSessionId || '',
        type: savedSearchType,
        searchTitle: savedSearch.title,
        globalSearchSessionId,
        newItemsCount: savedSearch.new_items_count,
        unrestrictedNewItemsCount: savedSearch.unrestricted_new_items_count,
      }),
    )
  }

  const webSearchScrollTop = useAbTest('web_search_scroll_top')

  const handleSubmit = (event: FormEvent) => {
    if (searchType !== SearchBarSearchType.Item) return
    if (isInCatalog) {
      event.preventDefault()

      if (webSearchScrollTop?.variant === 'on') {
        window.scroll({ top: 0, behavior: 'smooth' })
      }
      trackAbTest(webSearchScrollTop)

      window.history.pushState(
        null,
        '',
        urlWithParams(window.location.href, { search_text: query }),
      )
    }

    if (mobileAutofillClickedSuggestion.current?.title === query) {
      const suggestion = mobileAutofillClickedSuggestion.current
      track(
        searchSuggestionAutofillTextSubmittedEvent({
          query,
          suggestionsSessionId: suggestionsSessionId.current,
          suggestionsListId: suggestionsListId.current,
          suggestionText: suggestion.title,
          params: 'params' in suggestion ? suggestion?.params || null : null,
        }),
      )
    }

    setSearchStartData({
      searchStartId: suggestionsSessionId.current,
      searchStartType: SearchStartType.SearchManual,
    })

    blurInput()
    setIsFocused(false)
  }

  const handleSavedSearchOnEnter = (highlightedResultIndex: number) => {
    const highlightedSearch = searches[highlightedResultIndex]!
    const params = { ...searchDtoToUrlParams(highlightedSearch), search_id: highlightedSearch.id }
    const url = `${SEARCH_URLS[SearchBarSearchType.Item]}?${toUrlQuery(params)}`

    handleSavedSearchClick(highlightedResultIndex, highlightedSearch)
    redirectToPage(url)
    blurInput()
  }

  const handleSearchSuggestionOnEnter = (highlightedResultIndex: number) => {
    const highlightedSuggestion = suggestions[highlightedResultIndex]!
    const url = searchSuggestionUrl(highlightedSuggestion)

    handleSuggestionClick(highlightedSuggestion, highlightedResultIndex)

    const { globalSearchSessionId, searchSessionId } = getSearchSessionData()
    track(
      clickSearchSuggestionAutofillEvent({
        query,
        suggestionsSessionId: suggestionsSessionId.current,
        suggestionText: highlightedSuggestion.title,
        suggestionsListId: suggestionsListId.current,
        suggestionPosition: highlightedResultIndex + 1,
        searchSessionId,
        globalSearchSessionId,
      }),
    )
    track(
      searchSuggestionAutofillTextSubmittedEvent({
        query,
        suggestionsSessionId: suggestionsSessionId.current,
        suggestionsListId: suggestionsListId.current,
        suggestionText: highlightedSuggestion.title,
        params: 'params' in highlightedSuggestion ? highlightedSuggestion.params || null : null,
      }),
    )

    if (url) redirectToPage(url)

    blurInput()
  }

  const handleSuggestionNavigation = (highlightedResultIndex: number | null) => {
    if (highlightedResultIndex === null) {
      setHighlightedSearchText('')
    } else if (isSavedSearchesRendered(query)) {
      setHighlightedSearchText(searches[highlightedResultIndex]!.search_text || '')
    } else {
      setHighlightedSearchText(suggestions[highlightedResultIndex]!.title)
    }
  }

  const renderIcon = () => (
    <div className="u-flexbox u-align-items-center">
      <Icon name={Search16} color="greyscale-level-2" />
    </div>
  )

  const renderPrefix = () => (
    <div className="u-flexbox u-fill-height">
      <TypeSelector
        selectedType={searchType}
        isOpen={isTypeSelectorOpen}
        onClick={handleTypeSelectorClick}
        onSelect={handleTypeSelectorSelect}
      />
      <Divider orientation="vertical" />
    </div>
  )

  const handleMobileAutofill = (suggestion: SearchSuggestionModel) => {
    mobileAutofillClickedSuggestion.current = suggestion
    setHighlightedSearchText('')
    setQuery(suggestion.title)
    querySearchSuggestions(suggestion.title)
    inputRef.current?.focus()
  }

  const renderSuggestions = (highlightedResultIndex: number | null) => (
    <SearchSuggestions
      onMobileAutofill={handleMobileAutofill}
      query={query}
      items={suggestions}
      highlightedIndex={highlightedResultIndex}
      onSuggestionClick={handleSuggestionClick}
      suggestionUrl={searchSuggestionUrl}
      suggestionsListId={suggestionsListId}
      suggestionsSessionId={suggestionsSessionId}
      seenSuggestions={seenSuggestions}
      onClearSuggestions={clearSuggestions}
    />
  )

  const renderSavedSearches = (highlightedResultIndex: number | null) => {
    if (!userId || !searches.length) return null

    return (
      <SavedSearchesList
        savedRecentSearchListId={savedRecentSearchListId}
        highlightedIndex={highlightedResultIndex}
        onSubscribeClick={handleSubscribeClick}
        searchUrl={SEARCH_URLS[SearchBarSearchType.Item]}
        onSearchClick={handleSavedSearchClick}
        savedRecentSearchSessionId={savedRecentSearchSessionId}
        seenRecentSearches={seenRecentSearches}
      />
    )
  }

  const bgFloating = useFloating({
    isFloaterVisible: isFocused,
    shouldAutoUpdate: true,
    strategy: 'fixed',
    middleware: [offset({ mainAxis: 8 })],
  })

  const renderDropdown = (highlightedResultIndex: number | null) => {
    if (searchType !== SearchBarSearchType.Item || !isFocused) return null

    const dropdownContent = isSavedSearchesRendered(query)
      ? renderSavedSearches(highlightedResultIndex)
      : renderSuggestions(highlightedResultIndex)

    if (isEmpty(dropdownContent)) return null

    return (
      <div className="u-ui-margin-top-regular u-position-absolute u-fill-width">
        <div
          role="none"
          className="search-bar__background"
          data-testid="search-bar-background"
          ref={bgFloating.floaterRef}
          style={bgFloating.floaterStyle}
          onClick={handleOutClick}
        />
        <Card styling="lifted">
          <div className="u-overflow-hidden">{dropdownContent}</div>
        </Card>
      </div>
    )
  }

  let resultsCount = searches.length
  let onSelect = handleSavedSearchOnEnter

  if (!isSavedSearchesRendered(query)) {
    resultsCount = suggestions.length
    onSelect = handleSearchSuggestionOnEnter
  }

  return (
    <OutsideClick onOutsideClick={handleOutClick}>
      <form
        onSubmit={handleSubmit}
        method="get"
        action={SEARCH_URLS[searchType]}
        ref={bgFloating.triggerRef}
      >
        <ListNavigator
          highlightedResultIndex={highlightedIndex}
          setHighlightedResultIndex={setHighlightedIndex}
          itemCount={resultsCount}
          onSelect={onSelect}
          onHighlightedResultChange={handleSuggestionNavigation}
          resetOnUnknownKey={false}
        >
          {({ handleKeyNavigation }) => (
            <div className="u-position-relative">
              <InputBar
                suffix={!(highlightedSearchText || query) && <SearchByImageModal />}
                maxLength={MAX_QUERY_LENGTH}
                inputAria={{
                  'aria-labelledby': `search-${searchType}`,
                }}
                clearButtonAria={{
                  'aria-label': translate('searchbar.button.clear'),
                }}
                name="search_text"
                placeholder={getPlaceholder()}
                value={highlightedSearchText || query}
                icon={renderIcon()}
                prefix={renderPrefix()}
                onChange={event => handleQueryChange(event.currentTarget.value)}
                onFocus={handleInputFocus}
                onKeyDown={handleKeyNavigation}
                onValueClear={handleValueClear}
                onInputClick={handleInputClick}
                ref={inputRef}
                testId="search-text"
              />

              {renderDropdown(highlightedIndex)}
            </div>
          )}
        </ListNavigator>

        <SearchSubscribeModal isOpen={isSubscribedModalOpen} onClose={handleSubscribeModalClose} />
      </form>
    </OutsideClick>
  )
}

export default SearchBar
