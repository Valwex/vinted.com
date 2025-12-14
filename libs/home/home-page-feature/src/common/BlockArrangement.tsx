import { ReactNode } from 'react'

import DynamicSpacer from './DynamicSpacer'

type Props = {
  children: ReactNode
  prefix?: ReactNode
  suffix?: ReactNode | false
  as?: 'section' | 'div'
}

const BlockArrangement = ({
  children,
  prefix,
  suffix = <DynamicSpacer phones="XLarge" tabletsUp="X3Large" />,
  as: Component = 'section',
}: Props) => {
  return (
    <Component data-testid="homepage-block" className="homepage-blocks__item">
      {prefix}
      {children}
      {suffix}
    </Component>
  )
}

export default BlockArrangement
