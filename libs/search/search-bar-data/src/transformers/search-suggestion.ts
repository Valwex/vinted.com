import { SearchSuggestionDto } from '../types/dtos/search-suggestion'
import { SearchSuggestionModel } from '../types/models/search-suggestion'

export const transformSearchSuggestion = (
  suggestion: SearchSuggestionDto,
): SearchSuggestionModel => {
  return suggestion
}

export const transformSearchSuggestions = (
  suggestions: Array<SearchSuggestionDto>,
): Array<SearchSuggestionModel> => suggestions.map(transformSearchSuggestion)
