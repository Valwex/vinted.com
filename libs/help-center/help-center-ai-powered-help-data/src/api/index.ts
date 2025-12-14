import { api } from '@marketplace-web/core-api/core-api-client-util'

type AiHelpResultFaqEntryDto = {
  id: number
  title: string
}

type AiSummaryResp = {
  faq_entries: Array<AiHelpResultFaqEntryDto>
  answer: string
}

type AiSummaryArgs = {
  query: string
  helpCenterSessionId?: string
  aiPoweredHelpSessionId?: string
  answerFormat?: string
}

type QuerySuggestionsArgs = {
  query: string
}

export type QuerySuggestionsResp = {
  query_suggestions: Array<string>
}

export const getAiSummary = (args: AiSummaryArgs) =>
  api.post<AiSummaryResp, unknown>('/faq_entries/summarise', {
    query: args.query,
    help_center_session_id: args.helpCenterSessionId,
    ai_powered_help_session_id: args.aiPoweredHelpSessionId,
    answer_format: args.answerFormat,
  })

export const getQuerySuggestions = ({ query }: QuerySuggestionsArgs) =>
  api.get<QuerySuggestionsResp>('/faq_entries/query_suggestions', {
    params: { query },
  })
