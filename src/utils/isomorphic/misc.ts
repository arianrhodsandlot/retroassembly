import { trim } from 'es-toolkit'
import { DateTime } from 'luxon'
import sparkMd5 from 'spark-md5'
import { defaultLanguage } from './i18n.ts'

export function restoreTitleForSorting(title: string) {
  // Match titles ending with ", A", ", An", or ", The" followed by optional additional info
  // eslint-disable-next-line security/detect-unsafe-regex
  const match = /^(.*),\s*(A|An|The)(\s*(?:\S.*)?)$/.exec(title)
  if (match) {
    // Reconstruct: article + space + main title + additional info
    return `${match[2]} ${match[1]}${match[3]}`
  }
  // Return original string if no match
  return title
}

export function humanizeDate(date: string, dateFormat: string) {
  const dateTime = DateTime.fromJSDate(new Date(date))
  const now = DateTime.now()
  if (dateTime.hasSame(now, 'year')) {
    const shortFormat = trim(dateFormat.replace('yyyy', ''), ['-', '/', '.'])
    return dateTime.toFormat(`${shortFormat} HH:mm`)
  }
  return dateTime.toFormat(`${dateFormat} HH:mm`)
}

export function encodeRFC3986URIComponent(str: string) {
  return encodeURIComponent(str).replaceAll(/[!'()*]/g, (c) => `%${c.codePointAt(0)?.toString(16).toUpperCase()}`)
}

export async function getFileMd5(file: Blob) {
  const buffer = await file.arrayBuffer()
  return sparkMd5.ArrayBuffer.hash(buffer)
}

export function getHomePath(language: string) {
  return `/${language === defaultLanguage ? '' : language.toLowerCase()}`
}
