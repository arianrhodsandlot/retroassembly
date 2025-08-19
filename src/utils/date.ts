import { DateTime } from 'luxon'

export function stringToUTCDateTime(string?: string) {
  if (string) {
    const date = new Date(string)
    if (date.getTime()) {
      return DateTime.fromJSDate(date).setZone('utc', { keepLocalTime: true })
    }
  }
}
