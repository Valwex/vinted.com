'use client'

import { Cell, Text } from '@vinted/web-ui'

type Props = {
  title: string
  url: string
  onClick?: (MouseEvent) => void
}

const OtherLink = ({ title, url, onClick }: Props) => (
  <Cell
    type="navigating"
    body={<Text as="span" text={title} truncate />}
    url={url}
    urlProps={{ title }}
    onClick={onClick}
  />
)

export default OtherLink
