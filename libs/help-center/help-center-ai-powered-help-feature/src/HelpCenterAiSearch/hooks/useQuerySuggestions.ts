import { useEffect, useMemo, useState } from 'react'

import { useFetch } from '@marketplace-web/core-api/api-client-util'
import { useDebounce } from '@marketplace-web/shared/ui-helpers'
import { useTranslate } from '@marketplace-web/i18n/i18n-feature'
import { getQuerySuggestions } from '@marketplace-web/help-center/help-center-ai-powered-help-data'

export const QUERY_SUGGESTION_DEBOUNCE = 100

export function useQuerySuggestions(query: string) {
  const [suggestions, setSuggestions] = useState<Array<string>>([])
  const [fetched, setFetched] = useState(false)
  const translate = useTranslate()

  const { data, fetch } = useFetch(getQuerySuggestions)

  useEffect(() => {
    if (!data) return
    setSuggestions(data.query_suggestions)
  }, [data])

  const clearSuggestions = () => {
    setSuggestions([])
    setFetched(false)
  }

  const fetchSuggestions = useDebounce(
    async (latestQuery: string) => {
      await fetch({ query: latestQuery })

      setFetched(true)
    },
    QUERY_SUGGESTION_DEBOUNCE,
    false,
  )

  const suggestionsWithFallback = useMemo<Array<string>>(() => {
    if (!fetched) return []

    const userQuery = translate('search_suggestions.suggestion_fallback', { query })

    return [...suggestions, userQuery]
  }, [fetched, query, suggestions, translate])

  return {
    clearSuggestions,
    fetchSuggestions,
    displayedSuggestions: suggestionsWithFallback,
    suggestions: [...suggestions, query],
  }
}
