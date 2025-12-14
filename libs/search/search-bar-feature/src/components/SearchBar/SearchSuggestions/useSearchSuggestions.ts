import { useEffect, useMemo, useRef, useState } from 'react'
import { v4 as uuid } from 'uuid'

import { useFetch } from '@marketplace-web/core-api/api-client-util'
import { useTranslate } from '@marketplace-web/i18n/i18n-feature'
import { useDebounce } from '@marketplace-web/shared/ui-helpers'
import {
  SearchSuggestionModel,
  transformSearchSuggestions,
  getSearchSuggestions,
} from '@marketplace-web/search/search-bar-data'

export const SEARCH_SUGGESTION_DEBOUNCE = 100

export const buildFallbackSuggestion = (title: string, query: string): SearchSuggestionModel => ({
  title: query,
  frontendGeneratedTitle: title,
})

export function useSearchSuggestions(query: string) {
  const translate = useTranslate()

  const suggestionsListId = useRef<string | null>(null)

  const [suggestions, setSuggestions] = useState<Array<SearchSuggestionModel>>([])
  const [fetched, setFetched] = useState(false)

  const { data, fetch } = useFetch(getSearchSuggestions)

  useEffect(() => {
    if (!data) return
    setSuggestions(transformSearchSuggestions(data.search_suggestions))
  }, [data])

  const clearSuggestions = () => {
    setSuggestions([])
    setFetched(false)
    suggestionsListId.current = null
  }

  const fetchSuggestions = useDebounce(
    async (latestQuery: string) => {
      await fetch({ query: latestQuery })

      suggestionsListId.current = uuid()
      setFetched(true)
    },
    SEARCH_SUGGESTION_DEBOUNCE,
    false,
  )

  const transformed = useMemo<Array<SearchSuggestionModel>>(() => {
    if (!fetched) return []

    const title = translate('search_suggestions.suggestion_fallback', { query })

    return [...suggestions, buildFallbackSuggestion(title, query)]
  }, [fetched, query, suggestions, translate])

  return {
    suggestionsListId,
    clearSuggestions,
    fetchSuggestions,
    suggestions: transformed,
  }
}
