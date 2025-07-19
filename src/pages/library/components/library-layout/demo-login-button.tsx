import { Link } from 'react-router'
import { RadixThemePortal } from '@/pages/components/radix-theme-portal.tsx'

export function DemoLoginButton() {
  return (
    <RadixThemePortal>
      <div className='pointer-events-none fixed inset-x-4 bottom-8 flex justify-center lg:bottom-20'>
        <Link
          className='bg-(--accent-9) motion-duration-3000 motion-preset-oscillate pointer-events-auto flex items-center gap-3 rounded-lg border-2 border-white px-4 py-2 text-sm font-semibold text-white shadow-xl lg:text-base'
          reloadDocument
          to='/login'
        >
          <span className='icon-[mdi--user-box] shrink-0' />
          <span>Log in to build a library uniquely yours!</span>
        </Link>
      </div>
    </RadixThemePortal>
  )
}
