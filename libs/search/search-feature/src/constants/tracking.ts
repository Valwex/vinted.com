export enum SavedSearchType {
  RecentSearch = 'recent_search',
  SubscribedSearch = 'subscribed_search',
}

export enum SearchStartType {
  SearchSuggestions = 'search_suggestions',
  SearchManual = 'search_manual',
  RecentSearch = 'recent_searches',
  SubscribedSearch = 'subscribed_searches',
  SearchByImage = 'search_by_image',
}

export type SearchStartData = {
  searchStartId: string | null
  searchStartType: SearchStartType | null
}
