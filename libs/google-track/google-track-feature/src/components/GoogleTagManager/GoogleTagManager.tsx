'use client'

import Script from 'next/script'
import { useIsClient } from 'usehooks-ts'

import { GTM_ID } from '../../constants'

// TODO: revisit this when routing from next, might need to manually trigger events
const GoogleTagManager = () => {
  const isClientSideRenderReady = useIsClient()

  if (!isClientSideRenderReady) return null

  return (
    <>
      <noscript>
        <iframe
          title="gtag-iframe"
          src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
          height="0"
          width="0"
          style={{ display: 'none', visibility: 'hidden' }}
        />
      </noscript>
      <Script
        id="gtag-base"
        data-testid="gtag-base"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer', '${GTM_ID}');
          `,
        }}
      />
    </>
  )
}

export default GoogleTagManager
