import { DateTime } from 'luxon'
import { useTranslation } from 'react-i18next'
import { dateFormatMap } from '@/utils/isomorphic/i18n.ts'
import { usePreference } from './use-preference.ts'

type DateInput = Date | DateTime | string

function isValidJSDate(date: unknown): date is Date {
  return date instanceof Date && !Number.isNaN(date.getTime())
}

function getValidDate(dateInput: DateInput) {
  if (isValidJSDate(dateInput)) {
    return dateInput
  }

  if (typeof dateInput === 'string') {
    const date = new Date(dateInput)
    if (isValidJSDate(date)) {
      return date
    }

    const isoDate = DateTime.fromISO(dateInput, { zone: 'utc' }).toJSDate()
    if (isValidJSDate(isoDate)) {
      return isoDate
    }
  } else if (dateInput instanceof DateTime) {
    const date = dateInput.toJSDate()
    if (isValidJSDate(date)) {
      return date
    }
  }
}

function getValidDateTime(dateInput: DateInput) {
  if (dateInput instanceof DateTime && dateInput.isValid) {
    return dateInput
  }

  const date = getValidDate(dateInput)
  if (date) {
    return DateTime.fromJSDate(date, { zone: 'utc' }).setZone('utc')
  }
}

function isValidDate(dateInput: DateInput) {
  return Boolean(getValidDate(dateInput))
}

export function useDate() {
  const { i18n } = useTranslation()
  const { preference } = usePreference()
  const dateFormat = preference.ui.dateFormat === 'auto' ? dateFormatMap[i18n.language] : preference.ui.dateFormat

  function formatDate(dateInput: DateInput) {
    return getValidDateTime(dateInput)?.toFormat(dateFormat) || ''
  }

  function formatDateRelative(dateInput: DateInput) {
    return getValidDateTime(dateInput)?.toRelative({ locale: i18n.language }) || ''
  }

  return { dateFormat, formatDate, formatDateRelative, isValidDate }
}
