import { Trans, useTranslation } from 'react-i18next'
import { metadata } from '#@/constants/metadata.ts'
import { UploadSelectButton } from '../../platform/components/upload-select-button.tsx'

export function HomeEmpty() {
  const { t } = useTranslation()
  return (
    <div className='mt-20 flex flex-col items-center justify-center gap-2 py-16 text-sm lg:text-xl'>
      <span className='icon-[mdi--package-variant] size-32 text-zinc-300' />
      <div className='text-(--gray-11)'>
        {t('Welcome to {{title}}.', {
          title: metadata.title,
        })}
      </div>
      <div className='text-(--gray-11) inline-flex items-center gap-1'>
        <Trans
          components={{
            1: <UploadSelectButton variant='soft' />,
          }}
          i18nKey='uploadRomsToGetStarted'
        />
      </div>
    </div>
  )
}
