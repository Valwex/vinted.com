'use client'

import MobileHeaderSearchBar from '../MobileHeaderSearchBar'

const ClientMobileSearchBar = (
  props: Pick<
    React.ComponentProps<typeof MobileHeaderSearchBar>,
    'catalogTree' | 'wrapperComponent'
  >,
) => <MobileHeaderSearchBar {...props} />

export default ClientMobileSearchBar
