'use client'

import Script from 'next/script'

const Confiant = () => {
  return (
    <Script
      id="confiant-script"
      data-testid="confiant-script"
      src="https://cdn.confiant-integrations.net/BvGg6QCjGuFUb4-LOhdNdnITfpg/gpt_and_prebid/config.js"
      strategy="lazyOnload"
    />
  )
}

export default Confiant
