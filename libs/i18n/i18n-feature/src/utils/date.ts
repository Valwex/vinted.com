const MS_PER_SECOND = 1000

const SECONDS_PER_MINUTE = 60
const SECONDS_PER_HOUR = SECONDS_PER_MINUTE * 60
const SECONDS_PER_DAY = SECONDS_PER_HOUR * 24
const SECONDS_PER_WEEK = SECONDS_PER_DAY * 7

const AVERAGE_DAYS_PER_YEAR = 365.25
const AVERAGE_DAYS_PER_MONTH = 30.42

const defaultThresholds = {
  second: 45,
  minute: 45,
  hour: 22,
  day: 5,
  week: 3,
  month: 11,
}

export const selectUnit = (
  from: number,
  to: number = Date.now(),
  thresholds = defaultThresholds,
): { value: number; unit: Exclude<Intl.RelativeTimeFormatUnit, `${string}s`> } => {
  const seconds = (from - to) / MS_PER_SECOND
  if (Math.abs(seconds) < thresholds.second) {
    return {
      value: Math.round(seconds),
      unit: 'second',
    }
  }

  const minutes = seconds / SECONDS_PER_MINUTE
  if (Math.abs(minutes) < thresholds.minute) {
    return {
      value: Math.round(minutes),
      unit: 'minute',
    }
  }

  const hours = seconds / SECONDS_PER_HOUR
  if (Math.abs(hours) < thresholds.hour) {
    return {
      value: Math.round(hours),
      unit: 'hour',
    }
  }

  const days = seconds / SECONDS_PER_DAY
  if (Math.abs(days) < thresholds.day) {
    return {
      value: Math.round(days),
      unit: 'day',
    }
  }

  const weeks = seconds / SECONDS_PER_WEEK
  if (Math.abs(weeks) < thresholds.week) {
    return {
      value: Math.round(weeks),
      unit: 'week',
    }
  }

  const months = days / AVERAGE_DAYS_PER_MONTH
  if (Math.abs(months) < thresholds.month) {
    return {
      value: Math.round(months),
      unit: 'month',
    }
  }

  const years = days / AVERAGE_DAYS_PER_YEAR

  return {
    value: Math.round(years),
    unit: 'year',
  }
}
