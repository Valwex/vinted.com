'use client'

import { Cell, DoubleImage, Image } from '@vinted/web-ui'
import { useIntl } from 'react-intl'

import { useTranslate } from '@marketplace-web/i18n/i18n-feature'
import { EMPTY_USER_IMAGE_NAME, useAsset } from '@marketplace-web/shared/assets'
import { formatCurrencyAmount } from '@marketplace-web/currency/currency-data'
import { HelpCenterTransactionModel } from '@marketplace-web/help-center/help-center-transactions-data'

const FALLBACK_IMAGE = 'image.svg'

type Props = {
  transaction: HelpCenterTransactionModel
  cellOptions?: React.ComponentProps<typeof Cell>
}

const HelpCenterTransactionItem = ({ transaction, cellOptions }: Props) => {
  const translate = useTranslate('user')
  const asset = useAsset('assets/icons')
  const noPhotoAsset = useAsset('assets/no-photo')
  const { locale } = useIntl()

  const {
    price,
    statusTitle,
    statusUpdatedAt,
    shipmentStatusTitle,
    shipmentStatusUpdatedAt,
    itemTitle,
    itemPhoto,
    itemPath,
    bundleCount,
    oppositeUserUsername,
    oppositeUserPhoto,
    oppositeUserPath,
  } = transaction

  const getOppositeUserUsername = () => {
    if (!oppositeUserUsername) return translate('deleted_user')

    return oppositeUserUsername
  }

  const renderConditionalImage = (imageComponent: JSX.Element, path?: string) => {
    const shouldWrap = !cellOptions?.url && !!path

    if (!shouldWrap) return imageComponent

    return (
      <a href={path} data-testid="hc-home-transaction-item-link">
        {imageComponent}
      </a>
    )
  }

  const renderTransactionPrefix = () => {
    const primaryImage = renderConditionalImage(
      <Image
        src={itemPhoto || asset(FALLBACK_IMAGE)}
        alt={itemTitle}
        label={bundleCount?.toString()}
        size="large"
        styling="rounded"
      />,
      itemPath || undefined,
    )

    const secondaryImage = renderConditionalImage(
      <Image
        src={oppositeUserPhoto || noPhotoAsset(EMPTY_USER_IMAGE_NAME)}
        alt={getOppositeUserUsername()}
        size="regular"
        styling="circle"
      />,
      oppositeUserPath || undefined,
    )

    return <DoubleImage primary={primaryImage} secondary={secondaryImage} />
  }

  const renderTransactionBody = () => {
    let formattedAmount: string | undefined

    if (price) {
      formattedAmount = formatCurrencyAmount(price, locale)
    }

    const latestStatusTitle =
      statusUpdatedAt &&
      shipmentStatusUpdatedAt &&
      new Date(statusUpdatedAt) < new Date(shipmentStatusUpdatedAt)
        ? shipmentStatusTitle
        : statusTitle

    const transactionBody = [getOppositeUserUsername(), formattedAmount, latestStatusTitle]
      .filter(Boolean)
      .join(' • ')

    return transactionBody
  }

  return (
    <Cell
      prefix={renderTransactionPrefix()}
      title={itemTitle}
      body={renderTransactionBody()}
      {...cellOptions}
    />
  )
}

export default HelpCenterTransactionItem
