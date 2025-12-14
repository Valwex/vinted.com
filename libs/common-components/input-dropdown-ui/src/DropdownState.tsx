'use client'

import { ChevronDown16, ChevronUp16 } from '@vinted/monochrome-icons'
import { Icon } from '@vinted/web-ui'

import { testIdAttribute } from './utils'

type Props = {
  isOpen: boolean
  toggleDropdown: () => void
  testId: string | undefined
}

const DropdownState = ({ isOpen, toggleDropdown, testId }: Props) => (
  // TODO: fix this ignoring
  // eslint-disable-next-line jsx-a11y/interactive-supports-focus,jsx-a11y/click-events-have-key-events
  <div className="c-input__icon" role="button" onClick={toggleDropdown}>
    <Icon
      name={isOpen ? ChevronUp16 : ChevronDown16}
      testId={
        isOpen
          ? testIdAttribute(testId, 'chevron-up', true)
          : testIdAttribute(testId, 'chevron-down', true)
      }
      color="greyscale-level-2"
    />
  </div>
)

export default DropdownState
