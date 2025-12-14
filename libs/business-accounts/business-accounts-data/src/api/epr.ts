import { api } from '@marketplace-web/core-api/core-api-client-util'

import {
  EprCategoriesResp,
  EprCountriesResp,
  EprInfoDto,
  EprUinListResp,
  UpdateEprUinArgs,
} from '../types/epr'

export const addEprInfo = (eprInfo: EprInfoDto) => api.post('/business_accounts/epr_uins', eprInfo)

export const deleteEprUin = (uinId: number | string) =>
  api.delete(`/business_accounts/epr_uins/${uinId}`)

export const getEprCategories = () =>
  api.get<EprCategoriesResp>('/business_accounts/epr_uins/categories')

export const getEprCountries = () =>
  api.get<EprCountriesResp>('/business_accounts/epr_uins/allowed_countries')

export const getEprUinList = () => api.get<EprUinListResp>('/business_accounts/epr_uins')

export const updateEprUin = ({ uinId, uinNumber }: UpdateEprUinArgs) =>
  api.put(`/business_accounts/epr_uins/${uinId}`, {
    epr_uin: {
      uin: uinNumber,
    },
  })
