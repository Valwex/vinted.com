import { UpdateFaqEntryFeedbackArgs } from '../types/update-faq-entry-feedback'
import { updateFeedbackRatingOptionsArgsToParams } from './update-feedback-rating-options-args-to-params'

export const updateFaqEntryFeedbackArgsToParams = ({
  feedbackUuid,
  accessChannel,
  ...feedbackRatings
}: UpdateFaqEntryFeedbackArgs) => ({
  feedback_uuid: feedbackUuid,
  access_channel: accessChannel,
  ...updateFeedbackRatingOptionsArgsToParams(feedbackRatings),
})
