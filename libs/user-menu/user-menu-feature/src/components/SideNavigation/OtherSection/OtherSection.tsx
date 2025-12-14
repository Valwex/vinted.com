import Discover from './Discover'
import Company from './Company'
import Policies from './Policies'
import Privacy from './Privacy'

type Props = {
  impressumUrl: string | null
  isBusinessAccountLinksVisible: boolean
}

const OtherSection = ({ impressumUrl, isBusinessAccountLinksVisible }: Props) => {
  return (
    <>
      <Discover isBusinessAccountLinksVisible={isBusinessAccountLinksVisible} />
      <Company />
      <Policies
        impressumUrl={impressumUrl}
        isBusinessAccountLinksVisible={isBusinessAccountLinksVisible}
      />
      <Privacy />
    </>
  )
}

export default OtherSection
