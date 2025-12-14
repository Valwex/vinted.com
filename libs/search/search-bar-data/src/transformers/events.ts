// Temporary workaround. Resolve ASAP. Do not add more ignores like this.
// eslint-disable-next-line eslint-comments/no-restricted-disable
// eslint-disable-next-line @nx/enforce-module-boundaries
import { SavedSearchType } from '@marketplace-web/search/search-feature'

// Source: https://github.com/vinted/dwh-schema-registry/blob/5387d2ce7b44ee93711a15dfb97c60a4d984f22c/avro/events/common/shared/user.avdl#L25
type UserTarget =
  | 'open_photo_gallery'
  | 'take_photo'
  | 'search_bar'
  | 'search_bar_type'
  | 'cancel'
  | 'search_by_image'

export type SelectSearchSuggestionEventArgs = {
  suggestions: Array<string>
  index: number
  suggestion: string
  subtitle?: string
  query: string
  countryCode: string | undefined
  searchSessionId: string
  globalSearchSessionId: string | null
  suggestionsSessionId: string
  params?: Array<Map<string, Array<string>>>
  isFrontendGeneratedSuggestion: boolean
  suggestionsListId?: string | null
  suggestionPosition?: number
}

type SelectSearchSuggestionEventExtra = {
  suggestion_index: number
  suggestions_list: Array<string>
  selected_suggestion_text: string
  selected_suggestion_subtitle?: string
  query: string
  country_code?: string
  search_session_id?: string
  global_search_session_id: string | null
  suggestions_session_id: string
  params?: Array<Map<string, Array<string>>>
  frontend_generated_text_selected?: boolean
  suggestions_list_id?: string | null
  suggestion_position?: number
}

export const selectSearchSuggestionEvent = (args: SelectSearchSuggestionEventArgs) => {
  const {
    suggestions,
    index,
    suggestion,
    subtitle,
    query,
    countryCode,
    searchSessionId,
    globalSearchSessionId,
    suggestionsSessionId,
    params,
    isFrontendGeneratedSuggestion,
    suggestionsListId,
    suggestionPosition,
  } = args

  const extra: SelectSearchSuggestionEventExtra = {
    suggestions_session_id: suggestionsSessionId,
    suggestion_index: index,
    suggestions_list: suggestions,
    selected_suggestion_text: suggestion,
    query,
    global_search_session_id: globalSearchSessionId,
    frontend_generated_text_selected: isFrontendGeneratedSuggestion,
  }

  if (subtitle) {
    extra.selected_suggestion_subtitle = subtitle
  }

  if (countryCode) {
    extra.country_code = countryCode
  }

  if (searchSessionId) {
    extra.search_session_id = searchSessionId
  }

  if (params?.length) {
    extra.params = params
  }

  if (suggestionsListId) {
    extra.suggestions_list_id = suggestionsListId
  }

  if (suggestionPosition) {
    extra.suggestion_position = suggestionPosition
  }

  return {
    event: 'user.select_search_suggestion',
    extra,
  }
}

type ViewSearchSuggestionsEventArgs = {
  suggestions: Array<string>
  query: string
  suggestionsSessionId: string
}

type ViewSearchSuggestionsEventExtra = {
  suggestions_list: Array<string>
  query: string
  suggestions_session_id: string
}

export const viewSearchSuggestionsEvent = (args: ViewSearchSuggestionsEventArgs) => {
  const { suggestions, query, suggestionsSessionId } = args

  const extra: ViewSearchSuggestionsEventExtra = {
    suggestions_session_id: suggestionsSessionId,
    suggestions_list: suggestions,
    query,
  }

  return {
    event: 'user.view_search_suggestions',
    extra,
  }
}

export type ViewSearchSuggestionEventArgs = {
  suggestionPosition: number
  selectedSuggestionText: string
  query: string
  suggestionsSessionId: string
  suggestionsListId: string | null
  params?: Array<Map<string, Array<string>>>
  frontendGeneratedTextSelected: boolean
  searchSessionId: string | null
  globalSearchSessionId: string | null
}

type ViewSearchSuggestionEventExtra = {
  suggestion_position: number
  selected_suggestion_text: string
  query: string
  suggestions_session_id: string
  suggestions_list_id: string | null
  params?: Array<Map<string, Array<string>>>
  frontend_generated_text: boolean
  search_session_id: string | null
  global_search_session_id: string | null
}

