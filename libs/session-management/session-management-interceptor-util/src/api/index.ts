import {
  ApiClient,
  csrfTokenInterceptor,
  errorInterceptor,
  localeInterceptor,
} from '@marketplace-web/core-api/api-client-util'

const api = new ApiClient({ baseURL: '/web/api/auth' }, [
  csrfTokenInterceptor,
  errorInterceptor,
  localeInterceptor,
])

export const refreshSessionTokens = async () => api.post<{ access_token: unknown }>('/refresh')
