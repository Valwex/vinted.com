'use client'

import { ArrowClock24, ArrowTopLeft24, Search24 } from '@vinted/monochrome-icons'
import { MouseEvent, MutableRefObject, useEffect, useRef } from 'react'
import { Button, Cell, Icon, Text } from '@vinted/web-ui'
import { escape, escapeRegExp, isEqual, noop } from 'lodash'
import { InView } from 'react-intersection-observer'

import { useFeatureSwitch } from '@marketplace-web/feature-flags/feature-switches-data'

import { List } from '@marketplace-web/common-components/list-ui'
import { useLatestCallback } from '@marketplace-web/shared/ui-state-util'
import { useTracking } from '@marketplace-web/observability/event-tracker-data'

import {
  clickSearchSuggestionAutofillEvent,
  viewSearchSuggestionEvent,
  ViewSearchSuggestionEventArgs,
  viewSearchSuggestionsEvent,
  SearchSuggestionModel,
} from '@marketplace-web/search/search-bar-data'
import { getSearchSessionData } from '@marketplace-web/search/search-feature'
import { useBreakpoint } from '@marketplace-web/breakpoints/breakpoints-feature'

type Props = {
  query: string
  items: Array<SearchSuggestionModel>
  highlightedIndex: number | null
  suggestionUrl: (suggestion: SearchSuggestionModel) => string | undefined
  suggestionsListId: MutableRefObject<string | null>
  suggestionsSessionId: MutableRefObject<string>
  onSuggestionClick?: (suggestion: SearchSuggestionModel, index: number, event: MouseEvent) => void
  seenSuggestions: MutableRefObject<Set<string>>
  onClearSuggestions: () => void
  onMobileAutofill: (suggestion: SearchSuggestionModel) => void
}

