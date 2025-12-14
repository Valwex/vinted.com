'use client'

import { MouseEvent, ReactNode } from 'react'
import { Cell, Text } from '@vinted/web-ui'

import { getTestId } from '@marketplace-web/vendor-abstractions/web-ui-util'

type Props = {
  content: ReactNode
  theme: React.ComponentProps<typeof Cell>['theme']
  /**
   * Adds data-testid attribute to parent and child components.
   * When used, --status and --status-text suffixes applied accordingly.
   */
  testId?: string
  suffix?: ReactNode
  /**
   * Experimental, needed to animate fade out for Favourites action
   * Sets additional classes on the modal content.
   */
  className?: string
  onClick?: () => void
}

const ItemBoxMessage = ({ theme, content, suffix, testId, className, onClick }: Props) => {
  const handleClick = (event: MouseEvent) => {
    if (!onClick) return

    event.preventDefault()
    event.stopPropagation()
    onClick()
  }

  return (
    <div className={className} data-testid={getTestId(testId, 'status')}>
      <Cell
        suffix={suffix}
        styling="narrow"
        theme={theme}
        clickable={!!onClick}
        onClick={handleClick}
      >
        <Text
          text={content}
          type="caption"
          theme="inverse"
          testId={getTestId(testId, 'status-text')}
          as="p"
        />
      </Cell>
    </div>
  )
}

export default ItemBoxMessage