export const viewSearchSuggestionEvent = (args: ViewSearchSuggestionEventArgs) => {
  const {
    suggestionPosition,
    query,
    suggestionsSessionId,
    selectedSuggestionText,
    suggestionsListId,
    params,
    frontendGeneratedTextSelected,
    searchSessionId,
    globalSearchSessionId,
  } = args

  const extra: ViewSearchSuggestionEventExtra = {
    suggestion_position: suggestionPosition,
    selected_suggestion_text: selectedSuggestionText,
    query,
    suggestions_session_id: suggestionsSessionId,
    suggestions_list_id: suggestionsListId,
    frontend_generated_text: frontendGeneratedTextSelected,
    search_session_id: searchSessionId,
    global_search_session_id: globalSearchSessionId,
  }

  if (params?.length) {
    extra.params = params
  }

  return {
    event: 'user.view_search_suggestion',
    extra,
  }
}

type ToggleSearchSubscriptionEventArgs = {
  position?: number
  isSubscribing: boolean
  searchTitle?: string
  searchQuery?: string | null
  searchSessionId: string
  globalSearchSessionId: string | null
  screen: string
  savedRecentSearchListId: string | null
  savedRecentSearchSessionId: string | null
}

type ToggleSearchSubscriptionEventExtra = {
  position?: number
  is_subscribing: boolean
  search_title?: string
  search_query?: string
  search_session_id?: string
  global_search_session_id: string | null
  screen: string
  saved_recent_search_list_id: string | null
  saved_recent_search_session_id: string | null
}

export const toggleSearchSubscriptionEvent = (args: ToggleSearchSubscriptionEventArgs) => {
  const {
    isSubscribing,
    searchTitle,
    searchQuery,
    searchSessionId,
    globalSearchSessionId,
    position,
    screen,
    savedRecentSearchListId,
    savedRecentSearchSessionId,
  } = args

  const extra: ToggleSearchSubscriptionEventExtra = {
    screen,
    position,
    saved_recent_search_session_id: savedRecentSearchSessionId,
    saved_recent_search_list_id: savedRecentSearchListId,
    is_subscribing: isSubscribing,
    global_search_session_id: globalSearchSessionId,
  }

  if (searchTitle) extra.search_title = searchTitle
  if (searchQuery) extra.search_query = searchQuery
  if (searchSessionId) extra.search_session_id = searchSessionId

  return {
    event: 'user.toggle_search_subscription',
    extra,
  }
}

type SelectSavedSearchEventArgs = {
  type: SavedSearchType
  searchTitle: string
  searchSessionId: string
  globalSearchSessionId: string | null
  newItemsCount: number | null
  unrestrictedNewItemsCount: number | null
  position: number
  screen: string
  savedRecentSearchListId: string
  savedRecentSearchSessionId: string
}

type SelectSavedSearchEventExtra = {
  type: SavedSearchType
  search_title: string
  search_session_id?: string
  global_search_session_id: string | null
  new_items_count?: number | null
  unrestricted_new_items_count?: number | null
  position: number
  screen: string
  saved_recent_search_list_id: string
  saved_recent_search_session_id: string
}

export const selectSavedSearchEvent = (args: SelectSavedSearchEventArgs) => {
  const {
    type,
    searchTitle,
    searchSessionId,
    globalSearchSessionId,
    newItemsCount,
    unrestrictedNewItemsCount,
    position,
    screen,
    savedRecentSearchListId,
    savedRecentSearchSessionId,
  } = args

  const extra: SelectSavedSearchEventExtra = {
    screen,
    type,
    position,
    saved_recent_search_list_id: savedRecentSearchListId,
    new_items_count: newItemsCount,
    unrestricted_new_items_count: unrestrictedNewItemsCount,
    search_title: searchTitle,
    global_search_session_id: globalSearchSessionId,
    search_session_id: searchSessionId || undefined,
    saved_recent_search_session_id: savedRecentSearchSessionId,
  }

  return {
    event: 'user.select_saved_search',
    extra,
  }
}

type ViewSavedSearchArgs = {
  type: SavedSearchType
  searchTitle: string
  position: number
  searchSessionId?: string | null
  globalSearchSessionId?: string | null
  newItemsCount?: number | null
  unrestrictedNewItemsCount?: number | null
  screen: string
  savedRecentSearchListId: string
  savedRecentSearchSessionId: string
}

