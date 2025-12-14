import { api } from '@marketplace-web/core-api/core-api-client-util'

import { ChangePhoneNumberArgs, NewPhoneNumberResp } from './types/phone-number'

export const changePhoneNumber = ({
  userId,
  currentNumber,
  newNumber,
  fingerprint,
}: ChangePhoneNumberArgs) =>
  api.post<NewPhoneNumberResp>(`/users/${userId}/phone_number/change`, {
    current_phone: currentNumber,
    new_phone: newNumber,
    fingerprint,
  })

export const createPhoneNumber = (userId: number, phoneNumber: string) =>
  api.post<NewPhoneNumberResp>(`/users/${userId}/phone_number`, {
    phone_number: {
      number: phoneNumber,
    },
  })
