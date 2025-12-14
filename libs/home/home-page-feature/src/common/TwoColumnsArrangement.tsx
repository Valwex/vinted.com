import { ReactNode } from 'react'

type Props = {
  children: ReactNode
  prefix?: ReactNode
  suffix?: ReactNode | false
  as?: 'section' | 'div'
}

const TwoColumnsArrangement = ({ children, prefix, suffix, as: Component = 'section' }: Props) => {
  return (
    <Component
      data-testid="homepage-block"
      className="homepage-blocks__item homepage-blocks__item--two-fifths"
    >
      {prefix}
      {children}
      {suffix}
    </Component>
  )
}

export default TwoColumnsArrangement
