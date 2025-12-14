'use client'

import { Cell, Image, Rating, Spacer, Text } from '@vinted/web-ui'

import { useTranslate } from '@marketplace-web/i18n/i18n-feature'
import { EMPTY_USER_IMAGE_NAME, useAsset } from '@marketplace-web/shared/assets'
import { useFeatureSwitch } from '@marketplace-web/feature-flags/feature-switches-data'
import { UserTitle } from '@marketplace-web/common-components/user-title-ui'
import { ReferrerModel } from '@marketplace-web/referrals/referrals-data'
import { useAuthModal } from '@marketplace-web/auth-flow/auth-modal-context-feature'
import { AuthView, useAuthenticationContext } from '@marketplace-web/auth-flow/auth-context-feature'

import { MEMBER_PROFILE_URL } from '../../../constants/routes'

type Props = {
  referrer: ReferrerModel | undefined
}

const calculateRating = (reputation: number): number => {
  return Math.round(reputation * 5 * 100) / 100
}

const SelectTypeHeader = ({ referrer }: Props) => {
  const { authView, isAuthPage } = useAuthenticationContext()
  const isLoginView = authView === AuthView.SelectTypeLogin
  const { isBusinessAuth } = useAuthModal()
  const authTranslate = useTranslate(`auth.select_type.${isLoginView ? 'login' : 'register'}`)
  const businessTranslate = useTranslate('business')
  const userFeedbackTranslate = useTranslate('user.feedback')
  const isReferralsTnCEnabled = useFeatureSwitch('referrals_tnc_reorganization')
  const noPhotoAsset = useAsset('assets/no-photo')

  const renderSubtitle = () => {
    if (!isBusinessAuth) return null

    return (
      <>
        <Spacer size="large" />
        <Text as="span" width="parent" alignment="center">
          {businessTranslate('account.subtitle')}
        </Text>
      </>
    )
  }

  const renderTitle = () => {
    return (
      <Text
        as="h1"
        id="auth_modal_title"
        text={
          isBusinessAuth
            ? businessTranslate('account.title')
            : authTranslate(isAuthPage ? 'title_short' : 'title')
        }
        type="heading"
        alignment="center"
        width="parent"
      />
    )
  }

  const renderReferrer = ({
    referrerId,
    login,
    photoUrl,
    feedbackReputation,
    feedbackCount,
    isBusiness,
    businessAccountName,
  }: ReferrerModel) => (
    <>
      <div className="u-flexbox u-justify-content-center">
        <div>
          <Cell
            clickable
            styling="tight"
            prefix={
              <Image
                role="img"
                src={photoUrl || noPhotoAsset(EMPTY_USER_IMAGE_NAME)}
                styling="circle"
                size="large"
              />
            }
            title={
              <UserTitle
                badgeTitle={businessTranslate('title')}
                businessAccountName={businessAccountName || undefined}
                login={login}
                isBusiness={isBusiness}
                isBody
                isBottomLoginHidden
                isBadgeHidden
              />
            }
            url={MEMBER_PROFILE_URL(referrerId)}
          >
            <Rating
              value={calculateRating(feedbackReputation)}
              text={userFeedbackTranslate(
                'reviews',
                { count: feedbackCount },
                { count: feedbackCount },
              )}
              size="regular"
              emptyStateText={userFeedbackTranslate('no_reviews')}
            />
          </Cell>
        </div>
      </div>
      <Spacer size="large" />
      <Text
        as="h1"
        text={authTranslate('referrer_title', { username: login })}
        type="heading"
        alignment="center"
        width="parent"
      />
      {isReferralsTnCEnabled && (
        <>
          <Spacer size="large" />
          <span className="auth__referrer-subtitle">
            <Text
              as="span"
              text={authTranslate('referrer_subtitle')}
              alignment="center"
              width="parent"
              type="caption"
              html
            />
          </span>
        </>
      )}
    </>
  )

  if (referrer && !isLoginView) {
    return renderReferrer(referrer)
  }

  return (
    <>
      {renderTitle()}
      {renderSubtitle()}
    </>
  )
}

export default SelectTypeHeader
