'use client'

import { MouseEvent, createContext, useContext, useState } from 'react'
import { Cell, Text } from '@vinted/web-ui'

export const LinkCellContext = createContext<{ boldHover?: boolean }>({})

type Props = {
  title: string
  url: string
  onClick?: (event: MouseEvent) => void
  testId?: string
}

const LinkCell = ({ title, url, onClick, testId }: Props) => {
  const { boldHover } = useContext(LinkCellContext)

  const [isHovering, setIsHovering] = useState(false)

  const handleMouseEnter = () => setIsHovering(true)
  const handleMouseLeave = () => setIsHovering(false)

  const shouldBold = isHovering && boldHover

  return (
    <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <Cell
        type="navigating"
        styling="narrow"
        url={url}
        onClick={onClick}
        body={
          <Text as="span" bold={shouldBold} theme={shouldBold ? 'amplified' : undefined}>
            {title}
          </Text>
        }
        testId={testId}
      />
    </div>
  )
}

export default LinkCell
