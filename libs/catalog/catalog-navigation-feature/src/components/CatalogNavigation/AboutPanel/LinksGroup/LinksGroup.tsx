import { ReactNode } from 'react'
import { Label, Spacer } from '@vinted/web-ui'

type Props = {
  title: string
  children: ReactNode
}

const LinksGroup = ({ title, children }: Props) => (
  <>
    <Label text={title} type="stacked" styling="narrow" />
    <Spacer />
    <div>{children}</div>
  </>
)

export default LinksGroup
