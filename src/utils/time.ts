import { format, addHours } from 'date-fns'
import { ko } from 'date-fns/locale'
import { padStart } from './string'

export function currentDate() {
  return new Date()
}

export function toKSTDate(date: string | number | Date) {
  const utcDate = new Date(date)
  const kstDate = addHours(utcDate, 9)
  return kstDate
}

export function formatDate(date: string | number | Date, formatStr: string) {
  return format(date, formatStr, { locale: ko })
}

export function timerFormat({
  days,
  hours,
  minutes,
  seconds,
}: {
  days: number
  hours: number
  minutes: number
  seconds: number
}) {
  if (days > 0) {
    return `D-${days}`
  }

  return `${padStart(days)} : ${padStart(hours)} : ${padStart(minutes)} : ${padStart(seconds)}`
}
