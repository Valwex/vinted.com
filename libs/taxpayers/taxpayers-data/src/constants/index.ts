export enum TaxpayerBannerIllustration {
  Parcels = 'dac7-parcels-person-64',
  PhoneWithShield = 'dac7-phone-with-shield-64',
  MoneyBlocked = 'dac7-money-blocked-64',
}

export enum TaxpayerBannerRenderLocation {
  Feed = 'feed',
  Wallet = 'wallet',
  Wardrobe = 'wardrobe',
  TaxpayerSummary = 'taxpayer_summary',
}

export enum TaxpayerBannerStyleType {
  Default = 'default',
  Illustrated = 'illustrated',
}

export enum TaxpayerBannerTrackingId {
  FirstReminder = 'first_reminder',
  SecondReminder = 'second_reminder',
  NoFillReminder = 'no_fill_reminder',
  DataRequest = 'data_request',
  SellingBlocked = 'selling_blocked',
  Restricted = 'restricted',
  VerificationInitiation = 'verification_initiation',
  VerificationProgress = 'verification_progress',
  VerificationWarning = 'verification_warning',
  VerificationCritical = 'verification_critical',
  VerificationCorrectionInitation = 'verification_correction_initiation',
  VerificationCorrectionProgress = 'verification_correction_progress',
  VerificationCorrectionWarning = 'verification_correction_warning',
  VerificationCorrectionCritical = 'verification_correction_critical',
  VerificationUnexpectedErrorInitiation = 'verification_unexpected_error_initiation',
  VerificationUnexpectedErrorProgress = 'verification_unexpected_error_progress',
  VerificationUnexpectedErrorWarning = 'verification_unexpected_error_warning',
  VerificationUnexpectedErrorCritical = 'verification_unexpected_error_critical',
  VerificationSuccess = 'verification_success',
}

export enum TaxpayerBannerType {
  Info = 'info',
  Success = 'success',
  Warning = 'warning',
  Error = 'error',
}

export enum TaxpayersSpecialVerificationFormType {
  Identity = 'identity',
  BillingAddress = 'billing_address',
  PlaceOfBirth = 'place_of_birth',
  Tin = 'tin',
  VatNumber = 'vat_number',
  BusinessInformation = 'business_information',
  BusinessTin = 'business_tin',
  BusinessVatNumber = 'business_vat_number',
}

export enum TaxpayersSpecialVerificationFieldType {
  FirstName = 'first_name',
  LastName = 'last_name',
  Birthdate = 'birthdate',
  Address = 'address',
  Tin = 'tin',
  VatNumber = 'vat_number',
  BirtplaceCountryCode = 'birthplace_country_code',
  BirtplaceCity = 'birthplace_city',
  BusinessName = 'business_name',
  BusinessCode = 'business_code',
  SecondaryBusinessCode = 'secondary_business_code',
  BusinessEstablishmentCountries = 'business_establishment_countries',
}

export enum TaxpayersSpecialVerificationSupportingDocumentType {
  IdCard = 'id_card',
  IdCardTin = 'id_card_tin',
  IdCardCountryAndBirthplaceCity = 'id_card_country_and_birthplace_city',
  Passport = 'passport',
  PassportTin = 'passport_tin',
  PassportCountryAndBirthplaceCity = 'passport_country_and_birthplace_city',
  DrivingLicense = 'driving_license',
  DrivingLicenseTin = 'driving_license_tin',
  DrivingLicenseCountryAndBirthplaceCity = 'driving_license_country_and_birthplace_city',
  BankStatement = 'bank_statement',
  UtilityBill = 'utility_bill',
  Payslip = 'payslip',
  PayslipTin = 'payslip_tin',
  GovernmentIssuedCorrespondence = 'government_issued_correspondence',
  TaxationDocument = 'taxation_document',
  VatRegistrationCertificate = 'vat_registration_certificate',
  ExtractFromMunicipality = 'extract_from_municipality',
  TaxAssessmentDocument = 'tax_assessment_document',
  OfficialDocumentByTaxAuthorities = 'official_document_by_tax_authorities',
  LetterFromTaxAuthorities = 'letter_from_tax_authorities',
  TaxAuthoritiesLetter = 'tax_authorities_letter',
  TaxAuthoritiesLetterTin = 'tax_authorities_letter_tin',
  TaxIdentificationCard = 'tax_identification_card',
  IncomeTaxReturn = 'income_tax_return',
  IncomeTaxNotice = 'income_tax_notice',
  CertificationOfIssuedTin = 'certification_of_issued_tin',
  ResidentCard = 'resident_card',
  PersonalHealthCard = 'personal_health_card',
  ResidencePermit = 'residence_permit',
  TinCard = 'tin_card',
  SocialSecurityCard = 'social_security_card',
  IncomeTaxAssessment = 'income_tax_assessment',
  EmploymentTaxStatement = 'employment_tax_statement',
  InformationalLetterFromCentralTaxOffice = 'informational_letter_from_central_tax_office',
  HealthInsuranceCard = 'health_insurance_card',
  TaxCreditCertificate = 'tax_credit_certificate',
  OfficialLetterFromRevenueCommissioners = 'official_letter_from_revenue_commissioners',
  CertificateAboutEntryToTaxRegister = 'certificate_about_entry_to_tax_register',
  CertificateOfResidence = 'certificate_of_residence',
  SubmittedVatReturn = 'submitted_vat_return',
  HmrcLetter = 'hmrc_letter',
  P60Document = 'p60_document',
  KbisExtract = 'kbis_extract',
  TaxRegistrationCertificate = 'tax_registration_certificate',
  TaxRegistrationCertificateTin = 'tax_registration_certificate_tin',
  Siret = 'siret',
  KExtract = 'k_extract',
  BusinessVatRegistrationCertificate = 'business_vat_registration_certificate',
  BusinessSubmittedVatReturn = 'business_submitted_vat_return',
  PortugalCompanyPersonCard = 'portugal_company_person_card',
  PortugalTaxPayerCertification = 'portugal_tax_payer_certification',
  PortugalCompanyPersonCardVat = 'portugal_company_person_card_vat',
  PortugalTaxPayerCertificationVat = 'portugal_tax_payer_certification_vat',
  PortugalCompanyPersonCardTin = 'portugal_company_person_card_tin',
  PortugalTaxPayerCertificationTin = 'portugal_tax_payer_certification_tin',
  PortugalBusinessPermanentCertificate = 'portugal_business_permanent_certificate',
  PortugalOrganizationStartOfActivity = 'portugal_organization_start_of_activity',
  PortugalBusinessPermanentCertificateVat = 'portugal_business_permanent_certificate_vat',
  PortugalOrganizationStartOfActivityVat = 'portugal_organization_start_of_activity_vat',
  PortugalBusinessPermanentCertificateTin = 'portugal_business_permanent_certificate_tin',
  PortugalOrganizationStartOfActivityTin = 'portugal_organization_start_of_activity_tin',
}

export enum TaxpayerLimitsReachedBy {
  TotalAmount = 'total_amount',
  TransactionCount = 'transaction_count',
}

export enum TaxpayerCenterStatusType {
  Warning = 'warning',
  Success = 'success',
}

export enum TaxpayerCenterSectionIcon {
  FlagEu = 'flag_eu',
  FlagUk = 'flag_uk',
  Document = 'document',
  Check = 'check',
  RelaxedMan = 'relaxed_man',
}
