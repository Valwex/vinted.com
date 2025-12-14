'use client'

import { Text, List } from '@vinted/web-ui'

type Props = {
  discountNote?: string | null
}

const DiscountNote = ({ discountNote }: Props) => {
  if (!discountNote) return null

  return (
    <List.Item>
      <span data-testid="discount-note">
        <Text as="div" theme="muted" type="subtitle" text={discountNote} />
      </span>
    </List.Item>
  )
}

export default DiscountNote
