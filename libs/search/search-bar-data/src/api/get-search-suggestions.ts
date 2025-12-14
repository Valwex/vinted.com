import { api } from '@marketplace-web/core-api/core-api-client-util'

import { SearchSuggestionDto } from '../types/dtos/search-suggestion'

export type GetSearchSuggestionsArgs = {
  query: string
}

export type SearchSuggestionsResp = {
  search_suggestions: Array<SearchSuggestionDto>
}

export const getSearchSuggestions = ({ query }: GetSearchSuggestionsArgs) =>
  api.get<SearchSuggestionsResp>('/search_suggestions', {
    params: { query },
  })
