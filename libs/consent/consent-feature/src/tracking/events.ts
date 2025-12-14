export enum CmpAction {
  BannerAccept = 'banner_accept_all',
  BannerReject = 'banner_reject_all',
  PreferenceCenterAccept = 'preference_center_accept_all',
  PreferenceCenterReject = 'preference_center_reject_all',
}

type UserCmpActionEventArgs = {
  action: CmpAction
  isMobile?: boolean
}

export const userCmpActionEvent = (args: UserCmpActionEventArgs) => {
  const { action, isMobile } = args

  return {
    event: 'user.cmp_action',
    extra: {
      action,
      isMobile,
    },
  }
}
