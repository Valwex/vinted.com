import {
  TaxpayerAddressValueDto,
  TaxpayerAddressValueModel,
  TaxpayerBillingAddressFieldConfigurationDto,
  TaxpayerBillingAddressFieldConfigurationModel,
  TaxpayerBirthplaceCountryFieldConfigurationDto,
  TaxpayerBirthplaceCountryFieldConfigurationModel,
  TaxpayerBusinessAddressFieldConfigurationDto,
  TaxpayerBusinessAddressFieldConfigurationModel,
  TaxpayerBusinessEstablishmentCountriesConfigurationDto,
  TaxpayerBusinessEstablishmentCountriesConfigurationModel,
  TaxpayerCountryOfTaxResidencyFieldConfigurationDto,
  TaxpayerCountryOfTaxResidencyFieldConfigurationModel,
  TaxpayerFormConfigurationDto,
  TaxpayerFormConfigurationModel,
  TaxpayerFormStatusModel,
  TaxpayerFormStatusResp,
  TaxpayerGeneralBusinessFieldConfigurationDto,
  TaxpayerGeneralBusinessFieldConfigurationModel,
  TaxpayerGeneralFieldConfigurationDto,
  TaxpayerGeneralFieldConfigurationModel,
  TaxpayerTextElementsDto,
  TaxpayerTextElementsModel,
  TaxpayerTinFieldConfigurationDto,
  TaxpayerTinFieldConfigurationModel,
  TaxpayerValidationMessagesDto,
  TaxpayerValidationMessagesModel,
} from '../types/form'
import { TaxpayerLimitsReachedBy } from '../constants'
import {
  TaxpayerEducationDto,
  TaxpayerEducationModel,
  TaxpayerEducationSectionDto,
  TaxpayerEducationSectionModel,
} from '../types/education'
import {
  TaxpayerReportAddressDto,
  TaxpayerReportAddressModel,
  TaxpayerReportBankAccountDto,
  TaxpayerReportBankAccountModel,
  TaxpayerReportDto,
  TaxpayerReportModel,
  TaxpayerReportMonthDto,
  TaxpayerReportMonthModel,
  TaxpayerReportQuarterDto,
  TaxpayerReportQuarterModel,
  TaxpayerReportSummaryDto,
  TaxpayerReportSummaryModel,
} from '../types/report'
import { transformCurrencyAmountDto } from './currency'
import { transformNationality } from './nationality'
import { transformAddress } from './address'

export const transformTaxpayerEducationSection = (
  taxpayerEducationSectionDto: TaxpayerEducationSectionDto,
): TaxpayerEducationSectionModel => ({
  title: taxpayerEducationSectionDto.title,
  body: taxpayerEducationSectionDto.body,
  icon: taxpayerEducationSectionDto.icon,
  iconUrl: taxpayerEducationSectionDto.icon_url,
  darkIconUrl: taxpayerEducationSectionDto.dark_icon_url,
})

export const transformTaxpayerEducation = (
  taxpayerEducationDto: TaxpayerEducationDto,
): TaxpayerEducationModel => ({
  sections: taxpayerEducationDto.sections.map(transformTaxpayerEducationSection),
})

export const transformTaxpayerGeneralFieldConfiguration = (
  fieldConfiguration: TaxpayerGeneralFieldConfigurationDto,
): TaxpayerGeneralFieldConfigurationModel => ({
  fieldTitle: fieldConfiguration.title,
  fieldName: fieldConfiguration.field_name,
  value: fieldConfiguration.value,
  placeholder: fieldConfiguration.placeholder,
  order: fieldConfiguration.order,
})

export const transformAddressDetails = (
  address: TaxpayerAddressValueDto,
): TaxpayerAddressValueModel => ({
  externalUserAddressId: address.external_user_address_id,
  name: address.name,
  line1: address.line1,
  line2: address.line2,
  city: address.city,
  postalCode: address.postal_code,
  state: address.state,
  countryCode: address.country_code,
})

