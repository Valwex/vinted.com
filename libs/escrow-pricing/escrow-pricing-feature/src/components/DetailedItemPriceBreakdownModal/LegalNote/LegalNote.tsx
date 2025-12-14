'use client'

import { Divider, Cell, Text, Container } from '@vinted/web-ui'

import { useTranslate } from '@marketplace-web/i18n/i18n-feature'

import { AdditionalNote } from '../AdditionalNote'

type Props = {
  isSellerBusiness: boolean
  additionalNote?: string
}

const LegalNote = ({ isSellerBusiness, additionalNote }: Props) => {
  const translate = useTranslate('item_price_breakdown_detailed')
  const userTypeSuffix = isSellerBusiness ? '_pro' : ''

  return (
    <>
      <Divider />
      <Container styling="narrow">
        {additionalNote && <AdditionalNote noteTranslationKey={additionalNote} />}
        <Cell styling="narrow">
          <Text
            as="div"
            testId="legal-note"
            type="caption"
            text={translate(`legal_note${userTypeSuffix}`)}
          />
        </Cell>
      </Container>
    </>
  )
}

export default LegalNote
