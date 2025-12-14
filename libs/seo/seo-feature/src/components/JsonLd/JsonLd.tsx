'use client'

import type { Thing } from 'schema-dts'

type Props = {
  jsonLd: Thing
}

const JsonLd = ({ jsonLd }: Props) => {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(Object.assign(jsonLd, { '@context': 'https://schema.org' })),
      }}
    />
  )
}

export default JsonLd
