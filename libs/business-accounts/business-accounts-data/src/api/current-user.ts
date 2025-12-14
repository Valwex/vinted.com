import { CURRENT_USER_API_ENDPOINT } from '@marketplace-web/core-api/api-client-util'
import { api } from '@marketplace-web/core-api/core-api-client-util'

import { GetCurrentUserResp } from '../types/current-user'

export const getCurrentUser = () => api.get<GetCurrentUserResp>(CURRENT_USER_API_ENDPOINT)
