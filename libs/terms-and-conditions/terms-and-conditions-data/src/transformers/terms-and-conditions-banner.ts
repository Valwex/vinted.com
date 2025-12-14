import { TermsAndConditionsBannerDto } from '../types/dto/terms-and-conditions-banner'
import { TermsAndConditionsBannerModel } from '../types/model/terms-and-conditions-banner'

export const transformTermsAndConditionsBanner = ({
  title,
  subtitle,
  button_title,
}: TermsAndConditionsBannerDto): TermsAndConditionsBannerModel => ({
  title,
  subtitle,
  buttonTitle: button_title,
})
