import { Icon } from '@vinted/web-ui'
import {
  CancelCircleFilled24,
  CheckCircleFilled24,
  CheckmarkShield24,
  InfoCircleFilled24,
  WarningCircleFilled24,
  InfoCircleFilled64,
  ExclamationCircleFilled64,
  CheckCircleFilled64,
  CancelCircleFilled64,
  CheckmarkShieldFilled64,
} from '@vinted/monochrome-icons'

import { InfoBannerLevel } from '@marketplace-web/info-banner/info-banner-data'

export const levelIcon24Map: Record<InfoBannerLevel, React.ComponentProps<typeof Icon>['name']> = {
  [InfoBannerLevel.Info]: InfoCircleFilled24,
  [InfoBannerLevel.Warning]: WarningCircleFilled24,
  [InfoBannerLevel.Danger]: WarningCircleFilled24,
  [InfoBannerLevel.Success]: CheckCircleFilled24,
  [InfoBannerLevel.Error]: CancelCircleFilled24,
  [InfoBannerLevel.Trust]: CheckmarkShield24,
}

export const levelIcon64Map: Record<InfoBannerLevel, React.ComponentProps<typeof Icon>['name']> = {
  [InfoBannerLevel.Info]: InfoCircleFilled64,
  [InfoBannerLevel.Warning]: ExclamationCircleFilled64,
  [InfoBannerLevel.Danger]: ExclamationCircleFilled64,
  [InfoBannerLevel.Success]: CheckCircleFilled64,
  [InfoBannerLevel.Error]: CancelCircleFilled64,
  [InfoBannerLevel.Trust]: CheckmarkShieldFilled64,
}

export const levelColorMap: Record<InfoBannerLevel, React.ComponentProps<typeof Icon>['color']> = {
  [InfoBannerLevel.Info]: 'primary-default',
  [InfoBannerLevel.Warning]: 'expose-default',
  [InfoBannerLevel.Danger]: 'warning-default',
  [InfoBannerLevel.Success]: 'success-default',
  [InfoBannerLevel.Error]: 'warning-default',
  [InfoBannerLevel.Trust]: 'primary-default',
}
