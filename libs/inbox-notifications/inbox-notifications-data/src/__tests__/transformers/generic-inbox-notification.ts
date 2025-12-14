import { InboxNotificationDto } from '../../types/dtos'
import { GenericInboxNotificationModel } from '../../types/models/generic-inbox-notification'
import { InboxNotificationType } from '../../constants'

export const transformUserNotificationDto = (
  dto: InboxNotificationDto,
): GenericInboxNotificationModel => ({
  id: String(dto.id),
  body: dto.body,
  link: dto.link,
  photoUrl: dto.small_photo_url,
  photoStyle: dto.photo_type === 'user' ? 'circle' : 'rounded',
  time: new Date(dto.updated_at).getTime(),
  type: InboxNotificationType.Vinted,
  entryType: dto.entry_type,
  isViewed: dto.is_read,
  note: dto.note,
  isControl: false,
  subjectId: dto.subject_id,
})
