import {
  PortalMergeDraftItemsReminderModel,
  PortalMergeDraftItemsReminderDto,
} from '../types/portal-draft-item-reminder-banner'

export const transformPortalMergeDraftItemsReminder = ({
  title,
  subtitle,
  action_title,
  action_url,
}: PortalMergeDraftItemsReminderDto): PortalMergeDraftItemsReminderModel => ({
  title,
  subtitle,
  actionTitle: action_title,
  actionUrl: action_url,
})
