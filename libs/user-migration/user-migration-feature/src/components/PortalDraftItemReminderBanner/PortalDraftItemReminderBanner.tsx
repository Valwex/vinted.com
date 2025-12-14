'use client'

import { InfoBanner } from '@vinted/web-ui'

import { PortalMergeDraftItemsReminderModel } from '@marketplace-web/user-migration/user-migration-data'

type Props = {
  banner: PortalMergeDraftItemsReminderModel
}

const PortalDraftItemReminderBanner = ({ banner }: Props) => {
  return (
    <div className="portal-draft-item-reminder-banner">
      <InfoBanner
        type="info"
        title={banner.title}
        body={banner.subtitle}
        actions={[{ text: banner.actionTitle, url: banner.actionUrl }]}
      />
    </div>
  )
}

export default PortalDraftItemReminderBanner
