import { api } from '@marketplace-web/core-api/core-api-client-util'

import {
  GetAccountStaffResp,
  GetStaffAccountAssertionResp,
  InviteStaffResp,
} from '../types/account-staff'

export const deleteAccountStaffInvitation = (invitationId: number) =>
  api.delete(`secondary_users/staff/${invitationId}`)

export const getAccountStaff = () => api.get<GetAccountStaffResp>('secondary_users/staff')

export const getStaffAccountAssertion = (targetUserId: number) =>
  api.post<GetStaffAccountAssertionResp>('secondary_users/assertions', {
    target_user_id: targetUserId,
  })

export const inviteStaff = (email: string) =>
  api.post<InviteStaffResp>('secondary_users/invitation', { email })

export const acceptAccountInvitation = (token: string) =>
  api.post('/secondary_users/invitation/accept', { token })
