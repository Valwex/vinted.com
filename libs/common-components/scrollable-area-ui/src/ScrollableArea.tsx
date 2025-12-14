import { ReactNode } from 'react'
import classNames from 'classnames'

type Props = {
  children?: ReactNode
  maxWidth?: number | string
  maxHeight?: number | string
  className?: string
}

const ScrollableArea = ({ children, maxWidth, maxHeight, className }: Props) => {
  if (!children) return null

  const classes = classNames('u-overflow-auto', className)

  return (
    <div className={classes} style={{ maxWidth, maxHeight }}>
      {children}
    </div>
  )
}

export default ScrollableArea
