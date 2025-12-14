import { api } from '@marketplace-web/core-api/core-api-client-util'
import { ApiResponse } from '@marketplace-web/core-api/api-client-util'

import {
  TaxpayerFormConfigurationResp,
  TaxpayerFormStatusResp,
  GetTaxpayerNavigationInfoResp,
  UpdateTaxpayerFormDataArgs,
  ValidateTaxpayerFormArgs,
} from '../types/form'
import { updateTaxpayerFormDataArgsToParams } from '../transformers'

export const getTaxpayerFormConfiguration = (countryCode: string) =>
  api.get<TaxpayerFormConfigurationResp>(`/taxpayers/form/${countryCode}`)

export const getTaxpayerFormStatus = () => api.get<TaxpayerFormStatusResp>('/taxpayers/form/status')

export const getTaxpayerNavigationInfo = () =>
  api.get<GetTaxpayerNavigationInfoResp>('/taxpayers/navigation')

export const updateTaxpayerFormData = (args: UpdateTaxpayerFormDataArgs) =>
  api.put<ApiResponse>('/taxpayers/form', updateTaxpayerFormDataArgsToParams(args))

export const validateTaxpayerForm = (args: ValidateTaxpayerFormArgs) =>
  api.post('/taxpayers/form/validate', { taxpayer: args })
