import {
  ApiClient,
  csrfTokenInterceptor,
  errorInterceptor,
  localeInterceptor,
} from '@marketplace-web/core-api/api-client-util'
import { CookieHandler, cookiesDataByName } from '@marketplace-web/environment/cookies-util'

const api = new ApiClient({ baseURL: '/web/api/auth' }, [
  csrfTokenInterceptor,
  errorInterceptor,
  localeInterceptor,
])

export const logoutUser = async ({ cookies }: { cookies: CookieHandler }) => {
  const response = await api.post('/logout')

  cookies.set(cookiesDataByName.last_user_id, '1')
  cookies.delete(cookiesDataByName.locale)

  return !('errors' in response)
}
