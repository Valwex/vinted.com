export const relativeDate = ({
  years = 0,
  days = 0,
  hours = 0,
  minutes = 0,
  seconds = 0,
}: Partial<Record<'years' | 'days' | 'hours' | 'minutes' | 'seconds', number>>) => {
  const date = new Date()

  date.setFullYear(date.getFullYear() + years)
  date.setDate(date.getDate() + days)
  date.setHours(date.getHours() + hours)
  date.setMinutes(date.getMinutes() + minutes)
  date.setSeconds(date.getSeconds() + seconds)

  return date
}
