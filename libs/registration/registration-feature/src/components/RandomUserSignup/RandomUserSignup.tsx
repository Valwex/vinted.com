'use client'

import { useState, MouseEvent } from 'react'
import { Button, Cell, Checkbox, Dialog, Spacer, Text, Icon } from '@vinted/web-ui'
import { Settings24 } from '@vinted/monochrome-icons'

import { navigateToPage } from '@marketplace-web/browser/browser-navigation-util'
import { List } from '@marketplace-web/common-components/list-ui'
import { generateRandomUser } from '@marketplace-web/registration/registration-data'
import { useIncogniaTracking } from '@marketplace-web/bot-detection/incognia-feature'

import { ROOT_URL } from '../../constants/routes'

const RandomUserSignup = () => {
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
  const [isGod, setIsGod] = useState(true)

  const { getIncogniaRequestHeaders } = useIncogniaTracking()

  const handleToggleModal = (event: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    if (isLoading) {
      event.preventDefault()

      return
    }

    setIsSettingsModalOpen(prevState => !prevState)
  }

  const handleGenerateUser = async (event: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    if (isLoading) {
      event.preventDefault()

      return
    }

    setHasError(false)
    setIsLoading(true)

    try {
      await generateRandomUser({ isGod }, { headers: await getIncogniaRequestHeaders() })

      navigateToPage(ROOT_URL)
    } catch (exception) {
      setHasError(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleIsGod = () => {
    setIsGod(prevState => !prevState)
  }

  const renderError = () => {
    if (!hasError) return null

    return (
      <>
        <Text
          as="h3"
          theme="warning"
          type="subtitle"
          alignment="center"
          width="parent"
          text="Server error"
        />
        <Spacer />
      </>
    )
  }

  const renderModal = () => (
    <Dialog show={isSettingsModalOpen}>
      <List>
        <Cell styling="wide">
          <Text
            as="h2"
            type="title"
            alignment="center"
            width="parent"
            text="Generate user settings"
          />
        </Cell>
        <Cell
          styling="wide"
          title="Assign god role?"
          suffix={
            <Checkbox
              name="is_god"
              checked={isGod}
              onClick={handleToggleIsGod}
              onChange={() => undefined}
            />
          }
        />
        <Cell styling="wide">
          <Button text="Save" styling="filled" isLoading={isLoading} onClick={handleToggleModal} />
        </Cell>
      </List>
    </Dialog>
  )

  return (
    <>
      {renderError()}
      <div className="u-flexbox">
        <Button text="Generate random user" isLoading={isLoading} onClick={handleGenerateUser} />
        <Spacer orientation="vertical" />
        <Button
          icon={<Icon name={Settings24} color="primary-default" />}
          inline
          onClick={handleToggleModal}
        />
      </div>
      {renderModal()}
    </>
  )
}

export default RandomUserSignup
