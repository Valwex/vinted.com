'use client'

import { ReactNode } from 'react'

import { urlWithParams } from '@marketplace-web/browser/url-util'
import {
  AccessChannel,
  FaqEntryType,
} from '@marketplace-web/help-center/help-center-faq-entry-url-data'

type Props = {
  accessChannel?: AccessChannel
  type: FaqEntryType
  render: (faqUrl: string, faqEntryId: number) => ReactNode
}

const HelpCenterFaqEntryUrl = ({ type, render, accessChannel }: Props) => {
  const hostUrl = `/help/${type}`

  const finalUrl = accessChannel
    ? urlWithParams(hostUrl, { access_channel: accessChannel })
    : hostUrl

  return <>{render(finalUrl, type)}</>
}

export default HelpCenterFaqEntryUrl
