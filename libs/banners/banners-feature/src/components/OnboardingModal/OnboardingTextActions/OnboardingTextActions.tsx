'use client'

import { Button, Cell } from '@vinted/web-ui'

import { useBreakpoint } from '@marketplace-web/breakpoints/breakpoints-feature'

import { ITEM_UPLOAD_URL } from '../../../constants/routes'

type Props = {
  primaryText: string
  onPrimaryClick: () => void
}

const OnboardingTextActions = ({ primaryText, onPrimaryClick }: Props) => {
  const breakpoints = useBreakpoint()

  return (
    <div className="u-overflow-hidden">
      <Cell styling={breakpoints.phones ? 'narrow' : 'default'}>
        <Button
          styling="filled"
          text={primaryText}
          url={ITEM_UPLOAD_URL}
          onClick={onPrimaryClick}
        />
      </Cell>
    </div>
  )
}

export default OnboardingTextActions
