'use client'

import { ReactNode } from 'react'
import { Cell, Text } from '@vinted/web-ui'
import { InView } from 'react-intersection-observer'

import { HorizontalScrollArea } from '@marketplace-web/common-components/horizontal-scroll-area-ui'

type Props = {
  url?: string
  onClick?: () => void
  onEnter?: () => void
  content: ReactNode
  testId?: string
}

const CtaItem = ({ url, onClick, onEnter, content, testId }: Props) => {
  const renderCell = () => (
    <div className="horizontally-scrollable-items__cta-content">
      <Cell url={url} onClick={onClick} type="navigating" theme="transparent" testId={testId}>
        <Text as="h2" type="title" theme="muted" alignment="center" width="parent" text={content} />
      </Cell>
    </div>
  )

  const handleChange = (inView: boolean) => inView && onEnter?.()

  return (
    <HorizontalScrollArea.Item className="horizontally-scrollable-items__item">
      {onEnter ? (
        <InView className="u-fill-height" onChange={handleChange}>
          {renderCell()}
        </InView>
      ) : (
        renderCell()
      )}
    </HorizontalScrollArea.Item>
  )
}

export default CtaItem
