import { Fire12 } from '@vinted/monochrome-icons'

export function getIconName(icon?: string | null) {
  if (!icon) return undefined

  switch (icon) {
    case 'Fire12':
      return Fire12
    default:
      return undefined
  }
}
