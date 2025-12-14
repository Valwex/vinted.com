'use client'

import { X24 } from '@vinted/monochrome-icons'
import { Button, Icon, Navigation } from '@vinted/web-ui'

const NavigationCloseButton = ({ handleClose }) => (
  <Navigation
    right={
      <Button
        styling="flat"
        onClick={handleClose}
        icon={<Icon name={X24} testId="icon-x" />}
        inline
        testId="service-fee-modal-navigation-close"
      />
    }
  />
)

export default NavigationCloseButton
