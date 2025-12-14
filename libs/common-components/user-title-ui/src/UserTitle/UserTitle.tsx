'use client'

import { Badge, Spacer, Text } from '@vinted/web-ui'

type Props = {
  login: string
  businessAccountName?: string
  isBusiness?: boolean
  isBody?: boolean
  isLoginForced?: boolean
  isBottomLoginHidden?: boolean
  isBadgeHidden?: boolean
  truncate?: boolean
  badgeTitle: string
}

const UserTitle = ({
  login,
  businessAccountName,
  isBusiness,
  isBody,
  isLoginForced,
  isBottomLoginHidden,
  isBadgeHidden,
  truncate,
  badgeTitle,
}: Props) => {
  const businessDisplayName = isBusiness && !isLoginForced && businessAccountName
  const title = businessDisplayName || login

  function renderBusinessAccountBadge() {
    if (!businessDisplayName || isBadgeHidden) return null

    return (
      <>
        <Spacer orientation="vertical" size="regular" />
        <Badge content={badgeTitle} testId="profile-pro-badge" />
      </>
    )
  }

  function renderBottomLogin() {
    if (!businessDisplayName || isBottomLoginHidden || isLoginForced) return null

    return (
      <Text
        as="h3"
        width="parent"
        text={`@${login}`}
        type="subtitle"
        testId="profile-business-name"
      />
    )
  }

  return (
    <>
      <div className="u-flexbox u-align-items-center">
        <Text
          as={isBody ? 'span' : 'h1'}
          text={title}
          type={isBody ? 'body' : 'heading'}
          theme="amplified"
          truncate={truncate}
          bold
          testId="profile-username"
        />
        {renderBusinessAccountBadge()}
      </div>
      {renderBottomLogin()}
    </>
  )
}

export default UserTitle
