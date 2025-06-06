import { isThisYear, isToday, lightFormat } from 'date-fns'
import { customAlphabet } from 'nanoid'
import { nolookalikes } from 'nanoid-dictionary'

export const nanoid = customAlphabet(nolookalikes, 10)

export function restoreTitleForSorting(title: string) {
  // Match titles ending with ", A", ", An", or ", The" followed by optional additional info
  // eslint-disable-next-line security/detect-unsafe-regex
  const match = title.match(/^(.*),\s*(A|An|The)(\s*(?:\S.*)?)$/)
  if (match) {
    // Reconstruct: article + space + main title + additional info
    return `${match[2]} ${match[1]}${match[3]}`
  }
  // Return original string if no match
  return title
}

export function humanizeDate(date: Date) {
  if (isToday(date)) {
    return lightFormat(date, 'HH:mm:ss')
  }
  if (isThisYear(date)) {
    return lightFormat(date, 'MM-dd HH:mm')
  }
  return lightFormat(date, 'yyyy-MM-dd HH:mm')
}

export function encodeRFC3986URIComponent(str: string) {
  return encodeURIComponent(str).replaceAll(/[!'()*]/g, (c) => `%${c.codePointAt(0)?.toString(16).toUpperCase()}`)
}

export function serializeCookieHeader(name: string, value: string, options: any): string {
  let cookieString = `${name}=${value}`

  if (options) {
    if (options.domain) {
      cookieString += `; Domain=${options.domain}`
    }
    if (options.path) {
      cookieString += `; Path=${options.path}`
    }
    if (options.expires) {
      cookieString += `; Expires=${options.expires.toUTCString()}`
    }
    if (options.maxAge) {
      cookieString += `; Max-Age=${options.maxAge}`
    }
    if (options.secure) {
      cookieString += '; Secure'
    }
    if (options.httpOnly) {
      cookieString += '; HttpOnly'
    }
    if (options.sameSite) {
      cookieString += `; SameSite=${options.sameSite}`
    }
  }

  return cookieString
}
