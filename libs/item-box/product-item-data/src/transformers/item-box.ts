import { ItemBoxModel, ItemBoxDto } from '../types/item-box'

export const transformItemBoxDto = (itemBox: ItemBoxDto): ItemBoxModel => ({
  firstLine: itemBox.first_line,
  secondLine: itemBox.second_line,
  exposure: itemBox.exposure,
  exposures: itemBox.exposures,
  accessibilityLabel: itemBox.accessibility_label,
  badge: itemBox.badge && {
    title: itemBox.badge.title,
    icon: itemBox.badge.icon,
    iconColor: itemBox.badge.icon_color,
    amplifiedText: itemBox.badge.amplified_text || false,
  },
  actions:
    itemBox.actions &&
    itemBox.actions.map(action => ({
      title: action.title,
      url: action.url,
      name: action.name,
    })),
  itemId: itemBox.item_id,
})
