type AiPoweredHelpEventBaseArgs = {
  helpCenterSessionId: string
}

type AiPoweredHelpQuerySubmittedArgs = AiPoweredHelpEventBaseArgs & {
  querySessionId: string
  queryText: string
  appLanguage?: string
  country: string
}

type AiPoweredHelpSuggestedArticleClickedArgs = AiPoweredHelpEventBaseArgs & {
  querySessionId: string
  faqEntryId: string
}

type AiPoweredHelpFeedbackProvidedArgs = AiPoweredHelpEventBaseArgs & {
  querySessionId: string
  isResponseHelpful: boolean
}

type AiPoweredHelpSuggestionsDisplayedArgs = AiPoweredHelpEventBaseArgs & {
  query: string
  suggestions: Array<string>
}

type AiPoweredHelpClearButtonClickedArgs = AiPoweredHelpEventBaseArgs & {
  query: string
}

type AiPoweredHelpSuggestionClickedArgs = AiPoweredHelpEventBaseArgs & {
  selectedSuggestion: string
  selectedSuggestionRank: number
}

type AiPoweredHelpQuerySubmittedEventExtra = {
  help_center_session_id: string
  query_session_id: string
  query_text: string
  app_language?: string
  country: string
}

type AiPoweredHelpSuggestedArticleClickedEventExtra = {
  help_center_session_id: string
  query_session_id: string
  faq_entry_id: string
}

type AiPoweredHelpFeedbackProvidedEventExtra = {
  help_center_session_id: string
  query_session_id: string
  is_response_helpful: boolean
}

type AiPoweredHelpSuggestionsDisplayedEventExtra = {
  help_center_session_id: string
  suggestions: Array<string>
  query_input_field_content: string
}

type AiPoweredHelpSuggestionClickedEventExtra = {
  help_center_session_id: string
  suggestion_text: string
  suggestion_rank: number
}

type AiPoweredHelpClearButtonClickedEventExtra = {
  help_center_session_id: string
  query_input_field_content: string
}

// Member submitted query
export const aiPoweredHelpQuerySubmittedEvent = (args: AiPoweredHelpQuerySubmittedArgs) => {
  const extra: AiPoweredHelpQuerySubmittedEventExtra = {
    help_center_session_id: args.helpCenterSessionId,
    query_session_id: args.querySessionId,
    app_language: args.appLanguage,
    country: args.country,
    query_text: args.queryText,
  }

  return {
    event: 'help_center.ai_powered_help_query_submitted',
    extra,
  }
}

// Member viewed result screen
export const aiPoweredHelpScreenViewEvent = (args: AiPoweredHelpEventBaseArgs) => {
  const extra = {
    help_center_session_id: args.helpCenterSessionId,
  }

  return {
    event: 'help_center.ai_powered_help_screen_view',
    extra,
  }
}

// Member clicked a suggested FAQ on AI Powered Help screen
export const aiPoweredHelpSuggestedArticleClickedEvent = (
  args: AiPoweredHelpSuggestedArticleClickedArgs,
) => {
  const extra: AiPoweredHelpSuggestedArticleClickedEventExtra = {
    help_center_session_id: args.helpCenterSessionId,
    query_session_id: args.querySessionId,
    faq_entry_id: args.faqEntryId,
  }

  return {
    event: 'help_center.ai_powered_help_suggested_article_clicked',
    extra,
  }
}

// Member clicked a suggested FAQ on AI Powered Help screen
export const aiPoweredHelpFeedbackProvidedEvent = (args: AiPoweredHelpFeedbackProvidedArgs) => {
  const extra: AiPoweredHelpFeedbackProvidedEventExtra = {
    help_center_session_id: args.helpCenterSessionId,
    query_session_id: args.querySessionId,
    is_response_helpful: args.isResponseHelpful,
  }

  return {
    event: 'help_center.ai_powered_help_feedback_provided',
    extra,
  }
}

// Member sees search suggestions
export const aiPoweredHelpSuggestionsDisplayed = (args: AiPoweredHelpSuggestionsDisplayedArgs) => {
  const extra: AiPoweredHelpSuggestionsDisplayedEventExtra = {
    help_center_session_id: args.helpCenterSessionId,
    query_input_field_content: args.query,
    suggestions: args.suggestions,
  }

  return {
    event: 'help_center.ai_powered_help_suggestions_displayed',
    extra,
  }
}

// Member clicks on any search suggestion
export const aiPoweredHelpSuggestionClicked = (args: AiPoweredHelpSuggestionClickedArgs) => {
  const extra: AiPoweredHelpSuggestionClickedEventExtra = {
    help_center_session_id: args.helpCenterSessionId,
    suggestion_rank: args.selectedSuggestionRank,
    suggestion_text: args.selectedSuggestion,
  }

  return {
    event: 'help_center.ai_powered_help_suggestion_clicked',
    extra,
  }
}

// Member clears input query
export const aiPoweredHelpClearButtonClicked = (args: AiPoweredHelpClearButtonClickedArgs) => {
  const extra: AiPoweredHelpClearButtonClickedEventExtra = {
    help_center_session_id: args.helpCenterSessionId,
    query_input_field_content: args.query,
  }

  return {
    event: 'help_center.ai_powered_help_clear_button_clicked',
    extra,
  }
}
