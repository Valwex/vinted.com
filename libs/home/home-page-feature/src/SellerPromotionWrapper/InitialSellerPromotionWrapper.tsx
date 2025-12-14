'use client'

import { useSearchParams } from 'next/navigation'
import { PropsWithChildren } from 'react'

const InitialSellerPromotionWrapper = ({ children }: PropsWithChildren<unknown>) => {
  const searchParams = useSearchParams()

  // From Next.js docs: If an application includes the /pages directory, useSearchParams will return ReadonlyURLSearchParams | null
  // TODO: remove optional chaining once /pages directory is removed
  if (searchParams?.get('tab') && searchParams?.get('tab') !== 'all') return null

  return children
}

export default InitialSellerPromotionWrapper
