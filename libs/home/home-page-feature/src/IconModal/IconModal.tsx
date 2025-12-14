'use client'

import { StarListerBadge72 } from '@vinted/multichrome-icons'
import { Button, Cell, Dialog, Icon, Navigation, Text } from '@vinted/web-ui'
import { useEffect, useState } from 'react'

import { X24 } from '@vinted/monochrome-icons'

import { useTracking } from '@marketplace-web/observability/event-tracker-data'
import { useTranslate } from '@marketplace-web/i18n/i18n-feature'
import { clickEvent, viewEvent, postHomepageAction } from '@marketplace-web/home/home-page-data'

type Props = {
  name: string
  title: string
  description: string
  cta: {
    url: string
    title: string
  }
  homepageSessionId: string
}

const IconModal = (props: Props) => {
  const [isOpen, setIsOpen] = useState(true)
  const { track } = useTracking()
  const translate = useTranslate()

  useEffect(() => {
    postHomepageAction({ blockName: props.name })
    track(
      viewEvent({
        target: 'homepage_icon_modal',
        targetDetails: JSON.stringify({
          homepage_session_id: props.homepageSessionId,
        }),
      }),
    )
  }, [props.homepageSessionId, track, props.name])

  const closeModal = () => {
    setIsOpen(false)
  }

  const trackCtaClick = () => {
    postHomepageAction({ blockName: props.name })
    track(
      clickEvent({
        target: 'homepage_icon_modal_cta',
        targetDetails: JSON.stringify({
          homepage_session_id: props.homepageSessionId,
        }),
      }),
    )
  }

  return (
    <Dialog show={isOpen} defaultCallback={closeModal} closeOnOverlay>
      <Navigation
        theme="transparent"
        body={<Text text={props.title} type="title" as="h2" />}
        right={
          <Button
            inline
            onClick={closeModal}
            styling="flat"
            title={translate('common.a11y.actions.dialog_close')}
            icon={<Icon name={X24} color="greyscale-level-1" />}
          />
        }
      />
      <div className="u-flexbox u-justify-content-center u-ui-padding-top-large">
        <Icon name={StarListerBadge72} />
      </div>
      <Cell>
        <Text as="p" type="body" text={props.description} width="parent" alignment="left" />
      </Cell>
      <Cell>
        <Button
          onClick={trackCtaClick}
          styling="filled"
          text={props.cta.title}
          url={props.cta.url}
        />
      </Cell>
    </Dialog>
  )
}

export default IconModal
