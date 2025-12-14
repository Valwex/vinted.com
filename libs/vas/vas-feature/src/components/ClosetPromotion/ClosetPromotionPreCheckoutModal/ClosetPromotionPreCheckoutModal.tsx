'use client'

import { InfoCircle16, X24 } from '@vinted/monochrome-icons'
import {
  Button,
  Cell,
  Dialog,
  Divider,
  Icon,
  Image,
  Navigation,
  Spacer,
  Text,
} from '@vinted/web-ui'
import { ReactNode } from 'react'
import { useIntl } from 'react-intl'

import { useTranslate } from '@marketplace-web/i18n/i18n-feature'
import { ScrollableArea } from '@marketplace-web/common-components/scrollable-area-ui'
import { ContentLoader } from '@marketplace-web/common-components/content-loader-ui'
import { useImageSrcSet, useAsset } from '@marketplace-web/shared/assets'
import { formatCurrency } from '@marketplace-web/currency/currency-data'
import { ClosetPromotionPricingModel } from '@marketplace-web/vas/vas-data'

type Props = {
  pricing: ClosetPromotionPricingModel | undefined
  isPricingLoading: boolean
  isOrderLoading: boolean
  show: boolean
  onNextAction: () => void
  onPreview: () => void
  onBack: () => void
  onDynamicPricingInfo: () => void
}

const ClosetPromotionPreCheckoutModal = ({
  pricing,
  isPricingLoading,
  isOrderLoading,
  show,
  onNextAction,
  onPreview,
  onBack,
  onDynamicPricingInfo,
}: Props) => {
  const translate = useTranslate('closet_promotion.pre_checkout_modal')
  const a11yTranslate = useTranslate('closet_promotion.a11y.actions')
  const { locale } = useIntl()

  const asset = useAsset('/assets/closet-promotion')

  const { src, srcSet } = useImageSrcSet({
    baseName: 'wardrobe-spotlight-375x212',
    darkMode: false,
    assetBasePath: '/assets/closet-promotion',
  })

  function renderNavigation() {
    return (
      <Navigation
        right={
          <Button
            iconName={X24}
            theme="amplified"
            styling="flat"
            testId="closet-promotion-pre-checkout-back-button"
            onClick={onBack}
            aria={{ 'aria-label': a11yTranslate('close') }}
          />
        }
        body={
          <Text
            as="h2"
            type="title"
            width="parent"
            alignment="center"
            text={translate('title_v2')}
          />
        }
      />
    )
  }

  function renderIntro() {
    const values = {
      'learn-more': (chunks: Array<ReactNode>) => (
        <button onClick={onPreview} type="button" key="learn-more-button">
          <Text as="span" theme="primary" text={chunks} underline />
        </button>
      ),
    }

    return (
      <>
        <Cell>
          <Text as="h3" text={translate('intro.title_v2')} type="heading" />
        </Cell>
        <Cell
          title={<Text as="h4" text={translate('intro.visibility.title')} type="title" />}
          body={translate('intro.visibility.body')}
          prefix={
            <Image
              role="img"
              src={asset('avatars-group.svg', { theme: { dark: 'dark/avatars-group.svg' } })}
              size="large"
              alt=""
            />
          }
        />
        <Cell
          title={<Text as="h4" text={translate('intro.relevancy.title')} type="title" />}
          body={translate('intro.relevancy.body', values)}
          prefix={
            <Image
              role="img"
              src={asset('hand-ok.svg', { theme: { dark: 'dark/hand-ok.svg' } })}
              size="large"
              alt=""
            />
          }
        />
        <Cell
          title={<Text as="h4" text={translate('intro.insights.title_v2')} type="title" />}
          body={translate('intro.insights.body_v2')}
          prefix={
            <Image
              role="img"
              src={asset('chart.svg', { theme: { dark: 'dark/chart.svg' } })}
              size="large"
              alt=""
            />
          }
        />
      </>
    )
  }

  function renderPrice() {
    if (!pricing) return null

    const { totalPrice, discountedPrice, isSalesTaxApplicable } = pricing

    const formattedTotalPrice = formatCurrency(totalPrice.amount, {
      locale,
      currency: totalPrice.currencyCode,
    })
    const formattedDiscountedPrice = formatCurrency(discountedPrice.amount, {
      locale,
      currency: discountedPrice.currencyCode,
    })

    const showTotalPrice = discountedPrice.amount < totalPrice.amount
    const suffix = (
      <div className="u-flexbox">
        <Icon name={InfoCircle16} color="greyscale-level-2" />
      </div>
    )

    return (
      <div>
        <Cell
          styling="tight"
          suffix={suffix}
          onClick={onDynamicPricingInfo}
          clickable
          testId="closet-promotion-dynamic-pricing-info"
        >
          {showTotalPrice && <Text as="span" text={formattedTotalPrice} strikethrough />}
          <Spacer size="small" orientation="vertical" />
          <Text as="span" text={formattedDiscountedPrice} type="title" />
        </Cell>
        {isSalesTaxApplicable && (
          <div>
            <Text
              as="span"
              theme="muted"
              text={translate('sales_tax_note')}
              testId="closet-promotion-pre-checkout-modal--sales-tax-note"
            />
          </div>
        )}
      </div>
    )
  }

  function renderDeal() {
    if (!pricing) return null

    const { pricePerDay, effectiveDays } = pricing

    const formattedPricePerDay = formatCurrency(pricePerDay.amount, {
      locale,
      currency: pricePerDay.currencyCode,
    })

    return (
      <Cell
        title={translate('duration_day_count', { count: effectiveDays }, { count: effectiveDays })}
        body={translate('price_per_day', { price: formattedPricePerDay })}
        suffix={renderPrice()}
      />
    )
  }

  const handleConfirmationClick = (
    event: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
  ) => {
    if (isOrderLoading) {
      event.preventDefault()

      return
    }

    onNextAction()
  }

  function renderConfirmationAction() {
    if (!pricing) return null

    return (
      <div className="u-ui-margin-horizontal-large u-ui-margin-bottom-large">
        <Button
          text={translate('actions.proceed')}
          styling="filled"
          onClick={handleConfirmationClick}
          isLoading={isOrderLoading}
          testId="closet-promotion-pre-checkout--proceed-button"
        />
      </div>
    )
  }

  function renderContent() {
    if (isPricingLoading || !pricing) {
      return <ContentLoader testId="pre-checkout-loader" styling={ContentLoader.Styling.Wide} />
    }

    return (
      <>
        <div className="u-text-center">
          <Image src={src} srcset={srcSet} styling="rounded" alt="" />
        </div>
        {renderIntro()}
      </>
    )
  }

  return (
    <Dialog show={show} hasScrollableContent testId="closet-promotion-pre-checkout-modal">
      <div className="u-fill-width">
        {renderNavigation()}
        <ScrollableArea>{renderContent()}</ScrollableArea>
        <Divider />
        {renderDeal()}
        {renderConfirmationAction()}
      </div>
    </Dialog>
  )
}

export default ClosetPromotionPreCheckoutModal
