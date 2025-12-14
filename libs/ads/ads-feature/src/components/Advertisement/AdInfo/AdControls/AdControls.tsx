'use client'

import { useEffect, useState } from 'react'
import { HorizontalDots16, Flag24 } from '@vinted/monochrome-icons'
import { Button, Card, Cell, Divider, Icon, Text } from '@vinted/web-ui'

import { OutsideClick } from '@marketplace-web/common-components/outside-click-ui'
import { SeparatedList } from '@marketplace-web/common-components/separated-list-ui'
import { DropdownActions } from '@marketplace-web/profile/dropdown-menu-ui'
import { useTranslate } from '@marketplace-web/i18n/i18n-feature'
import { useTracking } from '@marketplace-web/observability/event-tracker-data'
import { useSystemConfiguration } from '@marketplace-web/shared/system-configuration-data'
import { useUserAgent } from '@marketplace-web/environment/request-context-data'
import { isMobile } from '@marketplace-web/consent/consent-feature'
import { adReportEvent } from '@marketplace-web/ads/ads-data'

import { SlotInfo } from '../../../../containers/AdsProvider/types'

const REPORTED_MENU_CLOSE_DELAY_MS = 3000

type Props = {
  slotInfo: SlotInfo
}

const AdControls = ({ slotInfo }: Props) => {
  const translate = useTranslate('advertisements')
  const { track } = useTracking()
  const { userCountry: countryCode } = useSystemConfiguration() || {}
  const userAgent = useUserAgent()
  const isMobileWeb = isMobile(userAgent)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isReported, setIsReported] = useState(false)

  const hideMenu = () => {
    setIsMenuOpen(false)
    setIsReported(false)
  }

  const handleMenuToggle = () => {
    setIsMenuOpen(prevState => !prevState)
  }

  const handleReportClick = () => {
    track(
      adReportEvent({
        placementId: slotInfo.placementId,
        campaignId: slotInfo.campaignId?.toString(),
        creativeId: slotInfo.creativeId?.toString(),
        countryCode,
        networkName: undefined,
        advertiserId: slotInfo.advertiserId?.toString(),
        lineItemId: slotInfo.lineItemId?.toString(),
        isMobileWeb,
      }),
    )

    setIsReported(true)
  }

  useEffect(() => {
    if (!isReported) return undefined

    const timer = setTimeout(() => {
      setIsMenuOpen(false)
      setIsReported(false)
    }, REPORTED_MENU_CLOSE_DELAY_MS)

    return () => clearTimeout(timer)
  }, [isReported])

  const actions: Array<DropdownActions> = [
    {
      id: 'report',
      text: translate('report_ad'),
      onClick: handleReportClick,
    },
  ]

  return (
    <OutsideClick onOutsideClick={hideMenu}>
      <div className="u-ui-padding-left-small slot-controls">
        <Button
          styling="flat"
          size="medium"
          theme="muted"
          inline
          truncated={false}
          icon={<Icon name={HorizontalDots16} color="greyscale-level-2" />}
          iconPosition="right"
          onClick={handleMenuToggle}
          testId="slot-controls-menu-button"
          aria={{
            'aria-expanded': isMenuOpen,
          }}
        />
        {isMenuOpen && (
          <div className="slot-controls__dropdown" data-testid="slot-controls-dropdown">
            <Card styling="elevated">
              <div className="u-overflow-hidden">
                {isReported ? (
                  <Cell testId="slot-controls-reported-message">
                    <Text as="span" text={translate('reported')} />
                  </Cell>
                ) : (
                  <SeparatedList separator={<Divider />}>
                    {actions.map(({ id, text, onClick }) => (
                      <Cell
                        type="navigating"
                        onClick={onClick}
                        key={id}
                        testId={`slot-controls-action-${id}`}
                        prefix={<Icon name={Flag24} color="warning-default" />}
                        title={<Text as="span" text={text} theme="warning" bold />}
                      />
                    ))}
                  </SeparatedList>
                )}
              </div>
            </Card>
          </div>
        )}
      </div>
    </OutsideClick>
  )
}

export default AdControls
