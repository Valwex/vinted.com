'use client'

import { List, Text } from '@vinted/web-ui'

type Props = {
  noteText?: string
}

const FeeNote = ({ noteText }: Props) => {
  if (!noteText) return null

  return (
    <List.Item>
      <div className="u-padding-bottom-small">
        <Text as="div" text={noteText} type="subtitle" theme="muted" />
      </div>
    </List.Item>
  )
}

export default FeeNote
