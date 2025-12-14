import { PostAdvertisingLeadFormArgs } from '../types/advertising-lead-form'

export const postAdvertisingLeadFormArgsToParams = ({
  firstName,
  lastName,
  email,
  phoneNr,
  companyType,
  companyName,
  estimatedBudget,
  targetCountry,
  dealType,
  comment,
}: PostAdvertisingLeadFormArgs) => ({
  first_name: firstName,
  last_name: lastName,
  phone_nr: phoneNr,
  company_type: companyType,
  company_name: companyName,
  estimated_budget: estimatedBudget,
  target_country: targetCountry,
  deal_type: dealType,
  email,
  comment,
})
