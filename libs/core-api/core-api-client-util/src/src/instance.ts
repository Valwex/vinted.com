import {
  anonIdInterceptor,
  API_BASE_PATH,
  ApiClient,
  appendAcceptWebPHeaderInterceptor,
  appendPriorityInterceptor,
  csrfTokenInterceptor,
  errorInterceptor,
  localeInterceptor,
} from '@marketplace-web/core-api/api-client-util'
import { tokenRefreshInterceptor } from '@marketplace-web/session-management/session-management-interceptor-util'
import {
  phoneVerificationInterceptor,
  twoFAInterceptor,
} from '@marketplace-web/verification/verification-interceptors-util'

const baseURL = API_BASE_PATH

export const api = new ApiClient({ baseURL }, [
  csrfTokenInterceptor,
  errorInterceptor,
  tokenRefreshInterceptor,
  localeInterceptor,
  phoneVerificationInterceptor,
  twoFAInterceptor,
  anonIdInterceptor,
  appendAcceptWebPHeaderInterceptor,
  appendPriorityInterceptor,
])
