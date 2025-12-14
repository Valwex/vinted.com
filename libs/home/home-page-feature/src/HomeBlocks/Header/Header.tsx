import BlockTitle from '../../common/BlockTitle'
import DynamicSpacer from '../../common/DynamicSpacer'

type Props = {
  title: string
}

const Header = (props: Props) => {
  return (
    <div className="homepage-blocks__item">
      <BlockTitle title={props.title} />
      <DynamicSpacer phones="Regular" tabletsUp="Large" />
    </div>
  )
}

export default Header
