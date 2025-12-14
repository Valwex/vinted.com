import { api } from '@marketplace-web/core-api/core-api-client-util'

import { TaxpayerEducationResp } from '../types/education'

export const getTaxpayerEducation = () => api.get<TaxpayerEducationResp>('/taxpayers/education')

export const getTaxpayersSpecialVerificationEducation = () =>
  api.get<TaxpayerEducationResp>('/taxpayers/special_verification/education')
