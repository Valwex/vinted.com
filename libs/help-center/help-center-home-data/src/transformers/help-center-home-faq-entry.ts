import {
  FaqEntriesResp,
  FaqEntryDto,
} from '@marketplace-web/help-center/help-center-faq-entry-data'

import { HelpCenterHomeFaqEntryModel } from '../types/help-center-home-faq-entry'

const transformHomeFaqEntryDto = (faq: Omit<FaqEntryDto, 'body'>): HelpCenterHomeFaqEntryModel => ({
  id: faq.id,
  title: faq.title,
  icon: faq.icon,
})

export const transformHelpCenterHomeFaqsResponse = (response: FaqEntriesResp) =>
  response.faq_entries.map(transformHomeFaqEntryDto)
