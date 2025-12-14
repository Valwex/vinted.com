import { Text } from '@vinted/web-ui'

const DefaultText = ({ text }: { text: string }) => (
  <Text text={<span>{text}</span>} as="h1" type="heading" theme="muted" />
)

export default DefaultText
