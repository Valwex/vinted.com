import { api } from '@marketplace-web/core-api/core-api-client-util'

import { GetBrazeAuthTokenResp } from '../types/responses'

export const getBrazeAuthToken = () => api.get<GetBrazeAuthTokenResp>('/external_crm/jwts')
