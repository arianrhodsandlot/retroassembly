import { useTranslation } from 'react-i18next'
import { generatePath, useLoaderData } from 'react-router'
import type { loader } from '@/pages/routes/library-home.tsx'
import { routes } from '@/pages/routes.ts'
import LibraryLayout from '../components/library-layout/library-layout.tsx'
import { UploadSelectButton } from '../platform/components/upload-select-button.tsx'
import { GeneralSection } from './components/general-section.tsx'
import { HomeEmpty } from './components/home-empty.tsx'
import { JumpBackInSection } from './components/jump-back-in-section.tsx'

export function LibraryHomePage() {
  const { t } = useTranslation()
  const { newAddedRoms, recentlyLaunchedRoms } = useLoaderData<typeof loader>()

  const isEmpty = newAddedRoms.length === 0

  if (isEmpty) {
    return (
      <LibraryLayout>
        <HomeEmpty />
      </LibraryLayout>
    )
  }

  return (
    <LibraryLayout>
      <div className='pb-20'>
        <JumpBackInSection />

        {[
          {
            icon: 'icon-[mdi--recent]',
            link: generatePath(routes.libraryHistory),
            roms: recentlyLaunchedRoms,
            title: t('Recent'),
          },
          {
            icon: 'icon-[mdi--archive-add]',
            link: [generatePath(routes.libraryRoms), new URLSearchParams({ direction: 'desc', sort: 'added' })].join(
              '?',
            ),
            roms: newAddedRoms,
            suffix: <UploadSelectButton />,
            title: t('New added'),
          },
        ].map((props) => (
          <GeneralSection className='py-4' key={props.title} {...props} />
        ))}
      </div>
    </LibraryLayout>
  )
}
