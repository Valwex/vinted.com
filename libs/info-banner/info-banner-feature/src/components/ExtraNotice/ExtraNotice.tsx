'use client'

import { useState } from 'react'
import { X12 } from '@vinted/monochrome-icons'
import {
  BottomSheet,
  Button,
  Cell,
  Divider,
  Dialog,
  Navigation,
  Spacer,
  Text,
  Icon,
} from '@vinted/web-ui'

import { useBreakpoint } from '@marketplace-web/breakpoints/breakpoints-feature'
import { useTranslate } from '@marketplace-web/i18n/i18n-feature'
import { InfoBannerModel } from '@marketplace-web/info-banner/info-banner-data'

import { levelColorMap, levelIcon64Map } from '../../constants'
import useIncrementalStorageCount from '../../hooks/useIncrementalStorageCount'

type Props = {
  screen: string
  banner: InfoBannerModel
}

const ExtraNotice = ({ screen, banner }: Props) => {
  const renderCount = useIncrementalStorageCount(`info_banner_extra_notice_${screen}`)
  const [isOpen, setIsOpen] = useState(renderCount === 1)
  const breakpoints = useBreakpoint()
  const translate = useTranslate()

  const title = banner.title || translate('info_banners.extra_notice.title')

  function handleClose() {
    setIsOpen(false)
  }

  function renderBody() {
    return (
      <>
        <div className="u-text-center">
          <Icon name={levelIcon64Map[banner.level]} color={levelColorMap[banner.level]} />
        </div>
        <Spacer size="large" />
        <Text as="span" text={banner.body} html />
      </>
    )
  }

  if (breakpoints.phones) {
    return (
      <BottomSheet isVisible={isOpen} onClose={handleClose} title={title}>
        <Cell>{renderBody()}</Cell>
      </BottomSheet>
    )
  }

  return (
    <Dialog show={isOpen} defaultCallback={handleClose} closeOnOverlay>
      <Navigation
        body={
          <Cell styling="narrow">
            <Text as="h2" text={title} type="title" />
          </Cell>
        }
        right={
          <Button
            styling="flat"
            onClick={handleClose}
            iconName={X12}
            theme="amplified"
            size="small"
            inline
          />
        }
      />
      <Divider />
      <Cell styling="wide" body={renderBody()} />
    </Dialog>
  )
}

export default ExtraNotice
