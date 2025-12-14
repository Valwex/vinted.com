import { CountryCode } from '@marketplace-web/country/country-data'

type CountryCodeToPhonePrefixMap = {
  [key in CountryCode]: string
}

export const COUNTRY_CODE_TO_PHONE_PREFIX_MAP: CountryCodeToPhonePrefixMap = {
  [CountryCode.At]: '+43',
  [CountryCode.Be]: '+32',
  [CountryCode.Cz]: '+420',
  [CountryCode.De]: '+49',
  [CountryCode.Dk]: '+45',
  [CountryCode.Ee]: '+372',
  [CountryCode.Es]: '+34',
  [CountryCode.Fi]: '+358',
  [CountryCode.Fr]: '+33',
  [CountryCode.Gr]: '+30',
  [CountryCode.Hr]: '+385',
  [CountryCode.Hu]: '+36',
  [CountryCode.Ie]: '+353',
  [CountryCode.It]: '+39',
  [CountryCode.Lt]: '+370',
  [CountryCode.Lu]: '+352',
  [CountryCode.Lv]: '+371',
  [CountryCode.Nl]: '+31',
  [CountryCode.Pl]: '+48',
  [CountryCode.Pt]: '+351',
  [CountryCode.Ro]: '+40',
  [CountryCode.Se]: '+46',
  [CountryCode.Sk]: '+421',
  [CountryCode.Si]: '+386',
  [CountryCode.Uk]: '+44',
  [CountryCode.Us]: '+1',
}
