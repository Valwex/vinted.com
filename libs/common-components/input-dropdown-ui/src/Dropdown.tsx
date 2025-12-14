'use client'

import { Card } from '@vinted/web-ui'
import classNames from 'classnames'
import { FocusEvent, ReactNode } from 'react'

import { testIdAttribute } from './utils'

type Props = {
  isDirectionUp: boolean | undefined
  testId: string | undefined
  onBlur: ((event: FocusEvent) => void) | undefined
  children: ReactNode
}

const Dropdown = ({ isDirectionUp, testId, onBlur, children }: Props) => {
  const dropdownClass = classNames('input-dropdown', {
    'input-dropdown--direction-up': isDirectionUp,
  })

  return (
    <div className={dropdownClass} data-testid={testIdAttribute(testId, 'content')} onBlur={onBlur}>
      <Card styling="elevated">{children}</Card>
    </div>
  )
}

export default Dropdown
