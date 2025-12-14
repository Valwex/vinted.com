import { api } from '@marketplace-web/core-api/core-api-client-util'

type SendNpsSurveyResponseArgs = {
  userId: number
  score: number
  comment: string | null | undefined
  incomplete: boolean
}

export const sendNpsSurveyResponse = ({
  userId,
  score,
  comment,
  incomplete,
}: SendNpsSurveyResponseArgs) =>
  api.post(`/users/${userId}/nps`, {
    score,
    comment,
    incomplete,
  })

export type DeleteNpsSurveyArgs = {
  userId: number
}

export const deleteNpsSurvey = ({ userId }: DeleteNpsSurveyArgs) =>
  api.delete(`/users/${userId}/nps`)
