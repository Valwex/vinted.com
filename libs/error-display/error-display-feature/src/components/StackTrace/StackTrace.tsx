import { Spacer, Text } from '@vinted/web-ui'
import { ErrorInfo } from 'react'

type Props = {
  error: Error & { digest?: string }
  errorInfo?: ErrorInfo | null
}

const getTrace = (error: Error & { digest?: string }, errorInfo?: ErrorInfo | null) => {
  if (errorInfo) return errorInfo.componentStack
  if (error.toString() !== error.stack) return error.stack

  return error.digest
}

const StackTrace = ({ error, errorInfo }: Props) => {
  const trace = getTrace(error, errorInfo)

  return (
    <>
      <Text as="h3" type="subtitle" theme="inherit" width="parent">
        {error.toString()}
      </Text>
      {trace && (
        <>
          <Spacer />
          <details>
            <summary>Stack Trace</summary>
            <Text as="h4" type="caption" theme="inherit">
              {trace}
            </Text>
          </details>
        </>
      )}
    </>
  )
}

export default StackTrace
