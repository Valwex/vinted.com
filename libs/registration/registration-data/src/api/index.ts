import { api } from '@marketplace-web/core-api/core-api-client-util'

import { urlWithParams } from '@marketplace-web/browser/url-util'

import { GenerateUsernameSuggestionResp } from '../types/username-suggestion'
import { ValidateUserArgs } from '../types/validate-user'

export const getUsernameSuggestion = (fullname: string, methods?: Array<string>) => {
  let url = '/users/generate_username'

  if (methods && methods.length > 0) {
    url = urlWithParams(url, {
      methods,
      limit: methods?.length,
    })
  }

  return api.post<GenerateUsernameSuggestionResp>(url, {
    fullname,
  })
}

export const validateUser = ({ user }: ValidateUserArgs) => api.post('/users/validations', { user })
