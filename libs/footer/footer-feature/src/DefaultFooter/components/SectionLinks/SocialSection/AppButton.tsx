'use client'

import { PropsWithChildren } from 'react'

import { useTracking } from '@marketplace-web/observability/event-tracker-data'
import { Hostname } from '@marketplace-web/vinted-context/construct-headers-util'
import { clickEvent } from '@marketplace-web/footer/footer-data'

import { Platform } from './types'

const url: Record<Platform, string> = {
  android: `https://${Hostname.Fr}/l/app-android-landing`,
  ios: `https://${Hostname.Fr}/l/app-ios-landing`,
}
const clickTarget: Record<Platform, Parameters<typeof clickEvent>[0]['target']> = {
  android: 'download_android_app',
  ios: 'download_ios_app',
}

type Props = {
  platform: Platform
}

const AppButton = ({ children, platform }: PropsWithChildren<Props>) => {
  const { track } = useTracking()

  return (
    <a
      href={url[platform]}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => {
        track(
          clickEvent({
            target: clickTarget[platform],
          }),
        )
      }}
    >
      {children}
    </a>
  )
}

export default AppButton
