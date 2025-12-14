import { ReactNode } from 'react'

type Props = {
  isScrollable: boolean | undefined
  children: ReactNode
}

const WrappedContent = ({ isScrollable, children }: Props) => {
  if (isScrollable) {
    return (
      <div className="input-dropdown__content input-dropdown__content--scrollable">
        <div>{children}</div>
      </div>
    )
  }

  return <div className="input-dropdown__content">{children}</div>
}

export default WrappedContent
