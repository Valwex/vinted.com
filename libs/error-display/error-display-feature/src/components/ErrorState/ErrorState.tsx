'use client'

import { ReactNode } from 'react'
import { Button, EmptyState } from '@vinted/web-ui'

import { useTranslate } from '@marketplace-web/i18n/i18n-feature'

type Props = {
  title?: ReactNode
  body?: ReactNode
  ctaText?: ReactNode
  ctaLoading?: boolean
  onCtaClick?: () => void
}

const ErrorState = ({ title, body, ctaText, ctaLoading, onCtaClick }: Props) => {
  const translate = useTranslate('error_state')

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    if (ctaLoading) {
      event.preventDefault()

      return
    }

    onCtaClick?.()
  }

  const renderCta = () => {
    if (!onCtaClick) return undefined

    return (
      <Button
        isLoading={ctaLoading}
        text={ctaText || translate('cta')}
        styling="filled"
        onClick={handleClick}
      />
    )
  }

  return (
    <EmptyState
      title={title || translate('title')}
      body={body || translate('body')}
      action={renderCta()}
    />
  )
}

export default ErrorState
