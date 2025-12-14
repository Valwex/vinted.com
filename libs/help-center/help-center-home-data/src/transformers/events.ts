type HelpCenterVirtualAssistantEventBaseArgs = {
  helpCenterSessionId: string
}

type HelpCenterVirtualAssistantHomeScreenViewArgs = HelpCenterVirtualAssistantEventBaseArgs & {
  accessChannel?: string | null
}

type HelpCenterLegacyHomeScreenViewArgs = HelpCenterVirtualAssistantEventBaseArgs & {
  accessChannel?: string | null
}
type HelpCenterTransactionScreenViewArgs = HelpCenterVirtualAssistantEventBaseArgs & {
  accessChannel?: string | null
  transactionId: string
}

// Member viewed all recent transactions, triggered when entering the view
export const helpCenterAllRecentTransactionsScreenView = (
  args: HelpCenterVirtualAssistantEventBaseArgs,
) => {
  const { helpCenterSessionId } = args

  const extra = {
    help_center_session_id: helpCenterSessionId,
  }

  return {
    event: 'help_center.all_recent_transactions_screen_view',
    extra,
  }
}

// Member viewed AI help center
export const helpcenterAiHomeScreenView = (args: HelpCenterVirtualAssistantHomeScreenViewArgs) => {
  const { helpCenterSessionId, accessChannel } = args

  const extra = {
    help_center_session_id: helpCenterSessionId,
    access_channel: accessChannel,
  }

  return {
    event: 'help_center.hc_ai_screen_view',
    extra,
  }
}

/** Member viewed legacy Help Center */
export const helpcenterLegacyHomeScreenView = (args: HelpCenterLegacyHomeScreenViewArgs) => {
  const { helpCenterSessionId, accessChannel } = args

  const extra = {
    help_center_session_id: helpCenterSessionId,
    access_channel: accessChannel,
  }

  return {
    event: 'help_center.hc_legacy_screen_view',
    extra,
  }
}

/** Member viewed Help Center search */
export const helpcenterLegacySearchScreenView = (args: HelpCenterVirtualAssistantEventBaseArgs) => {
  const { helpCenterSessionId } = args

  const extra = {
    help_center_session_id: helpCenterSessionId,
  }

  return {
    event: 'help_center.search_screen_view',
    extra,
  }
}

/** Member viewed Help Center transaction view */
export const helpcenterTransactionScreenView = (args: HelpCenterTransactionScreenViewArgs) => {
  const { helpCenterSessionId, transactionId } = args

  const extra = {
    help_center_session_id: helpCenterSessionId,
    transaction_id: transactionId,
  }

  return {
    event: 'help_center.transaction_help_screen_view',
    extra,
  }
}
