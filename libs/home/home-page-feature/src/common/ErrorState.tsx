'use client'

import { Animation, Button, EmptyState, Text } from '@vinted/web-ui'

import { useTranslate } from '@marketplace-web/i18n/i18n-feature'
import { useAsset } from '@marketplace-web/shared/assets'

import { CATALOG_URL } from '../constants/routes'

const ErrorState = () => {
  const translate = useTranslate()
  const asset = useAsset('/assets/animations')

  return (
    <EmptyState
      animation={<Animation animationUrl={asset('closet-empty-state.json')} />}
      title={translate('homepage.error.title')}
      body={
        <Text
          text={translate('homepage.error.body')}
          width="parent"
          alignment="center"
          type="title"
          as="p"
        />
      }
      action={
        <Button text={translate('homepage.error.cta')} url={CATALOG_URL} styling="filled" inline />
      }
    />
  )
}

export default ErrorState
