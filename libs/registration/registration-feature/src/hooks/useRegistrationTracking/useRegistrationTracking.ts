'use client'

import { Response, ResponseError } from '@marketplace-web/core-api/api-client-util'
import { useTracking } from '@marketplace-web/observability/event-tracker-data'
import { stringToSha256 } from '@marketplace-web/crypto/crypto-util'
import { useSystemConfiguration } from '@marketplace-web/shared/system-configuration-data'
import {
  authenticateSuccessEvent,
  userRegisterFailEvent,
  userRegisterSuccessEvent,
  RegisterUserResponse,
} from '@marketplace-web/registration/registration-data'
import {
  GoogleTagManagerEvent,
  useGoogleTagManagerTrack,
} from '@marketplace-web/google-track/google-track-feature'

type RegistrationResponse = ResponseError<any> | Response<RegisterUserResponse>

type AuthType = Parameters<typeof userRegisterSuccessEvent>[0]['type']

type TrackRegistrationEventsArgs = {
  response: RegistrationResponse
  authType: AuthType
  email: string
}

const gtmTypeByAuthType: Record<AuthType, string> = {
  apple: 'apple',
  facebook: 'facebook',
  google: 'google',
  internal: 'email',
}

export const useRegistrationTracking = () => {
  const { track } = useTracking()
  const { googleTagManagerTrack } = useGoogleTagManagerTrack()
  const userCountry = useSystemConfiguration()?.userCountry

  return async ({ response, authType, email }: TrackRegistrationEventsArgs) => {
    const gtmAuthType = gtmTypeByAuthType[authType]

    if ('errors' in response) {
      track(userRegisterFailEvent({ type: authType, errors: response.errors }))

      return
    }

    const formattedEventId = await stringToSha256(response.user.id.toString())
    const event = {
      event_id: formattedEventId,
      auth_type: gtmAuthType,
      user_email: email,
    }
    googleTagManagerTrack(GoogleTagManagerEvent.Register, event)
    track(userRegisterSuccessEvent({ type: authType, userId: response.user.id }))
    track(
      authenticateSuccessEvent({ type: authType, userId: response.user.id, country: userCountry }),
    )
  }
}
