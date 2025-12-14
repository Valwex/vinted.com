import { api } from '@marketplace-web/core-api/core-api-client-util'

import { updateFaqEntryFeedbackArgsToParams } from '../transformers/update-faq-entry-feedback-args-to-params'

import { GetTransactionArgs, GetTransactionResp } from '../types/transaction'
import { FaqInfoBoxResp } from '../types/faq-info-box'
import { UpdateFaqEntryFeedbackArgs } from '../types/update-faq-entry-feedback'
import { FaqEntryFeedbackResp } from '../types/faq-entry-feedback'
import { FaqEntriesResp } from '../types/faq-entries-resp'

const moneyObjectHeader = {
  'X-Money-Object': 'true',
}

export const getTransaction = ({ id }: GetTransactionArgs) =>
  api.get<GetTransactionResp>(`/transactions/${id}`, { headers: moneyObjectHeader })

export const getFaqInfoBox = () => api.get<FaqInfoBoxResp>('faq_entries/faq_infobox')

export const updateFaqEntryFeedbackForm = (args: UpdateFaqEntryFeedbackArgs) =>
  api.patch(`/faq_entries/${args.faqId}/feedback`, updateFaqEntryFeedbackArgsToParams(args))

export const getFaqEntryFeedbackData = (faqId: number) =>
  api.get<FaqEntryFeedbackResp>(`/faq_entries/${faqId}/feedback`)

export const getFaqEntries = () => api.get<FaqEntriesResp>('/faq_entries')