export const transformTaxpayerBillingAddressFieldConfiguration = (
  fieldConfiguration: TaxpayerBillingAddressFieldConfigurationDto,
): TaxpayerBillingAddressFieldConfigurationModel => ({
  fieldTitle: fieldConfiguration.title,
  addressDetails: fieldConfiguration.address_details
    ? transformAddressDetails(fieldConfiguration.address_details)
    : null,
  value: fieldConfiguration.address ? transformAddress(fieldConfiguration.address) : null,
  ...(fieldConfiguration.order && { order: fieldConfiguration.order }),
})

export const transformTaxpayerCountryOfTaxResidencyFieldConfiguration = (
  fieldConfiguration: TaxpayerCountryOfTaxResidencyFieldConfigurationDto,
): TaxpayerCountryOfTaxResidencyFieldConfigurationModel => ({
  fieldTitle: fieldConfiguration.title,
  fieldName: fieldConfiguration.field_name,
  value: {
    code: fieldConfiguration.value.code,
    title: fieldConfiguration.value.title,
  },
  placeholder: fieldConfiguration.placeholder,
  ...(fieldConfiguration.order && { order: fieldConfiguration.order }),
})

export const transformTaxpayerTinFieldConfiguration = (
  fieldConfiguration: TaxpayerTinFieldConfigurationDto,
): TaxpayerTinFieldConfigurationModel => ({
  fieldTitle: fieldConfiguration.title,
  fieldName: fieldConfiguration.field_name,
  value: fieldConfiguration.value,
  info: {
    screenTitle: fieldConfiguration.info.screen_title,
    title: fieldConfiguration.info.title,
    body: fieldConfiguration.info.body,
  },
  emptyValidationMessage: fieldConfiguration.validation_messages
    ? fieldConfiguration.validation_messages.empty
    : null,
  placeholder: fieldConfiguration.placeholder,
  provided: fieldConfiguration.provided,
  optional: fieldConfiguration.optional,
  ...(fieldConfiguration.order && { order: fieldConfiguration.order }),
})

export const transformTaxpayerBirthplaceCountryFieldConfiguration = (
  fieldConfiguration: TaxpayerBirthplaceCountryFieldConfigurationDto,
): TaxpayerBirthplaceCountryFieldConfigurationModel => ({
  fieldTitle: fieldConfiguration.title,
  value: fieldConfiguration.value
    ? {
        code: fieldConfiguration.value.code,
        title: fieldConfiguration.value.title,
      }
    : null,
  placeholder: fieldConfiguration.placeholder,
  ...(fieldConfiguration.order && { order: fieldConfiguration.order }),
})

export const transformTaxpayerGeneralBusinessFieldConfiguration = (
  fieldConfiguration: TaxpayerGeneralBusinessFieldConfigurationDto,
): TaxpayerGeneralBusinessFieldConfigurationModel => ({
  fieldTitle: fieldConfiguration.title,
  fieldName: fieldConfiguration.field_name,
  value: fieldConfiguration.value,
  placeholder: fieldConfiguration.placeholder,
  locked: fieldConfiguration.locked,
  optional: fieldConfiguration.optional,
  ...(fieldConfiguration.order && { order: fieldConfiguration.order }),
})

export const transformTaxpayerBusinessAddressFieldConfiguration = (
  fieldConfiguration: TaxpayerBusinessAddressFieldConfigurationDto,
): TaxpayerBusinessAddressFieldConfigurationModel => ({
  fieldTitle: fieldConfiguration.title,
  fieldName: fieldConfiguration.field_name,
  value: fieldConfiguration.value,
  locked: fieldConfiguration.locked,
  addressDetails: fieldConfiguration.address_details
    ? transformAddressDetails(fieldConfiguration.address_details)
    : null,
  address: fieldConfiguration.address ? transformAddress(fieldConfiguration.address) : null,
  ...(fieldConfiguration.order && { order: fieldConfiguration.order }),
})

