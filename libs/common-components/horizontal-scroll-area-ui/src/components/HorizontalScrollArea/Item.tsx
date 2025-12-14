import { ReactNode } from 'react'
import classNames from 'classnames'

type Props = {
  children: ReactNode
  className?: string
  testId?: string
  fitContent?: boolean
  ariaLabel?: string
}

const Item = ({ children, className, testId, fitContent = false, ariaLabel }: Props) => {
  const cssClasses = classNames('horizontal-scroll__item', className, {
    'horizontal-scroll__item--fit-content': fitContent,
  })

  return (
    <article className={cssClasses} data-testid={testId} aria-label={ariaLabel}>
      {children}
    </article>
  )
}

export default Item
