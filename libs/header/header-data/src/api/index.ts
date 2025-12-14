import { api } from '@marketplace-web/core-api/core-api-client-util'

import { VerificationPromptResp } from '../types/verification'

export const dismissVerificationPrompt = (userId: number) =>
  api.delete(`/users/${userId}/verifications/prompt`)

export const getVerificationPrompt = (userId: number) =>
  api.get<VerificationPromptResp>(`/users/${userId}/verifications/prompt`)
