import { Response } from '@marketplace-web/core-api/api-client-util'

import {
  TwoFaDetailsDto,
  TwoFaDetailsModel,
  TwoFactorVerificationDto,
  TwoFactorVerificationModel,
  SendEmailVerificationCodeResp,
  EmailVerificationCodeModel,
  VerificationPromptModel,
  VerificationPromptDto,
  PhonePrefixDataDto,
  PhonePrefixDataModel,
  PhonePrefixDataResp,
} from '../types/verification'

export const transformTwoFactorVerification = (
  payload: TwoFactorVerificationDto,
): TwoFactorVerificationModel => ({
  id: payload.id,
  askUser2fa: payload.ask_user_2fa,
  showResendOption: payload.show_resend_option,
  userMaskedPhoneNumber: payload.masked_phone_number,
  userMaskedInfo: payload.user_masked_info,
  nextResendAvailableIn: payload.next_resend_available_in,
  channel: payload.type,
})

export const transformTwoFaDetails = ({
  id,
  next_resend_available_in,
  show_resend_option,
  user_masked_info,
  type,
}: TwoFaDetailsDto): TwoFaDetailsModel => ({
  controlCode: id,
  nextResendAvailableIn: next_resend_available_in,
  showResendOption: show_resend_option,
  userMaskedInfo: user_masked_info,
  channel: type,
})

export const transformEmailVerificationCodeResponse = (
  response: Response<SendEmailVerificationCodeResp>,
): EmailVerificationCodeModel => ({
  email: response.email,
  canChangeEmail: response.can_change_email ?? true,
})

export const transformVerificationPromptDto = (
  verificationDto: VerificationPromptDto,
): VerificationPromptModel => ({
  id: verificationDto.id,
  mandatory: verificationDto.mandatory,
  methods: verificationDto.methods,
  category: verificationDto.category,
  actions: verificationDto.actions,
  imageUrls: verificationDto.image_urls,
  translations: {
    header: verificationDto.translations.header,
    body: verificationDto.translations.body,
  },
  trigger: verificationDto.trigger,
})

export const transformPhonePrefixData = (payload: PhonePrefixDataDto): PhonePrefixDataModel => ({
  countryCode: payload.country_code,
  prefix: payload.prefix,
  title: payload.title,
})

export const transformPhonePrefixDataResponse = (
  payload: PhonePrefixDataResp,
): Array<PhonePrefixDataModel> => payload.prefixes.map(transformPhonePrefixData)
