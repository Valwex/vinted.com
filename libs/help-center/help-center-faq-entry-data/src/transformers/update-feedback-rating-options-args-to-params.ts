import { UpdateFeedbackRatingOptionsArgs } from '../types/feedback-rating'

export const updateFeedbackRatingOptionsArgsToParams = ({
  rating,
  message,
  feedbackStatementParentId,
  feedbackStatementIds,
  finalized,
}: UpdateFeedbackRatingOptionsArgs) => ({
  feedback_ratings: {
    finalized,
    rating,
    comment: message,
    feedback_statement_parent_id: feedbackStatementParentId,
    feedback_statement_ids: feedbackStatementIds,
  },
})
