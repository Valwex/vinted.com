'use client'

import { MouseEvent, ReactNode } from 'react'
import { Cell, Text } from '@vinted/web-ui'

type Props = {
  title: string
  url?: string
  suffix?: ReactNode
  onClick?: (event: MouseEvent) => void
  testId?: string
}

const AccountLink = ({ title, url, suffix, onClick, testId }: Props) => (
  <Cell
    testId={testId}
    type="navigating"
    body={<Text as="span" text={title} />}
    url={url}
    onClick={onClick}
    suffix={suffix}
  />
)

export default AccountLink