export const transformBusinessEstablishmentCountriesConfiguration = (
  fieldConfiguration: TaxpayerBusinessEstablishmentCountriesConfigurationDto,
): TaxpayerBusinessEstablishmentCountriesConfigurationModel => ({
  fieldName: fieldConfiguration.field_name,
  fieldTitle: fieldConfiguration.title,
  info: fieldConfiguration.info,
  placeholder: fieldConfiguration.placeholder,
  value: fieldConfiguration.value,
  locked: fieldConfiguration.locked,
  ...(fieldConfiguration.order && { order: fieldConfiguration.order }),
})

export const transformTaxpayerTextElements = (
  textElements: TaxpayerTextElementsDto,
): TaxpayerTextElementsModel => ({
  firstStepTitle: textElements.first_step_title,
  secondStepTitle: textElements.second_step_title,
})

export const transformValidationMessages = (
  validationMessages: TaxpayerValidationMessagesDto,
): TaxpayerValidationMessagesModel => ({
  tinOrBirthplaceRequired: validationMessages.tin_or_birthplace_required,
})

export const transformTaxpayerFormConfiguration = (
  taxpayerFormConfigurationDto: TaxpayerFormConfigurationDto,
  textElementsDto?: TaxpayerTextElementsDto,
  validationMessagesDto?: TaxpayerValidationMessagesDto,
  limitsReachedBy?: TaxpayerLimitsReachedBy | null,
): TaxpayerFormConfigurationModel => ({
  firstName: taxpayerFormConfigurationDto.first_name
    ? transformTaxpayerGeneralFieldConfiguration(taxpayerFormConfigurationDto.first_name)
    : null,
  lastName: taxpayerFormConfigurationDto.last_name
    ? transformTaxpayerGeneralFieldConfiguration(taxpayerFormConfigurationDto.last_name)
    : null,
  birthday: taxpayerFormConfigurationDto.birthdate
    ? transformTaxpayerGeneralFieldConfiguration(taxpayerFormConfigurationDto.birthdate)
    : null,
  billingAddress: taxpayerFormConfigurationDto.billing_address_id
    ? transformTaxpayerBillingAddressFieldConfiguration(
        taxpayerFormConfigurationDto.billing_address_id,
      )
    : null,
  countryOfTaxResidency: taxpayerFormConfigurationDto.country_of_tax_residency
    ? transformTaxpayerCountryOfTaxResidencyFieldConfiguration(
        taxpayerFormConfigurationDto.country_of_tax_residency,
      )
    : null,
  tin: taxpayerFormConfigurationDto.tin
    ? transformTaxpayerTinFieldConfiguration(taxpayerFormConfigurationDto.tin)
    : null,
  birthplaceCountry: taxpayerFormConfigurationDto.birthplace_country
    ? transformTaxpayerBirthplaceCountryFieldConfiguration(
        taxpayerFormConfigurationDto.birthplace_country,
      )
    : null,
  birthplaceCity: taxpayerFormConfigurationDto.birthplace_city
    ? transformTaxpayerGeneralFieldConfiguration(taxpayerFormConfigurationDto.birthplace_city)
    : null,
  businessName: taxpayerFormConfigurationDto.business_name
    ? transformTaxpayerGeneralBusinessFieldConfiguration(taxpayerFormConfigurationDto.business_name)
    : null,
  businessCode: taxpayerFormConfigurationDto.business_code
    ? transformTaxpayerGeneralBusinessFieldConfiguration(taxpayerFormConfigurationDto.business_code)
    : null,
  secondaryBusinessCode: taxpayerFormConfigurationDto.secondary_business_code
    ? transformTaxpayerGeneralBusinessFieldConfiguration(
        taxpayerFormConfigurationDto.secondary_business_code,
      )
    : null,
  vatNumber: taxpayerFormConfigurationDto.vat_number
    ? transformTaxpayerGeneralBusinessFieldConfiguration(taxpayerFormConfigurationDto.vat_number)
    : null,
  businessAddress: taxpayerFormConfigurationDto.business_address_id
    ? transformTaxpayerBusinessAddressFieldConfiguration(
        taxpayerFormConfigurationDto.business_address_id,
      )
    : null,
  businessEstablishmentCountries: taxpayerFormConfigurationDto.business_establishment_countries
    ? transformBusinessEstablishmentCountriesConfiguration(
        taxpayerFormConfigurationDto.business_establishment_countries,
      )
    : null,
  textElements: textElementsDto ? transformTaxpayerTextElements(textElementsDto) : undefined,
  validationMessages: validationMessagesDto
    ? transformValidationMessages(validationMessagesDto)
    : undefined,
  limitsReachedBy,
})

