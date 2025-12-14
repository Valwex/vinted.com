import { Validation } from '@vinted/web-ui'

type Theme = React.ComponentProps<typeof Validation>['theme']

/** @deprecated Use <Validation text={message} theme={theme} /> instead */
export default function renderValidation(message: string | null, theme: Theme = 'warning') {
  if (!message) return null

  return <Validation text={message} theme={theme} />
}
