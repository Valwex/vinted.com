'use client'

import { Umbrella24 } from '@vinted/monochrome-icons'
import { Button, Card, Cell, Icon } from '@vinted/web-ui'
import { useState } from 'react'

import classNames from 'classnames'

import { disableUserHoliday } from '@marketplace-web/profile/vacation-mode-data'
import { reloadPage } from '@marketplace-web/browser/browser-navigation-util'

type Props = {
  userId: number
  className?: string
  titleLabel: string
  actionLabel: string
}

// TODO: Icon should be confirmed or replaced before scaling
const VacationNotification = ({ userId, className, titleLabel, actionLabel }: Props) => {
  const [isLoading, setIsLoading] = useState(false)

  async function handleClick(event: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) {
    if (isLoading) {
      event.preventDefault()

      return
    }

    if (!userId) return

    setIsLoading(true)
    await disableUserHoliday(userId)

    reloadPage()
  }

  const classes = classNames('u-ui-margin-vertical-x-large', className)

  return (
    <div className={classes}>
      <Card>
        <div className="u-overflow-hidden">
          <Cell
            styling="wide"
            prefix={<Icon name={Umbrella24} color="greyscale-level-2" />}
            body={titleLabel}
            suffix={
              <Button
                text={actionLabel}
                onClick={handleClick}
                styling="filled"
                size="medium"
                isLoading={isLoading}
                disabled={isLoading}
              />
            }
            testId="vacation-notification"
          />
        </div>
      </Card>
    </div>
  )
}

export default VacationNotification