export const transformTaxpayerFormStatusResp = (
  taxpayerFormStatusResp: TaxpayerFormStatusResp,
): TaxpayerFormStatusModel => ({
  applicable: taxpayerFormStatusResp.applicable,
  country: taxpayerFormStatusResp.country,
  businessType: taxpayerFormStatusResp.entity_type,
  taxpayer: taxpayerFormStatusResp.taxpayer
    ? {
        firstName: taxpayerFormStatusResp.taxpayer.first_name,
        lastName: taxpayerFormStatusResp.taxpayer.last_name,
        taxIdentificationNumber: taxpayerFormStatusResp.taxpayer.tin,
        businessCode: taxpayerFormStatusResp.taxpayer.business_code,
        businessName: taxpayerFormStatusResp.taxpayer.business_name,
      }
    : null,
  reports: taxpayerFormStatusResp.reports ? [...taxpayerFormStatusResp.reports] : null,
})

export const transformTaxpayerReportSummary = (
  summary: TaxpayerReportSummaryDto,
): TaxpayerReportSummaryModel => ({
  transactionsCount: summary.transactions_count,
  amount: transformCurrencyAmountDto(summary.amount),
})

export const transformTaxpayerReportMonth = (
  month: TaxpayerReportMonthDto,
): TaxpayerReportMonthModel => ({
  title: month.title,
  transactionsCount: month.transactions_count,
  amount: transformCurrencyAmountDto(month.amount),
})

export const transformTaxpayerReportQuarter = (
  quarter: TaxpayerReportQuarterDto,
): TaxpayerReportQuarterModel => ({
  title: quarter.title,
  amount: transformCurrencyAmountDto(quarter.amount),
  transactionsCount: quarter.transactions_count,
  months: quarter.months.map(month => transformTaxpayerReportMonth(month)),
})

export const transformTaxpayerReportBankAccount = (
  account: TaxpayerReportBankAccountDto,
): TaxpayerReportBankAccountModel => ({
  accountNumber: account.account_number,
  holderName: account.holder_name,
})

export const transformTaxpayerReportAddress = (
  address: TaxpayerReportAddressDto,
): TaxpayerReportAddressModel => ({
  name: address.name,
  line1: address.line1,
  line2: address.line2,
  city: address.city,
  postalCode: address.postal_code,
  country: transformNationality(address.country),
})

export const transformTaxpayerReport = (report: TaxpayerReportDto): TaxpayerReportModel => ({
  summary: transformTaxpayerReportSummary(report.summary),
  quarters: report.quarters.map(quarter => transformTaxpayerReportQuarter(quarter)),
  firstName: report.first_name,
  lastName: report.last_name,
  birthdate: report.birthdate,
  country: report.country ? transformNationality(report.country) : null,
  tin: report.tin,
  birthplaceCity: report.birthplace_city,
  birthplaceCountry: report.birthplace_country
    ? transformNationality(report.birthplace_country)
    : null,
  vatNumber: report.vat_number,
  bankAccount: report.bank_account ? transformTaxpayerReportBankAccount(report.bank_account) : null,
  address: report.address ? transformTaxpayerReportAddress(report.address) : null,
  userEntityType: report.user_entity_type,
  businessName: report.business_name,
  businessCode: report.business_code,
  secondaryBusinessCode: report.secondary_business_code,
  businessEstablishmentCountries: report.business_establishment_countries
    ? report.business_establishment_countries.map(country => transformNationality(country))
    : null,
  title: report.title,
  year: report.year,
})
