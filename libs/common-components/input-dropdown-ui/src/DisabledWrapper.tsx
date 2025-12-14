import { ReactNode } from 'react'

type Props = {
  isDisabled: boolean
  children: ReactNode
}

const DisabledWrapper = ({ isDisabled, children }: Props) => {
  if (!isDisabled) return children

  return <div className="c-input__wrapper--disabled">{children}</div>
}

export default DisabledWrapper
