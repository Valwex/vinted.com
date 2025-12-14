'use client'

import { usePathname } from 'next/navigation'

import { getIsInCatalog } from '@marketplace-web/catalog/catalog-data'

import SearchBar from '../SearchBar'

function useIsInCatalog(): boolean {
  const pathname = usePathname()

  return getIsInCatalog(pathname ?? '')
}

const ClientSearchBar = (props: Pick<React.ComponentProps<typeof SearchBar>, 'catalogTree'>) => {
  return <SearchBar {...props} isInCatalog={useIsInCatalog()} />
}

export default ClientSearchBar
