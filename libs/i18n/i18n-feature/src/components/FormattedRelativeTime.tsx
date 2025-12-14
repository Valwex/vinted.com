import { FormattedRelativeTime as IntlFormattedRelativeTime } from 'react-intl'

import { selectUnit } from '../utils/date'

type Props = {
  value: number
}

const FormattedRelativeTime = ({ value }: Props) => {
  if (Number.isNaN(value)) return null

  const { value: selectedUnitValue, unit } = selectUnit(value)

  const formattedDate = new Date(value).toLocaleDateString(undefined, {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  })

  return (
    <span title={formattedDate} suppressHydrationWarning>
      <IntlFormattedRelativeTime unit={unit} value={selectedUnitValue} />
    </span>
  )
}

export default FormattedRelativeTime
