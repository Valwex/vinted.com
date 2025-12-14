'use client'

import { Checkbox } from '@vinted/web-ui'

import { useProactiveModerationContext } from '../../context'

const PROACTIVE_MODERATION_MAX_ITEMS = 50

type Props = {
  itemId: number
}

const ProactiveModerationItemCheckbox = ({ itemId }: Props) => {
  const { isProactiveModerationEnabled, selectedItemIds, setSelectedItemIds } =
    useProactiveModerationContext()

  const isSelected = selectedItemIds?.includes(itemId)

  const handleItemCheckboxChange = () => {
    if (!selectedItemIds) return

    if (isSelected) {
      setSelectedItemIds(selectedItemIds.filter(id => id !== itemId))

      return
    }

    setSelectedItemIds([...selectedItemIds, itemId])
  }

  if (!isProactiveModerationEnabled) return null

  if (!selectedItemIds) return null

  return (
    <div className="u-position-absolute u-top u-right u-zindex-bump u-ui-padding-small">
      <Checkbox
        onChange={handleItemCheckboxChange}
        name={`proactive-moderation-item-checkbox-${itemId}`}
        checked={isSelected}
        disabled={!isSelected && selectedItemIds.length >= PROACTIVE_MODERATION_MAX_ITEMS}
        experimentalApplyBackground
      />
    </div>
  )
}

export default ProactiveModerationItemCheckbox
