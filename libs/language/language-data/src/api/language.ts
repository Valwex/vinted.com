import { api } from '@marketplace-web/core-api/core-api-client-util'

import {
  GetLanguagesResp,
  GetCountryLanguagesResp,
  UpdateUserLanguageArgs,
} from '../types/language'

export const getLanguages = () => api.get<GetLanguagesResp>('/languages')

export const getCountryLanguages = (countryId: number) =>
  api.get<GetCountryLanguagesResp>(`countries/${countryId}/languages`)

export const updateUserLanguage = ({ userId, locale }: UpdateUserLanguageArgs) =>
  api.put(`users/${userId}/language_settings/?locale=${locale}`)
