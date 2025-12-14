'use client'

import { Cell, Text, Spacer } from '@vinted/web-ui'
import { ReactNode, useRef } from 'react'
import { InView } from 'react-intersection-observer'

import { useTracking } from '@marketplace-web/observability/event-tracker-data'
import { userViewHomepageBlock } from '@marketplace-web/home/home-page-data'
import { useBreakpoint } from '@marketplace-web/breakpoints/breakpoints-feature'

import BlockTitle from '../../common/BlockTitle'

type Props = {
  name: string
  position: number
  homepageSessionId: string
  id?: string
  headerProps?: {
    title: string
    subtitle: string | null
  }
  className?: string
} & (
  | {
      body: ReactNode
      children?: never
    }
  | {
      children: ReactNode
      body?: never
    }
)

const HomepageBlockLayout = ({
  name,
  position,
  id,
  homepageSessionId,
  headerProps,
  body,
  children,
  className,
}: Props) => {
  const { track } = useTracking()
  const breakpoints = useBreakpoint()

  const isBlockSeen = useRef(false)

  const handleBlockView = (inView: boolean) => {
    if (!inView) return
    if (isBlockSeen.current) return

    isBlockSeen.current = true

    track(
      userViewHomepageBlock({
        blockName: name,
        blockPosition: position,
        homepageSessionId,
        id,
      }),
    )
  }

  const renderHeader = () => {
    if (!headerProps) return null

    const { title, subtitle } = headerProps

    return (
      <>
        <Cell
          styling="tight"
          title={
            <div className="homepage-layouts-text-truncation">
              <BlockTitle title={title} width="Parent" />
            </div>
          }
          body={
            subtitle ? (
              <div className="homepage-layouts-text-truncation">
                <Text type="subtitle" width="parent" text={subtitle} as="p" />
              </div>
            ) : null
          }
          testId={`${name}-header`}
          fullWidthTitle
        />
        {breakpoints.phones ? <Spacer size="regular" /> : <Spacer size="large" />}
      </>
    )
  }

  return (
    <InView onChange={handleBlockView} className={className}>
      {renderHeader()}
      {body || children}
    </InView>
  )
}

export default HomepageBlockLayout
