import { api as coreApi } from '@marketplace-web/core-api/core-api-client-util'

import {
  ApiClient,
  csrfTokenInterceptor,
  errorInterceptor,
  localeInterceptor,
  CURRENT_USER_API_ENDPOINT,
} from '@marketplace-web/core-api/api-client-util'
import { missingDataDomeScriptDetectionInterceptor } from '@marketplace-web/bot-detection/data-dome-util'

import { Oauth2UserLoginArgs } from '../types/oauth2-user-login-args'
import { authenticateUserArgsToParams } from '../transformers/authenticate-user'
import { AuthenticateUserError, LoginUserArgs } from '../types/authentication'
import { GetCurrentUserResp } from '../types/current-user'

export const oauth2UserLogin = (args: Oauth2UserLoginArgs) =>
  coreApi.post<{ redirect_to: string }, AuthenticateUserError>('/oauth2', args)

const webApi = new ApiClient({ baseURL: '/web/api/auth' }, [
  csrfTokenInterceptor,
  errorInterceptor,
  localeInterceptor,
  missingDataDomeScriptDetectionInterceptor,
])

export const authenticateUser = async (args: LoginUserArgs) =>
  webApi.post<unknown, AuthenticateUserError>('/oauth', {
    client_id: 'web',
    scope: 'user',
    ...authenticateUserArgsToParams(args),
  })

export const getCurrentUser = () => coreApi.get<GetCurrentUserResp>(CURRENT_USER_API_ENDPOINT)
