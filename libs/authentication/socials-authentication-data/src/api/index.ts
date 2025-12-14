import { api } from '@marketplace-web/core-api/core-api-client-util'

import { GetGoogleIdTokenArgs, GetGoogleIdTokenResp } from '../types/google'

export const linkFacebook = (accessToken: string) =>
  api.post('facebook_user/link', {
    fb_access_token: accessToken,
  })

export const unlinkFacebook = () => api.delete('facebook_user')

export const linkGoogle = (idToken: string) =>
  api.post('google_user/link', {
    id_token: idToken,
  })

export const unlinkGoogle = () => api.delete('google_user')

export const getGoogleIdToken = ({
  code,
  state,
  action,
  isLocalRedirectEnabled,
}: GetGoogleIdTokenArgs) =>
  api.get<GetGoogleIdTokenResp>('/google_user/token', {
    params: {
      code,
      state,
      take_action: action,
      next_local_redirect: isLocalRedirectEnabled,
    },
  })
