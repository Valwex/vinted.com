import { Spacer } from '@vinted/web-ui'

type Size = keyof typeof Spacer.Size

type Props =
  | {
      phones: Size
      tabletsUp?: Size
    }
  | {
      portables: Size
      desktops: Size
    }

const DynamicSpacer = (props: Props) => {
  if ('phones' in props) {
    return (
      <>
        <div className="u-phones-only">
          <Spacer size={Spacer.Size[props.phones]} />
        </div>
        {props.tabletsUp && (
          <div className="u-tablets-up-only">
            <Spacer size={Spacer.Size[props.tabletsUp]} />
          </div>
        )}
      </>
    )
  }

  return (
    <>
      <div className="u-mobiles-only">
        <Spacer size={Spacer.Size[props.portables]} />
      </div>
      <div className="u-desktops-only">
        <Spacer size={Spacer.Size[props.desktops]} />
      </div>
    </>
  )
}

DynamicSpacer.Size = Spacer.Size

export default DynamicSpacer
