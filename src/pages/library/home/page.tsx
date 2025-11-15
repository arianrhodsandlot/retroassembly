import { useTranslation } from 'react-i18next'
import { useLoaderData } from 'react-router'
import type { loader } from '@/pages/routes/library-home.tsx'
import LibraryLayout from '../components/library-layout/library-layout.tsx'
import { GeneralSection } from './components/general-section.tsx'
import { JumpBackInSection } from './components/jump-back-in-section.tsx'

export function LibraryHomePage() {
  const { t } = useTranslation()
  const { newAddedRoms, recentlyLaunchedRoms } = useLoaderData<typeof loader>()

  return (
    <LibraryLayout>
      <div className='pb-20'>
        <JumpBackInSection />

        {[
          { icon: 'icon-[mdi--recent]', roms: recentlyLaunchedRoms, title: t('Recent') },
          { icon: 'icon-[mdi--archive-add]', roms: newAddedRoms, title: t('New added') },
        ].map(({ icon, roms, title }) => (
          <GeneralSection className='py-4' icon={icon} key={title} roms={roms} title={title} />
        ))}
      </div>
    </LibraryLayout>
  )
}
