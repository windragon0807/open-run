export type ApiDateTime = string | number[] | null

export function parseApiDateTime(date: ApiDateTime) {
  if (date == null) {
    return null
  }

  if (Array.isArray(date)) {
    const [year, month, day, hour = 0, minute = 0, second = 0, nano = 0] = date

    if (year == null || month == null || day == null) {
      return null
    }

    const millisecond = Math.floor(nano / 1_000_000)
    const parsedDate = new Date(Date.UTC(year, month - 1, day, hour, minute, second, millisecond))

    return Number.isNaN(parsedDate.getTime()) ? null : parsedDate
  }

  const trimmedDate = date.trim()

  if (trimmedDate.length === 0) {
    return null
  }

  const hasExplicitTimezone = /(?:z|[+-]\d{2}:?\d{2})$/i.test(trimmedDate)
  const normalizedDate = hasExplicitTimezone ? trimmedDate : `${trimmedDate.replace(' ', 'T')}Z`
  const parsedDate = new Date(normalizedDate)

  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate
}
