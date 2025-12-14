import { api } from '@marketplace-web/core-api/core-api-client-util'

import { GetReferrerResp } from '../types/referrer'

export const getReferrer = () => api.get<GetReferrerResp>('/referrals/referrer')
