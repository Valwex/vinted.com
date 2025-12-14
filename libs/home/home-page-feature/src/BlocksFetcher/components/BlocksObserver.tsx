'use client'

import { InView } from 'react-intersection-observer'

type Props = {
  onPageEnd(): void
}

const BlocksObserver = ({ onPageEnd }: Props) => {
  const handleChange = (inView: boolean) => {
    if (!inView) return
    onPageEnd()
  }

  return (
    <InView rootMargin="0px 0px 1000px 0px" onChange={handleChange} data-testid="blocks-observer" />
  )
}

export default BlocksObserver
