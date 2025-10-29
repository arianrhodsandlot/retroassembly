import { Button } from '@radix-ui/themes'
import Cookies from 'js-cookie'
import { useEffect, useState } from 'react'
import { useLoaderData } from 'react-router'
import { cookieConsentStatusKey } from '@/constants/misc.ts'
import { initClarity } from '@/utils/client/clarity.ts'

export function CookieConsent() {
  const { cookieConsentStatus, isOfficialHost } = useLoaderData()
  const [visible, setVisible] = useState(!cookieConsentStatus)

  function handleClickAccept() {
    Cookies.set(cookieConsentStatusKey, '1', { expires: 3650 })
    initClarity()
    setVisible(false)
  }

  function handleClickDeny() {
    Cookies.set(cookieConsentStatusKey, '0', { expires: 3650 })
    setVisible(false)
  }

  useEffect(() => {
    initClarity()
  }, [])

  if (!visible || !isOfficialHost) {
    return
  }

  return (
    <div className='pointer-events-none fixed inset-x-4 bottom-4 z-10 text-xs'>
      <div className='border-(--accent-9) bg-(--gray-contrast) w-2xl pointer-events-auto mx-auto flex max-w-full items-center justify-center gap-2 rounded border px-4 py-2 shadow-xl'>
        <span className='icon-[mdi--cookie] size-6 shrink-0' />
        <div className='text-left'>
          We use{' '}
          <a
            className='underline'
            href='https://en.wikipedia.org/wiki/HTTP_cookie'
            rel='noopener noreferrer'
            target='_blank'
          >
            cookies
          </a>{' '}
          to improve users' experience. By using the site, you agree to our{' '}
          <a className='underline' href='/privacy-policy.md' rel='noopener noreferrer' target='_blank'>
            Privacy Policy
          </a>
          .
        </div>
        <div className='flex flex-col gap-2 lg:flex-row'>
          <Button onClick={handleClickAccept} size='1'>
            <span className='icon-[mdi--check]' />
            Accept
          </Button>
          <Button onClick={handleClickDeny} size='1' variant='soft'>
            <span className='icon-[mdi--close]' />
            Deny
          </Button>
        </div>
      </div>
    </div>
  )
}