const SearchSuggestions = ({
  query,
  items,
  highlightedIndex,
  suggestionUrl,
  suggestionsListId,
  suggestionsSessionId,
  seenSuggestions,
  onClearSuggestions,
  onSuggestionClick = noop,
  onMobileAutofill,
}: Props) => {
  const { track } = useTracking()
  const breakpoint = useBreakpoint()

  const prevItems = useRef<Array<SearchSuggestionModel> | null>(null)
  const trackedQuery = useRef(query)

  const shouldAddViewSearchSuggestionEvent = useFeatureSwitch(
    'web_add_view_search_suggestion_event',
  )

  const prevHighlightedIndex = useRef<number | null>(null)

  const itemsRef = useRef(items)
  itemsRef.current = items

  const queryRef = useRef(query)
  queryRef.current = query

  useEffect(() => {
    const maybeSuggestion = itemsRef.current[prevHighlightedIndex.current ?? -1]

    if (highlightedIndex === null && maybeSuggestion && !maybeSuggestion.frontendGeneratedTitle) {
      const { searchSessionId, globalSearchSessionId } = getSearchSessionData()

      track(
        clickSearchSuggestionAutofillEvent({
          query: queryRef.current,
          suggestionText: maybeSuggestion.title || '',
          searchSessionId,
          suggestionsListId: suggestionsListId.current,
          suggestionPosition: prevHighlightedIndex.current! + 1,
          suggestionsSessionId: suggestionsSessionId.current,
          globalSearchSessionId,
        }),
      )
    }

    prevHighlightedIndex.current = highlightedIndex
  }, [highlightedIndex, suggestionsListId, suggestionsSessionId, track])

  useEffect(() => {
    trackedQuery.current = query
  }, [query])

  useEffect(() => {
    if (!items.length || isEqual(prevItems.current, items)) return

    track(
      viewSearchSuggestionsEvent({
        suggestions: items.map(item => item.title),
        query: trackedQuery.current,
        suggestionsSessionId: suggestionsSessionId.current,
      }),
    )

    prevItems.current = items
  }, [track, items, suggestionsSessionId])

  const onClearSuggestionsLatest = useLatestCallback(onClearSuggestions)

  useEffect(() => onClearSuggestionsLatest, [onClearSuggestionsLatest])

  const handleItemClick =
    (suggestion: SearchSuggestionModel, index: number) => (event: MouseEvent) => {
      onSuggestionClick(suggestion, index, event)
    }

  const getSuggestionKey = (suggestion: SearchSuggestionModel) => {
    return `${suggestion.title}${suggestion.frontendGeneratedTitle || ''}${suggestion.type}`
  }

  const getHighlightedTitle = (suggestionTitle: string) => {
    const escapedQuery = escape(query)
    const escapedSuggestionTitle = escape(suggestionTitle)

    return escapedSuggestionTitle.replace(
      new RegExp(`^${escapeRegExp(escapedQuery)}`, 'i'),
      '<b>$&</b>',
    )
  }

  const handleMobileAutofill = (
    event: MouseEvent,
    suggestion: SearchSuggestionModel,
    index: number,
  ) => {
    event.preventDefault()
    event.stopPropagation()
    onMobileAutofill(suggestion)

    const { searchSessionId, globalSearchSessionId } = getSearchSessionData()

    track(
      clickSearchSuggestionAutofillEvent({
        query,
        suggestionText: suggestion.title,
        searchSessionId,
        suggestionsListId: suggestionsListId.current,
        suggestionPosition: index + 1,
        suggestionsSessionId: suggestionsSessionId.current,
        globalSearchSessionId,
      }),
    )
  }

  const renderSuggestionPrefix = (
    type: Exclude<SearchSuggestionModel['type'], null | undefined>,
  ) => {
    switch (type) {
      case 'saved_search':
      case 'recent_search':
        return <Icon name={ArrowClock24} color="greyscale-level-1" testId="icon-arrow-clock" />
      case 'suggestion':
        return <Icon name={Search24} color="greyscale-level-1" testId="icon-search" />
      default:
        return null
    }
  }

  const renderSuggestion = (suggestion: SearchSuggestionModel, index: number) => {
    const showSuffix = breakpoint.phones && !suggestion.frontendGeneratedTitle

    const cellProps: Partial<React.ComponentProps<typeof Cell>> = {
      type: 'navigating',
      url: suggestionUrl(suggestion),
      theme: 'transparent',
      testId: `suggestion-${suggestion.title}`,
      suffix: showSuffix && (
        <Button
          testId="autofill-button"
          styling="flat"
          theme="muted"
          icon={<Icon name={ArrowTopLeft24} />}
          onClick={event => handleMobileAutofill(event, suggestion, index)}
          size="small"
        />
      ),
      prefix: !!suggestion.type && (
        <div className="u-fill-height u-fill-width u-flexbox u-justify-content-center u-align-items-center">
          {renderSuggestionPrefix(suggestion.type)}
        </div>
      ),
      onClick: handleItemClick(suggestion, index),
    }

    if (suggestion.frontendGeneratedTitle) {
      return (
        <Cell
          {...cellProps}
          key={getSuggestionKey(suggestion)}
          title={suggestion.frontendGeneratedTitle}
        />
      )
    }

    return (
      <Cell {...cellProps} key={getSuggestionKey(suggestion)}>
        <Text
          as="span"
          theme="amplified"
          text={getHighlightedTitle(suggestion.title)}
          html
          highlight
          highlightTheme="muted"
        />
      </Cell>
    )
  }

  const getHandleItemView = (item: SearchSuggestionModel, index: number) => (inView: boolean) => {
    if (!inView) return

    if (seenSuggestions.current.has(item.title)) return
    seenSuggestions.current.add(item.title)

    const { searchSessionId, globalSearchSessionId } = getSearchSessionData()

    const trackingArgs: ViewSearchSuggestionEventArgs = {
      frontendGeneratedTextSelected: !!item.frontendGeneratedTitle,
      globalSearchSessionId,
      query: item.title,
      searchSessionId: searchSessionId || null,
      selectedSuggestionText: item.title,
      suggestionPosition: index + 1,
      suggestionsListId: suggestionsListId.current,
      suggestionsSessionId: suggestionsSessionId.current,
    }

    if ('params' in item) {
      trackingArgs.params = item.params
    }

    track(viewSearchSuggestionEvent(trackingArgs))
  }

  const renderSuggestionWithBackground = (suggestion: SearchSuggestionModel, index: number) => {
    const isSelected = index === highlightedIndex

    return (
      <div
        key={getSuggestionKey(suggestion)}
        className={isSelected ? 'search-suggestions--hovered' : undefined}
        data-testid="search-suggestion-bg"
      >
        {renderSuggestion(suggestion, index)}
      </div>
    )
  }

  const renderSuggestions = (suggestions: Array<SearchSuggestionModel>) => (
    <List>
      {suggestions.map((suggestion, index) => (
        <InView onChange={getHandleItemView(suggestion, index)} key={getSuggestionKey(suggestion)}>
          {renderSuggestionWithBackground(suggestion, index)}
        </InView>
      ))}
    </List>
  )

  if (!items.length) return null

  return (
    <Cell styling="tight">
      {shouldAddViewSearchSuggestionEvent ? (
        renderSuggestions(items)
      ) : (
        <List>{items.map((item, index) => renderSuggestionWithBackground(item, index))}</List>
      )}
    </Cell>
  )
}

export default SearchSuggestions
