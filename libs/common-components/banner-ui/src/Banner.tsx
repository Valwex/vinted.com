'use client'

import { Fragment, ReactComponentElement, ReactNode } from 'react'
import { Card, Cell, Button } from '@vinted/web-ui'
import { v4 as uuid } from 'uuid'

type Props = {
  title?: ReactNode
  body?: ReactNode
  prefix?: ReactNode
  actions?: Array<ReactComponentElement<typeof Button>>
  highlighted?: boolean
  children?: ReactNode
  isPhone: boolean | undefined
}

/** @deprecated use @vinted/web-ui InfoBanner component instead */
const Banner = ({ title, body, prefix, actions, highlighted, children, isPhone }: Props) => {
  const renderActions = () => {
    if (!actions?.length) return null

    return (
      <div className="banner-actions__container">
        {actions.map(action => (
          <Fragment key={uuid()}>{action}</Fragment>
        ))}
      </div>
    )
  }

  const renderBanner = () => {
    const suffix = renderActions()
    const content = children || body

    return (
      <Cell styling="tight" highlighted={highlighted}>
        <Cell prefix={prefix} suffix={isPhone ? null : suffix} highlighted={highlighted}>
          {title && <div>{title}</div>}
          {content && <div>{content}</div>}
        </Cell>
        {!!suffix && (
          <div className="u-phones-only u-ui-margin-horizontal-large u-ui-margin-bottom-large">
            {suffix}
          </div>
        )}
      </Cell>
    )
  }

  if (isPhone) {
    return renderBanner()
  }

  return (
    <div className="u-fill-width">
      <Card>
        <div className="u-overflow-hidden">{renderBanner()}</div>
      </Card>
    </div>
  )
}

export default Banner
