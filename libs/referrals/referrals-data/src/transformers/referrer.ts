import { CreateReferrerResp, ReferrerDto, ReferrerModel } from '../types/referrer'

export const transformReferrerDto = ({
  referrer_id,
  login,
  photo_url,
  feedback_count,
  feedback_reputation,
  is_business,
  business_account_name,
}: ReferrerDto): ReferrerModel => ({
  referrerId: referrer_id,
  login,
  photoUrl: photo_url,
  feedbackReputation: feedback_reputation,
  feedbackCount: feedback_count,
  isBusiness: is_business,
  businessAccountName: business_account_name,
})

export const transformCreateReferrerResponse = (response: CreateReferrerResp) => ({
  referralInviteUrl: response.referral_invite_url,
  referrerId: response.referrer_id,
})
