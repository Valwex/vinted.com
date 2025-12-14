import { api } from '@marketplace-web/core-api/core-api-client-util'

import type { GetBrazeEventPropertiesArgs } from '../types/args'
import type { GetBrazeEventPropertiesResp } from '../types/responses'

export const getBrazeEventProperties = ({ eventName, modelId }: GetBrazeEventPropertiesArgs) =>
  api.get<GetBrazeEventPropertiesResp>('/external_crm/event_payload', {
    params: {
      event_name: eventName,
      model_id: modelId,
    },
  })
