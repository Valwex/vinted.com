import { Cell } from '@vinted/web-ui'

import type { FallbackComponentProps } from '@marketplace-web/error-display/error-display-util'

import StackTrace from '../StackTrace'

const ComponentError = ({ error, errorInfo }: FallbackComponentProps) => {
  if (!error) return null

  return (
    <div className="u-fill-width u-fill-height u-flexbox">
      <Cell theme="muted" title="Component Error">
        <div className="u-overflow-hidden">
          <StackTrace error={error} errorInfo={errorInfo} />
        </div>
      </Cell>
    </div>
  )
}

export default ComponentError
