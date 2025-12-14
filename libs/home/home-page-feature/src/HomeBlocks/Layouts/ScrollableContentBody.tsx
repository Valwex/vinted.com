'use client'

import { ReactNode } from 'react'

import { HorizontalScrollArea } from '@marketplace-web/common-components/horizontal-scroll-area-ui'
import { useTranslate } from '@marketplace-web/i18n/i18n-feature'

type Props = {
  children: ReactNode
  className: string
}

const ScrollableContentBody = ({ children, className }: Props) => {
  const translateA11y = useTranslate('a11y')

  return (
    <HorizontalScrollArea
      controlsScrollType={HorizontalScrollArea.ControlScrollType.Partial}
      arrowLeftText={translateA11y('actions.move_left')}
      arrowRightText={translateA11y('actions.move_right')}
    >
      <div className={className}>{children}</div>
    </HorizontalScrollArea>
  )
}

export default ScrollableContentBody
