import { IvsGuidelineBannerDto, IvsGuidelineBannerModel } from '../types/ivs-guideline-banner'

export const transformIvsGuidelineBanner = ({
  name,
  title,
  body,
  action_title,
  additional_information,
}: IvsGuidelineBannerDto): IvsGuidelineBannerModel => ({
  name,
  title,
  body,
  actionTitle: action_title,
  additionalInformation: {
    title: additional_information.title,
    actions: additional_information.actions,
    sections: additional_information.sections.map(section => ({
      title: section.title,
      body: section.body,
      imageUrl: section.image_url,
    })),
  },
})
