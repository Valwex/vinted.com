import { api } from '@marketplace-web/core-api/core-api-client-util'

import {
  GetTaxpayersSpecialVerificationDeadlineResp,
  GetTaxpayersSpecialVerificationFormConfigurationResp,
  SubmitTaxpayersSpecialVerificationFormArgs,
  ValidateSpecialVerificationFormArgs,
} from '../types/verification'
import { submitTaxpayersSpecialVerificationFormArgsToParams } from '../transformers'

export const getTaxpayersSpecialVerificationDeadline = () =>
  api.get<GetTaxpayersSpecialVerificationDeadlineResp>('/taxpayers/special_verification/deadline')

export const getTaxpayersSpecialVerificationFormConfiguration = () =>
  api.get<GetTaxpayersSpecialVerificationFormConfigurationResp>(
    '/taxpayers/special_verification/configuration',
  )

export const submitTaxpayersSpecialVerificationForm = (
  args: SubmitTaxpayersSpecialVerificationFormArgs,
) =>
  api.post(
    '/taxpayers/special_verification',
    submitTaxpayersSpecialVerificationFormArgsToParams(args),
    {
      headers: args.x_thumbprint ? { 'X-Thumbprint': args.x_thumbprint } : {},
    },
  )

export const validateTaxpayersSpecialVerificationFormFields = (
  args: ValidateSpecialVerificationFormArgs,
) =>
  api.post('/taxpayers/special_verification/validation', {
    fields: args,
  })
