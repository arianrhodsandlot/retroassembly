import { useLoaderData } from 'react-router'
import type { loader } from '@/pages/routes/library-home.tsx'
import LibraryLayout from '../components/library-layout/library-layout.tsx'
import { GeneralSection } from './components/general-section.tsx'
import { JumpBackInSection } from './components/jump-back-in-section.tsx'

export function LibraryHomePage() {
  const { newAddedRoms, recentlyLaunchedRoms } = useLoaderData<typeof loader>()

  return (
    <LibraryLayout>
      <div className='divide-y-solid divide-(--gray-5) flex flex-col divide-y pb-20 *:py-6'>
        <JumpBackInSection />

        {[
          { icon: 'icon-[mdi--archive-add]', roms: newAddedRoms, title: 'New added' },
          { icon: 'icon-[mdi--recent]', roms: recentlyLaunchedRoms, title: 'Recently launched' },
        ].map(({ icon, roms, title }) => (
          <GeneralSection icon={icon} key={title} roms={roms} title={title} />
        ))}
      </div>
    </LibraryLayout>
  )
}
