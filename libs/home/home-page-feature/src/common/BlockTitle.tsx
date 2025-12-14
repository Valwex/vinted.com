import { Text } from '@vinted/web-ui'

type Props = {
  title: string
  width?: keyof typeof Text.Width
}

const BlockTitle = ({ title, width }: Props) => {
  return <Text type="heading" text={title} as="h2" width={width ? Text.Width[width] : undefined} />
}

export default BlockTitle
