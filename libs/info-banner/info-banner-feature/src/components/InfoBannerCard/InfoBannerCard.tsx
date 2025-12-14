'use client'

import { MouseEvent, isValidElement } from 'react'
import { Card, Cell, Icon, Text } from '@vinted/web-ui'

import { InfoBannerModel } from '@marketplace-web/info-banner/info-banner-data'

import { levelColorMap, levelIcon24Map } from '../../constants'

type Props = {
  disabled?: boolean
  banner: InfoBannerModel
  onBannerClick?: (event: MouseEvent) => void
  theme?: React.ComponentProps<typeof Cell>['theme']
}

const InfoBannerCard = ({ banner, onBannerClick, disabled = false, theme }: Props) => {
  if (!banner) return null

  return (
    <Card>
      <Cell
        disabled={disabled}
        onClick={onBannerClick}
        prefix={<Icon name={levelIcon24Map[banner.level]} color={levelColorMap[banner.level]} />}
        title={banner.title}
        theme={theme}
        body={<Text as="span" html={!isValidElement(banner.body)} text={banner.body} />}
      />
    </Card>
  )
}

export default InfoBannerCard
