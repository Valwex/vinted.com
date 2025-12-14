'use client'

import { Cell, Icon, Text } from '@vinted/web-ui'

import { useTranslate } from '@marketplace-web/i18n/i18n-feature'

type Props = {
  translationId: string
  iconName: React.ComponentProps<typeof Icon>['name'] | null
  translationValue?: Record<string, any>
  translationsPrefix:
    | 'buyer_protection_dialog.buyer_protection_info_business'
    | 'buyer_protection_dialog.buyer_protection_info'
}

const ContentRow = ({ iconName, translationValue, translationId, translationsPrefix }: Props) => {
  const translate = useTranslate(translationsPrefix)

  return (
    <Cell
      styling="tight"
      prefix={
        iconName && (
          <Icon
            name={iconName}
            testId={`content-icon-${iconName.Title}`}
            color="primary-default"
            aria={{
              'aria-hidden': 'true',
            }}
          />
        )
      }
      title={
        <Text
          as="h2"
          text={translate(`${translationId}.title`)}
          type="title"
          testId={`content-title-${translationId}`}
        />
      }
      body={
        <div className="buyer-protection-modal">
          <Text
            as="span"
            text={translate(`${translationId}.description`, translationValue)}
            html
            testId={`content-description-${translationId}`}
          />
        </div>
      }
    />
  )
}

export default ContentRow
