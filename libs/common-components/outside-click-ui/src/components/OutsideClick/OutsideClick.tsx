'use client'

import { ReactNode, useRef } from 'react'
import { useEventListener } from 'usehooks-ts'

type Props = {
  onOutsideClick: (event: MouseEvent) => void
  isDisabled?: boolean
  children: ReactNode
  className?: string
}

const OutsideClick = ({ onOutsideClick, isDisabled = false, children, className }: Props) => {
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEventListener('mousedown', (event: MouseEvent) => {
    const { current: node } = wrapperRef

    if (!node || isDisabled) return
    if (event.target instanceof Node && node.contains(event.target)) return

    onOutsideClick(event)
  })

  return (
    <div ref={wrapperRef} className={className}>
      {children}
    </div>
  )
}

export default OutsideClick
