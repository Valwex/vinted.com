'use client'

import { Image } from '@vinted/web-ui'
import { MouseEvent } from 'react'
import { useInView } from 'react-intersection-observer'

import { useTranslate } from '@marketplace-web/i18n/i18n-feature'
import { getTestId } from '@marketplace-web/vendor-abstractions/web-ui-util'
import { AspectRatio } from '@marketplace-web/common-components/aspect-ratio-ui'

type Props = {
  image?: string
  color?: string
  url: string | null | undefined
  alt?: string
  impressionUrl?: string | null
  testId?: string
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void
  onEnter?: () => void
}

// TODO: replace `AspectRatio` with the `aspect-ratio` CSS property once we drop iOS 14 support
const PromoBox = ({ image, color, url, alt, impressionUrl, testId, onClick, onEnter }: Props) => {
  const translate = useTranslate()
  const defaultImageAlt = translate('common.a11y.alt.promo_box')

  const { ref } = useInView({
    onChange: inView => {
      if (!inView) return
      onEnter?.()
    },
  })

  return (
    <a
      href={url || undefined}
      className="promo-box__container"
      data-testid={getTestId(testId, 'promo-box')}
      onClick={onClick}
      ref={ref}
    >
      <AspectRatio ratio="1:2">
        <Image role="img" src={image} color={color} alt={alt || defaultImageAlt} scaling="cover" />
      </AspectRatio>
      {impressionUrl && (
        <img
          height="1"
          width="1"
          alt=""
          style={{ display: 'none', border: 0 }}
          src={impressionUrl}
        />
      )}
    </a>
  )
}

export default PromoBox
