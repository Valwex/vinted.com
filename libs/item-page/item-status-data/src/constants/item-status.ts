export type ItemAlertDto = {
  item_alert_type: ItemAlertStatus | null
  detailed_description: string | null
  photo_tip_id?: number
  short_description?: string
}

export enum ItemAlertStatus {
  MissingSubcategory = 'missing_subcategory',
  ChangeDescription = 'change_description',
  Black = 'black',
  DarkGray = 'dark_gray',
  PackageSize = 'package_size',
  ReplicaProof = 'replica_proof',
  UnderReview = 'under_review',
  EligibleForAuthenticity = 'eligible_for_authenticity',
  VerifiedOnlineAuthenticity = 'verified_online_authenticity',
  DelayedPublication = 'delayed_publication',
  ManualDelayedPublication = 'manual_delayed_publication',
}
