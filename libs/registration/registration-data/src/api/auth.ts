import {
  ApiClient,
  csrfTokenInterceptor,
  errorInterceptor,
  localeInterceptor,
} from '@marketplace-web/core-api/api-client-util'
import {
  EMAIL_REGISTER_HEADERS,
  FACEBOOK_REGISTER_HEADERS,
  GOOGLE_REGISTER_HEADERS,
  APPLE_REGISTER_HEADERS,
} from '@marketplace-web/bot-detection/script-detection-util'
import { missingDataDomeScriptDetectionInterceptor } from '@marketplace-web/bot-detection/data-dome-util'

import { RegisterUserArgs, RegisterUserResponse } from '../types/register-user'
import {
  RegisterFacebookUserArgs,
  RegisterFacebookUserResponse,
} from '../types/register-facebook-user'
import { RegisterGoogleUserResponse } from '../types/register-google-user'
import { RegisterAppleUserArgs, RegisterAppleUserResponse } from '../types/register-apple-user'
import { GenerateRandomUserArgs } from '../types/generate-random-user'

const api = new ApiClient({ baseURL: '/web/api/auth' }, [
  csrfTokenInterceptor,
  errorInterceptor,
  localeInterceptor,
  missingDataDomeScriptDetectionInterceptor,
])

export function registerUser(args: RegisterUserArgs, config: { headers: Record<string, string> }) {
  const {
    realName,
    login,
    email,
    password,
    agreeRules,
    subscribeToNewsletter = false,
    fingerprint,
    zipCode,
  } = args

  const user = {
    real_name: realName,
    login,
    email,
    password,
    agree_rules: agreeRules,
    user_settings: {
      is_newsletter_subscriber: subscribeToNewsletter,
    },
    zip_code: zipCode,
  }

  return api.post<RegisterUserResponse>(
    '/email-register',
    {
      user,
      fingerprint,
    },
    { headers: { ...EMAIL_REGISTER_HEADERS, ...config.headers } },
  )
}

export function registerFacebookUser(
  args: RegisterFacebookUserArgs,
  config: { headers: Record<string, string> },
) {
  const {
    token,
    login,
    email,
    subscribeToNewsletter = false,
    realName,
    fingerprint,
    zipCode,
  } = args

  const user = {
    login,
    real_name: realName,
    email,
    user_setting: {
      is_newsletter_subscriber: subscribeToNewsletter,
    },
    zip_code: zipCode,
  }

  return api.post<RegisterFacebookUserResponse>(
    '/facebook-register',
    {
      fb_access_token: token,
      user,
      fingerprint,
    },
    { headers: { ...FACEBOOK_REGISTER_HEADERS, ...config.headers } },
  )
}

export function registerGoogleUser(
  args: RegisterFacebookUserArgs,
  config: { headers: Record<string, string> },
) {
  const {
    token,
    login,
    email,
    subscribeToNewsletter = false,
    realName,
    fingerprint,
    zipCode,
  } = args

  const user = {
    login,
    real_name: realName,
    email,
    user_setting: {
      is_newsletter_subscriber: subscribeToNewsletter,
    },
    zip_code: zipCode,
  }

  return api.post<RegisterGoogleUserResponse>(
    '/google-register',
    {
      id_token: token,
      user,
      fingerprint,
    },
    { headers: { ...GOOGLE_REGISTER_HEADERS, ...config.headers } },
  )
}

export function registerAppleUser(
  args: RegisterAppleUserArgs,
  config: { headers: Record<string, string> },
) {
  const {
    token,
    login,
    email,
    subscribeToNewsletter = false,
    realName,
    fingerprint,
    zipCode,
  } = args

  const user = {
    login,
    real_name: realName,
    email,
    user_setting: {
      is_newsletter_subscriber: subscribeToNewsletter,
    },
    zip_code: zipCode,
  }

  return api.post<RegisterAppleUserResponse>(
    '/apple-register',
    {
      id_token: token,
      user,
      fingerprint,
    },
    { headers: { ...APPLE_REGISTER_HEADERS, ...config.headers } },
  )
}

export function generateRandomUser(
  args: GenerateRandomUserArgs,
  config: { headers: Record<string, string> },
) {
  const { isGod } = args

  return api.post('/generate-random-user', { is_god: isGod }, config)
}
