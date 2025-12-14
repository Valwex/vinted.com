import { Spacer } from '@vinted/web-ui'

type Size = keyof typeof Spacer.Size

type DynamicSpacerProps = {
  phones: Size
  tabletsUp: Size
}

const DynamicSpacer = ({ phones, tabletsUp }: DynamicSpacerProps) => {
  return (
    <>
      <div className="u-phones-only">
        <Spacer size={Spacer.Size[phones]} />
      </div>
      <div className="u-tablets-up-only">
        <Spacer size={Spacer.Size[tabletsUp]} />
      </div>
    </>
  )
}

export default DynamicSpacer
