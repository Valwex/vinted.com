import { ReactNode } from 'react'
import { isNumber } from 'lodash'

type Props = {
  ratio?: number | string
  children?: ReactNode
}

const proportionToFraction = (proportion: string) => {
  const [width, height] = proportion.split(':').map(value => parseInt(value, 10))

  return width! / height!
}

const AspectRatio = ({ ratio = 1, children }: Props) => {
  const fraction = isNumber(ratio) ? ratio : proportionToFraction(ratio)
  const paddingTop = fraction === 0 ? 100 : 100 / fraction

  return (
    <div className="aspect-ratio">
      <div className="aspect-ratio__ratio" style={{ paddingTop: `${paddingTop}%` }}>
        <div className="aspect-ratio__content">{children}</div>
      </div>
    </div>
  )
}

export default AspectRatio
