import {
  FaqEntriesResp,
  FaqEntryDto,
} from '@marketplace-web/help-center/help-center-faq-entry-data'

import {
  HelpCenterNavigationItemModel,
  HelpCenterNavigationModel,
} from '../types/help-center-navigation'

const transformHelpCenterNavigationDto = ({
  id,
  title,
  children,
}: Pick<FaqEntryDto, 'id' | 'title' | 'children'>): HelpCenterNavigationItemModel => ({
  id,
  title: title || null,
  childFaqEntries: children?.map(childFaqEntry => ({
    ...transformHelpCenterNavigationDto(childFaqEntry),
    faqEntryParentId: id,
  })),
})

export const transformHelpCenterNavigationResponse = ({
  faq_entries_parent_id,
  faq_entries_parent_title,
  faq_entries,
}: FaqEntriesResp): HelpCenterNavigationModel => ({
  rootFaqEntryId: faq_entries_parent_id,
  rootFaqEntryTitle: faq_entries_parent_title,
  childFaqEntries: faq_entries.map(transformHelpCenterNavigationDto),
})
