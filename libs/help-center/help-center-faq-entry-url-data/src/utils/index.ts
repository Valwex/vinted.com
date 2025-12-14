import { kebabCase } from 'lodash'

import { urlWithParams } from '@marketplace-web/browser/url-util'

const HC_ROOT_PATH = '/help'
const FAQ_ENTRY_PATH_REGEX = /^\/([^/]+)\/?(\d+)?\/?(\d+)?/
const HC_ROOT_FAQ_ID = 3
const HC_FAQ_PATH = (faqPath: string) => `/help/${faqPath}`

export enum FaqEntryType {
  NoAccessToEmail = 86,
  NoAccessToOldEmail = 597,
  SmsVerfication = 583,
  PhoneVerification = 585,
  PhoneChange = 688,
  PendingBalance = 460,
  PaymentFailed = 764,
  Donations = 725,
  KycVerificationProblems = 671,
  PortalMerge = 798,
  MakingGoodPhoto = 48,
  BusinessRow = 886,
  InsufficientBalance = 936,
  RequestDataExport = 947,
  Bump = 340,
  ClosetPromotion = 452,
  CrossCurrency = 1074,
  SetCorrectPrice = 376,
  WriteGoodItemDescription = 49,
  OfflineVerification = 1153,
  ElectronicsVerificationSeller = 1361,
  SpamPhishing = 628,
  BlockingMember = 91,
  VintedGuide = 360,
  HowToVerifyEmailCode = 1144,
  UploadingAnItem = 8,
  ShippingSeller = 419,
  VintedWallet = 431,
  TrackDelivery = 100,
  IsItFreeToSell = 373,
  FindingAnItem = 424,
  BuyingStepByStep = 25,
  ShippingBuyer = 420,
  BuyerProtection = 550,
  IhaiRefundPolicy = 465,
  HelpCenterRoot = 3,
  MembersFeedback = 356,
  AddPhoneNumber = 622,
  LeavingFeedbackForBuyer = 14,
  CantLogin = 104,
  AccountStaff = 1270,
  TaxpayerReportingMistakeSeller = 1259,
  DsaLegalRequirements = 1269,
  Dac7Reporting = 1149,
  HowToCompleteDac7Report = 1287,
  Dac7HarmReduction = 1308,
  Dac7SpecialVerification = 1298,
  AccontProtectPhoneVerificationNotWorking = 1405,
  VerifyPhoneNumber = 537,
  RequestDataExportV1 = 1374,
  ContactSupport = 1463,
  SafetyGuidelines = 1417,
  SellingStepByStep = 1018,
  MeasuringParcelSize = 1493,
  PrivacyRights = 1432,
}

export enum AccessChannel {
  VintedGuide = 'vinted_guide',
  HcSearch = 'hc_search',
  HcTransaction = 'hc_transaction',
  HcTopics = 'hc_topics',
  ConversationTx = 'conversation_tx',
  ConversationNoTx = 'conversation_no_tx',
  ProductLink = 'product_link',
  ExternalLink = 'external_link',
  DataExport = 'data_export',
  Profile = 'profile',
}

type FaqEntryUrlProps = {
  id: number
  title?: string | null
  faqEntryParentId?: number
}

export const getFaqPathDataFromUrl = (faqEntryUrl: string) => {
  const match = faqEntryUrl.match(FAQ_ENTRY_PATH_REGEX)

  if (!match) {
    return undefined
  }

  return {
    path: match[1],
    faqEntryParentId: Number(match[2]) || null,
    faqEntryId: Number(match[3]) || null,
  }
}

export const getFaqEntryPath = ({ id, title, faqEntryParentId }: FaqEntryUrlProps) => {
  let faqEntryPath = ''

  if (faqEntryParentId) {
    faqEntryPath = `${faqEntryParentId}/`
  }

  faqEntryPath += title ? kebabCase(`${id}-${title}`) : id.toString()

  return faqEntryPath
}

export const generateFaqLink = (
  faqEntry: FaqEntryUrlProps,
  accessChannel: Array<string> | string | undefined,
  threadId: Array<string> | string | undefined,
) => {
  if (faqEntry.id === HC_ROOT_FAQ_ID) {
    return urlWithParams(HC_ROOT_PATH, {
      thread_id: threadId,
    })
  }

  const queryAccessChannel = typeof accessChannel === 'string' ? accessChannel : undefined
  const isConversationAccessChannel =
    queryAccessChannel === AccessChannel.ConversationNoTx ||
    queryAccessChannel === AccessChannel.ConversationTx

  const faqEntryPath = getFaqEntryPath(faqEntry)

  return urlWithParams(HC_FAQ_PATH(faqEntryPath), {
    access_channel: isConversationAccessChannel ? queryAccessChannel : AccessChannel.HcTopics,
    thread_id: threadId,
  })
}