type ViewSavedSearchExtra = {
  type: SavedSearchType
  search_title: string
  position: number
  search_session_id?: string | null
  global_search_session_id?: string | null
  new_items_count?: number | null
  unrestricted_new_items_count?: number | null
  screen: string
  saved_recent_search_list_id: string
  saved_recent_search_session_id: string
}

export const viewSavedSearchEvent = (args: ViewSavedSearchArgs) => {
  const {
    position,
    searchSessionId,
    searchTitle,
    type,
    newItemsCount,
    globalSearchSessionId,
    unrestrictedNewItemsCount,
    screen,
    savedRecentSearchListId,
    savedRecentSearchSessionId,
  } = args

  const extra: ViewSavedSearchExtra = {
    type,
    position,
    screen,
    saved_recent_search_list_id: savedRecentSearchListId,
    search_title: searchTitle,
    new_items_count: newItemsCount,
    search_session_id: searchSessionId,
    global_search_session_id: globalSearchSessionId,
    unrestricted_new_items_count: unrestrictedNewItemsCount,
    saved_recent_search_session_id: savedRecentSearchSessionId,
  }

  return {
    event: 'user.view_saved_search',
    extra,
  }
}

type ClickSearchSuggestionAutofillArgs = {
  suggestionPosition: number
  suggestionText: string
  query: string
  suggestionsSessionId: string | null
  suggestionsListId: string | null
  searchSessionId: string | null
  globalSearchSessionId: string | null
}

type ClickSearchSuggestionAutofillExtra = {
  suggestion_position: number
  suggestion_text: string
  query: string
  suggestions_session_id: string | null
  suggestions_list_id: string | null
  search_session_id: string | null
  global_search_session_id: string | null
}

export const clickSearchSuggestionAutofillEvent = (args: ClickSearchSuggestionAutofillArgs) => {
  const extra: ClickSearchSuggestionAutofillExtra = {
    suggestion_position: args.suggestionPosition,
    suggestion_text: args.suggestionText,
    suggestions_session_id: args.suggestionsSessionId,
    suggestions_list_id: args.suggestionsListId,
    search_session_id: args.searchSessionId,
    global_search_session_id: args.globalSearchSessionId,
    query: args.query,
  }

  return {
    event: 'user.click_search_suggestion_autofill',
    extra,
  }
}

type SearchSuggestionAutofillTextSubmittedArgs = {
  suggestionText: string
  query: string
  suggestionsSessionId: string | null
  suggestionsListId: string | null
  params: Array<Map<string, Array<string>>> | null
}

type SearchSuggestionAutofillTextSubmittedExtra = {
  suggestion_text: string
  query: string
  suggestions_session_id: string | null
  suggestions_list_id: string | null
  params: Array<Map<string, Array<string>>> | null
}

export const searchSuggestionAutofillTextSubmittedEvent = (
  args: SearchSuggestionAutofillTextSubmittedArgs,
) => {
  const extra: SearchSuggestionAutofillTextSubmittedExtra = {
    suggestions_session_id: args.suggestionsSessionId,
    suggestion_text: args.suggestionText,
    suggestions_list_id: args.suggestionsListId,
    query: args.query,
    params: args.params,
  }

  return {
    event: 'user.search_suggestion_autofill_text_submitted',
    extra,
  }
}

type ClickEventArgs = {
  target: UserTarget
  screen?: string | null
  targetDetails?: string | null
  path?: string | null
  env?: string | null
}

type ClickEventExtra = {
  target: UserTarget
  screen?: string
  target_details?: string
  path?: string | null
  env?: string | null
}

export const clickEvent = (args: ClickEventArgs) => {
  const { target, screen, targetDetails, env, path } = args
  const extra: ClickEventExtra = { target }

  if (screen) extra.screen = screen

  if (targetDetails) extra.target_details = targetDetails

  if (env) extra.env = env

  if (path) extra.path = path

  return {
    event: 'user.click',
    extra,
  }
}

type ViewScreenEventArgs = {
  screen: string
}

export const viewScreenEvent = (args: ViewScreenEventArgs) => {
  const { screen } = args

  const extra = {
    screen,
  }

  return {
    event: 'user.view_screen',
    extra,
  }
}
