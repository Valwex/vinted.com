import {
  EprBannerDto,
  EprBannerModel,
  EprCategoryDto,
  EprCategoryModel,
  EprCountryDto,
  EprCountryModel,
  EprUinDto,
  EprUinItemDto,
  EprUinItemModel,
  EprUinModel,
} from '../types/epr'

const transformEprCategoryDto = (eprCategoryDto: EprCategoryDto): EprCategoryModel => ({
  id: eprCategoryDto.id,
  title: eprCategoryDto.title,
  examples: eprCategoryDto.examples,
})

export const transformCategoriesDto = (
  eprCategoriesDto: Array<EprCategoryDto>,
): Array<EprCategoryModel> => eprCategoriesDto.map(transformEprCategoryDto)

export const transformEprCountryDto = (eprCountryDto: EprCountryDto): EprCountryModel => ({
  code: eprCountryDto.code,
  title_local: eprCountryDto.title_local,
})

export const transformCountriesDto = (eprCountriesDto: {
  allowed_countries: Array<EprCountryDto>
}): Array<EprCountryModel> => eprCountriesDto.allowed_countries.map(transformEprCountryDto)

export const transformEprUinItemDto = (eprUinItemDto: EprUinItemDto): EprUinItemModel => ({
  id: eprUinItemDto.id,
  uin: eprUinItemDto.uin,
  category: eprUinItemDto.category,
  category_title: eprUinItemDto.category_title,
})

export const transformEprUinDto = (eprUinDto: EprUinDto): EprUinModel => ({
  country_code: eprUinDto.country_code,
  country_title: eprUinDto.country_title,
  items: eprUinDto.items.map(transformEprUinItemDto),
  all_categories_submitted: eprUinDto.all_categories_submitted,
})

export const transformEprUinListDto = (eprUinListDto: {
  epr_uins: Array<EprUinDto>
}): Array<EprUinModel> => eprUinListDto.epr_uins.map(transformEprUinDto)

export const transformEprBanner = ({
  name,
  title,
  body,
  add_uin_button_label,
  add_uin_button_url,
  learn_more_button_label,
  learn_more_button_url,
}: EprBannerDto): EprBannerModel => ({
  name,
  title,
  body,
  addUinButtonLabel: add_uin_button_label,
  addUinButtonUrl: add_uin_button_url,
  learnMoreButtonLabel: learn_more_button_label,
  learnMoreButtonUrl: learn_more_button_url,
})
