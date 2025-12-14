import { api } from '@marketplace-web/core-api/core-api-client-util'

import type {
  CreateUser2FAArgs,
  CreateUser2FAResp,
  GetTwoFADetailsResp,
  PhonePrefixDataResp,
} from '../types/verification'

export const createUser2FA = (args: CreateUser2FAArgs) =>
  api.post<CreateUser2FAResp>(
    `/users/${args.userId}/user_2fa`,
    {
      entity_id: args.entityId,
      type: args.entityType,
      fingerprint: args.fingerprint,
    },
    { params: { phone_number: args.number } },
  )

export const getTwoFADetails = (twoFaId: string) =>
  api.get<GetTwoFADetailsResp>(`user_verifier/${twoFaId}/details`)

export const setVoluntary2FA = (userId: number, isVoluntary2FA: boolean) =>
  api.put(`users/${userId}/security/voluntary_2fa`, {
    is_voluntary_2fa: isVoluntary2FA,
  })

export const getPhonePrefixData = () => api.get<PhonePrefixDataResp>('phone_number/prefixes')
