'use client'

import { MouseEvent, ReactNode } from 'react'
import { Cell, Icon } from '@vinted/web-ui'

type Props = {
  title: string
  icon: React.ComponentProps<typeof Icon>['name']
  url?: string
  suffix?: ReactNode
  onClick?: (event: MouseEvent) => void
  testId?: string
}

const AccountLinkWithIcon = ({ title, url, suffix, onClick, testId, icon }: Props) => (
  <Cell
    styling="default"
    prefix={<Icon name={icon} color="greyscale-level-2" />}
    title={title}
    theme="transparent"
    url={url}
    onClick={onClick}
    suffix={suffix}
    testId={testId}
  />
)

export default AccountLinkWithIcon
