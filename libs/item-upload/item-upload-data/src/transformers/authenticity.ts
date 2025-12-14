import {
  ItemAuthenticityModalDto,
  ItemAuthenticityModalModel,
  ItemAuthenticityModalPhotoTipDto,
  ItemAuthenticityModalPhotoTipModel,
} from '../types/authenticity'

export const transformItemAuthenticityModalPhotoTipsDto = ({
  image_url,
  text,
}: ItemAuthenticityModalPhotoTipDto): ItemAuthenticityModalPhotoTipModel => ({
  imageUrl: image_url,
  text,
})

export const transformItemAuthenticityModalDto = ({
  title,
  subtitle,
  note,
  cta,
  cta_url,
  essential_tips,
  additional_tips,
}: ItemAuthenticityModalDto): ItemAuthenticityModalModel => ({
  title,
  subtitle,
  note,
  cta,
  ctaUrl: cta_url,
  essentialTips: essential_tips?.map(transformItemAuthenticityModalPhotoTipsDto),
  additionalTips: additional_tips?.map(transformItemAuthenticityModalPhotoTipsDto),
})
