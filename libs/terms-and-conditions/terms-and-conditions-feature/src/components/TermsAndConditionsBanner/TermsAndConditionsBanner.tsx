'use client'

import { Button, Text } from '@vinted/web-ui'

import { Banner } from '@marketplace-web/common-components/banner-ui'
import { TermsAndConditionsBannerModel } from '@marketplace-web/terms-and-conditions/terms-and-conditions-data'

import { useBreakpoint } from '@marketplace-web/breakpoints/breakpoints-feature'

import { TERMS_URL } from '../../constants/routes'

type Props = {
  banner: Pick<TermsAndConditionsBannerModel, 'title' | 'subtitle' | 'buttonTitle'>
}

const TermsAndConditionsBanner = ({ banner }: Props) => {
  const breakpoints = useBreakpoint()

  return (
    <Banner
      isPhone={breakpoints.phones}
      title={<Text text={banner.title} type="heading" theme="warning" as="h2" />}
      body={<Text as="span" text={banner.subtitle} html />}
      actions={[<Button text={banner.buttonTitle} url={TERMS_URL} styling="filled" />]}
    />
  )
}

export default TermsAndConditionsBanner
