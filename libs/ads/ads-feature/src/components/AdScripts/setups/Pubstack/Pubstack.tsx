'use client'

import Script from 'next/script'

const PUBSTACK_KEY = '67661136-7e02-42c4-9da1-8ab1f222b7fc'

const Pubstack = () => {
  return (
    <Script
      id="pubstack-script"
      data-testid="pubstack-script"
      src={`https://boot.pbstck.com/v1/tag/${PUBSTACK_KEY}`}
      strategy="lazyOnload"
    />
  )
}

export default Pubstack
